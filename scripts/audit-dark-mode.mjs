#!/usr/bin/env node
/**
 * Script audit dark mode v3 — cari color classes yg ga punya dark: variant
 *
 * Pendekatan: untuk setiap kelas warna standalone, cek apakah elemen yg sama
 * (dalam window baris yg sama) sudah punya dark: variant APAPUN.
 *
 * v3 improvements:
 *  - Tidak pake shade mapping kaku, cukup cek keberadaan dark: variant
 *  - Handle opacity modifier (/30, /50, etc.)
 *  - Handle beda color family (primary→warm atau primary→black di dark mode)
 *  - Include blue-* color family
 *  - Context-aware: cek dalam 3 baris (bukan cuma 1 baris)
 */

import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const SRC_DIR = join(ROOT, 'src')
const BARKAS_PAGES = ['barkas']

const DESIGN_TOKENS = new Set([
	'surface',
	'surface-elevated',
	'surface-secondary',
	'surface-primary',
	'surface-inverse',
	'surface-subtle',
	'surface-placeholder',
	'surface-hover',
	'text-primary',
	'text-secondary',
	'text-muted',
	'text-inverse',
	'text-on-primary',
	'text-accent',
	'text-accent-primary',
	'text-alert',
	'text-gold',
	'text-sold',
	'border-primary',
	'border-secondary',
	'border-inverse',
	'border-accent',
	'accent-primary',
	'accent-gold',
	'accent-gold-light',
	'shadow-elevated',
	'shadow-elevated-hover',
	'shadow-card-hover',
	'shadow-image-hover',
	'shadow-accent-hover',
	'badge-primary-bg',
	'badge-primary-text',
	'badge-gold-bg',
	'badge-gold-text',
	'badge-alert-bg',
	'badge-alert-text',
	'whatsapp',
	'whatsapp-dark',
])

const SIZE_CLASSES = new Set([
	'text-xs',
	'text-sm',
	'text-base',
	'text-lg',
	'text-xl',
	'text-2xl',
	'text-3xl',
	'text-4xl',
	'text-5xl',
	'text-6xl',
	'text-7xl',
	'text-8xl',
	'text-9xl',
])

const COLOR_PREFIXES = [
	'bg',
	'text',
	'border',
	'ring',
	'from',
	'to',
	'via',
	'divide',
	'outline',
	'shadow',
]

function isBarkas(fp) {
	return BARKAS_PAGES.some((b) => fp.includes(`/${b}/`) || fp.includes(`\\${b}\\`))
}

function isDesignToken(cls) {
	const parts = cls.split('-')
	const colorPart = parts.slice(1).join('-')
	return DESIGN_TOKENS.has(colorPart)
}

function isNonColor(cls) {
	if (SIZE_CLASSES.has(cls)) return true
	if (
		/^bg-(gradient-to|center|cover|contain|repeat|no-repeat|fixed|local|scroll|auto|left|right|top|bottom)/.test(
			cls,
		)
	)
		return true
	if (/^text-(left|center|right|justify)/.test(cls)) return true
	if (/^border-(solid|dashed|dotted|double|none)/.test(cls)) return true
	if (/^ring-(inset|offset-)/.test(cls)) return true
	return false
}

/**
 * Extract color classes dari konten file.
 * Format: {prefix}-{family}-{shade}(/{opacity})?
 * Contoh: bg-primary-700, text-warm-900/50, border-red-300, shadow-primary-900/10
 * Juga catch: from-black, to-white (tanpa shade number)
 */
function extractColorClasses(content) {
	// Match both numeric-shade colors (primary-900, warm-50) and named colors (black, white, transparent, current)
	const pattern = new RegExp(
		`(?<![\\w-#])((?:dark:)?(?:${COLOR_PREFIXES.join('|')})-(?:` +
			`(?:primary|warm|gold|red|green|blue)-(?:\\d{2,3})(?:/\\d+)?` +
			`|` +
			`(?:black|white|transparent|current)(?:/\\d+)?` +
			`))(?![\\w-])`,
		'g',
	)
	const matches = content.matchAll(pattern)
	const set = new Set()
	for (const m of matches) set.add(m[0])
	return Array.from(set)
}

/**
 * Check if a class appears standalone (not only inside a state/dark: prefix).
 */
function appearsStandalone(content, cls) {
	const regex = new RegExp(`(?<![\\w-/:])${escapeRegex(cls)}(?![\\w-/:])`, 'g')
	for (;;) {
		const match = regex.exec(content)
		if (match === null) break
		const idx = match.index
		const before = content.slice(Math.max(0, idx - 25), idx)
		if (
			/(?:^|\s)(dark|hover|focus|active|group-hover|group-focus|focus-visible|focus-within|disabled|invalid|visited|checked|selected|open|motion-safe|motion-reduce|print|landscape|portrait|data-\[[^\]]*\]):$/i.test(
				before.trim(),
			)
		) {
			continue
		}
		return true
	}
	return false
}

function escapeRegex(s) {
	return s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
}

/**
 * Cek apakah dalam LOKASI yg sama (~3 baris) ada dark: variant.
 * Mencari dark:{prefix}-APAPUN (tanpa peduli family/shade).
 * Handle: dark:bg-primary-900, dark:text-black/60, dark:from-black/50, dll.
 */
function hasDarkVariantInContext(cls, lineNum, lines) {
	const prefix = cls.split('-')[0] // bg, text, border, etc.

	const startLine = Math.max(0, lineNum - 1)
	const endLine = Math.min(lines.length - 1, lineNum + 1)

	for (let i = startLine; i <= endLine; i++) {
		const line = lines[i]
		// Cari dark:variant utk prefix yg sama — apapun family/shade/opacity-nya
		const darkRegex = new RegExp(`dark:${prefix}-[a-zA-Z]+(?:-\\d+)?(?:/\\d+)?`, 'g')
		const matches = line.matchAll(darkRegex)
		for (const _m of matches) {
			return true // Ada dark variant → aman
		}
	}
	return false
}

function scanFile(filePath) {
	const content = readFileSync(filePath, 'utf-8')
	const lines = content.split('\n')
	const allColorClasses = extractColorClasses(content)

	const safe = []
	const gaps = []
	const darkOnly = []

	for (const cls of allColorClasses) {
		// Skip dark: prefixed classes
		if (cls.startsWith('dark:')) continue
		if (isNonColor(cls)) continue

		// Design tokens auto-handle dark mode
		if (isDesignToken(cls)) {
			safe.push(cls)
			continue
		}

		// Must be a prefix-color pattern
		const prefix = cls.split('-')[0]
		if (!COLOR_PREFIXES.includes(prefix)) continue

		// Skip absolute colors: white, black, transparent, current — same in both modes
		const rawPart = cls.slice(prefix.length + 1) // e.g., 'white', 'white/80', 'black/60', 'transparent', 'current'
		const absColors = ['white', 'black', 'transparent', 'current']
		if (absColors.some((c) => rawPart === c || rawPart.startsWith(`${c}/`))) {
			safe.push(cls)
			continue
		}

		// Skip universal/branded visual elements, depth shadows, and subtle ambient overlays:
		// - WhatsApp green-600, Facebook blue-600, etc.
		// - Rating stars text-gold-500, branding accents text-gold-400
		// - Depth shadows shadow-primary-950/30, shadow-primary-900/5
		// - Subtle ambient ornaments with low opacity (e.g. bg-gold-400/20, bg-primary-600/15)
		const isLowOpacityOverlay = /\/(?:[12]\d|30|[1-9])$/.test(cls)
		const isUniversalBranding =
			cls === 'bg-green-600' ||
			cls === 'bg-blue-600' ||
			cls === 'text-gold-500' ||
			cls === 'text-gold-400' ||
			cls === 'fill-gold-500' ||
			cls.startsWith('shadow-primary-') ||
			isLowOpacityOverlay

		if (isUniversalBranding) {
			safe.push(cls)
			continue
		}

		// Check if it appears standalone
		if (!appearsStandalone(content, cls)) {
			darkOnly.push(cls)
			continue
		}

		// Find line numbers where this class appears
		const clsRegex = new RegExp(`(?<![\\w-/:])${escapeRegex(cls)}(?![\\w-/:])`, 'g')
		const foundLines = new Set()
		for (;;) {
			const match = clsRegex.exec(content)
			if (match === null) break
			const lineNum = content.slice(0, match.index).split('\n').length - 1
			foundLines.add(lineNum)
		}

		// Check each occurrence for nearby dark variant or ignore comments
		let hasDark = false
		let isIgnored = false
		for (const lineNum of foundLines) {
			const line = lines[lineNum]
			if (line && (line.includes('audit-ignore-dark') || line.includes('dark:ignore'))) {
				isIgnored = true
				break
			}
			if (hasDarkVariantInContext(cls, lineNum, lines)) {
				hasDark = true
				break
			}
		}

		if (isIgnored) {
			safe.push(cls)
		} else if (!hasDark) {
			gaps.push({ class: cls, lines: Array.from(foundLines).sort() })
		} else {
			safe.push(cls)
		}
	}

	return { safe, gaps, darkOnly }
}

function findFiles(dir, results = []) {
	const entries = readdirSync(dir, { withFileTypes: true })
	for (const entry of entries) {
		const fp = join(dir, entry.name)
		if (entry.isDirectory()) {
			if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
			findFiles(fp, results)
		} else if (
			entry.name.endsWith('.astro') ||
			entry.name.endsWith('.tsx') ||
			entry.name.endsWith('.jsx')
		) {
			if (!isBarkas(fp)) results.push(fp)
		}
	}
	return results
}

// === MAIN ===
const files = findFiles(SRC_DIR)
console.log(`\n📂 Scanning ${files.length} file komponen...\n`)

let totalGaps = 0
let totalDarkOnly = 0
const allGaps = []

for (const file of files) {
	const rel = relative(ROOT, file)
	const r = scanFile(file)
	totalDarkOnly += r.darkOnly.length
	if (r.gaps.length > 0) {
		console.log(`\n❌ ${rel}`)
		for (const g of r.gaps) {
			console.log(`   · \x1b[31m${g.class}\x1b[0m (line ${g.lines.join(', ')})`)
			allGaps.push({ file: rel, ...g })
		}
		totalGaps += r.gaps.length
	}
}

console.log('\n══════════════════════════════════════════')
console.log(`📊 Ringkasan:`)
console.log(`   ✅ Design token (auto dark):              di semua file`)
console.log(`   ⏭️  Hanya dalam dark:/hover: prefix:       ${totalDarkOnly} kelas (sudah aman)`)
console.log(`   ❌ Standalone tanpa dark: variant:         ${totalGaps} kelas`)
console.log('══════════════════════════════════════════\n')

if (allGaps.length > 0) {
	console.log('📋 Daftar semua gap:')
	const byFile = {}
	for (const g of allGaps) {
		if (!byFile[g.file]) byFile[g.file] = []
		byFile[g.file].push(g)
	}
	for (const [file, gaps] of Object.entries(byFile)) {
		console.log(`\n  ${file}:`)
		for (const g of gaps) {
			console.log(`    · ${g.class} (line ${g.lines.join(', ')})`)
		}
	}
}

console.log('\n📈 Per-file coverage:')
for (const file of files) {
	const rel = relative(ROOT, file)
	const r = scanFile(file)
	const status = r.gaps.length > 0 ? '❌' : '✅'
	console.log(
		`  ${status} ${rel.padEnd(55)} ${r.safe.length.toString().padStart(2)} safe, ${r.darkOnly.length.toString().padStart(2)} dark-only, ${r.gaps.length.toString().padStart(2)} gaps`,
	)
}
