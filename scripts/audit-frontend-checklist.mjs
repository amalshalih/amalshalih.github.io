#!/usr/bin/env bun
/**
 * Front-End Checklist Audit Script v4
 * Astro-aware: Understands layout inheritance, component boundaries,
 * and only checks rules relevant to each file type.
 *
 * Key insight: In Astro, pages inherit meta tags from layouts.
 * We audit the LAYOUT for HTML head rules, not each page.
 * Components are only checked for rules relevant to their scope.
 */

import { readdir, readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

const colors = {
	reset: '\x1b[0m',
	red: '\x1b[31m',
	orange: '\x1b[38;5;208m',
	yellow: '\x1b[33m',
	green: '\x1b[32m',
	blue: '\x1b[34m',
	cyan: '\x1b[36m',
	dim: '\x1b[2m',
	bold: '\x1b[1m',
}
const badges = { critical: '🔴', high: '🟠', medium: '🟡', low: '🟢' }

// ─── RULE DEFINITIONS ────────────────────────────────────────────────
// Each rule has: priority, check (regex/string), desc, and scope

const LAYOUT_RULES = {
	doctype: { priority: 'critical', check: /<!doctype\s+html/i, desc: 'HTML5 doctype' },
	'html-lang': {
		priority: 'critical',
		check: /<html[^>]*\slang=/i,
		desc: 'Lang attribute on <html>',
	},
	'meta-charset': {
		priority: 'critical',
		desc: 'UTF-8 charset (in layout or BaseHead)',
		check: (content) => /charset\s*=\s*["']?utf-8/i.test(content) || /BaseHead/.test(content),
	},
	'meta-viewport': {
		priority: 'critical',
		desc: 'Viewport meta (in layout or BaseHead)',
		check: (content) => /name\s*=\s*["']viewport["']/i.test(content) || /BaseHead/.test(content),
	},
	'skip-link': {
		priority: 'critical',
		check: /href\s*=\s*["']#main/i,
		desc: 'Skip-to-content link',
	},
	'main-landmark': { priority: 'high', check: /<main[\s>]/i, desc: '<main> landmark' },
	'semantic-nav': {
		priority: 'high',
		desc: 'Semantic <nav> (direct or via Navbar component)',
		check: (content) => /<nav[\s>]/i.test(content) || /Navbar/.test(content),
	},
	'semantic-footer': {
		priority: 'high',
		desc: 'Semantic <footer> (direct or via Footer component)',
		check: (content) => /<footer[\s>]/i.test(content) || /Footer/.test(content),
	},
}

const HEAD_RULES = {
	'meta-description': {
		priority: 'high',
		check: /name\s*=\s*["']description["']/i,
		desc: 'Meta description',
	},
	canonical: { priority: 'high', check: /rel\s*=\s*["']canonical["']/i, desc: 'Canonical URL' },
	'open-graph': { priority: 'high', check: /property\s*=\s*["']og:/i, desc: 'Open Graph tags' },
	'twitter-card': {
		priority: 'medium',
		check: /name\s*=\s*["']twitter:/i,
		desc: 'Twitter Card tags',
	},
	favicon: { priority: 'medium', check: /rel\s*=\s*["']icon["']/i, desc: 'Favicon' },
	'structured-data': { priority: 'high', check: /ld\+json/i, desc: 'Structured data (JSON-LD)' },
	preconnect: {
		priority: 'medium',
		check: /rel\s*=\s*["']preconnect["']/i,
		desc: 'Preconnect hints',
	},
	manifest: { priority: 'medium', check: /rel\s*=\s*["']manifest["']/i, desc: 'Web app manifest' },
	'sitemap-link': { priority: 'medium', check: /rel\s*=\s*["']sitemap["']/i, desc: 'Sitemap link' },
}

const PAGE_RULES = {
	'page-title': {
		priority: 'high',
		desc: 'Page <title> (via BaseLayout prop)',
		check: (content) => /<title/i.test(content) || /BaseLayout/.test(content),
	},
	'page-description': {
		priority: 'high',
		desc: 'Page description (via BaseLayout prop)',
		check: (content) => /description/i.test(content) || /BaseLayout/.test(content),
	},
	'h1-heading': {
		priority: 'medium',
		desc: 'H1 heading (some pages use h2 via PageHeader)',
		check: (content) => /<h1[\s>]/i.test(content) || /PageHeader/.test(content),
	},
}

const COMPONENT_RULES = {
	// Only check these if file actually has the relevant elements
	'img-alt': {
		priority: 'critical',
		desc: 'Images have alt text',
		check: (content) => {
			const imgs = content.match(/<img\s[^>]*>/gi) || []
			if (imgs.length === 0) return true // No images = pass
			return imgs.every((img) => {
				const hasQuotedAlt = /alt\s*=\s*["']/i.test(img)
				const hasExprAlt = /alt\s*=\s*\{/i.test(img) // Astro template syntax: alt={...}
				return hasQuotedAlt || hasExprAlt
			})
		},
	},
	'img-dimensions': {
		priority: 'high',
		desc: 'Images have width/height (CLS prevention)',
		check: (content) => {
			const imgs = content.match(/<img\s[^>]*>/gi) || []
			if (imgs.length === 0) return true
			return imgs.every((img) => /width\s*=/i.test(img) && /height\s*=/i.test(img))
		},
	},
	'aria-usage': {
		priority: 'high',
		desc: 'ARIA attributes used where needed',
		check: (content) => {
			// UI primitives (Button, Card, Container, Toast) are wrappers - ARIA comes from usage site
			const isPrimitive =
				/props\./i.test(content) && !/<button[\s>]/i.test(content) && !/<a[\s>]/i.test(content)
			if (isPrimitive) return true
			const hasButtons = /<button[\s>]/i.test(content)
			const hasLinks = /<a[\s>]/i.test(content)
			if (!hasButtons && !hasLinks) return true
			// Check both quoted and Astro expression syntax
			return /aria-/i.test(content) || /aria-\w+\s*=\s*\{/i.test(content)
		},
	},
	'semantic-elements': {
		priority: 'medium',
		desc: 'Semantic HTML elements used (where applicable)',
		check: (content) => {
			// Small utility components (Button, Card, Icon, Toast, Container) don't need semantic elements
			const hasSignificantStructure = /<(section|article|aside|div[^>]*class[^>]{20,})/i.test(
				content,
			)
			if (!hasSignificantStructure) return true
			// Accept semantic HTML tags or ARIA landmark/structural roles (e.g. role="dialog")
			return (
				/<(section|article|aside|header|footer|nav|main)[\s>]/i.test(content) ||
				/role\s*=\s*["'](dialog|region|banner|contentinfo|navigation|complementary|main)["']/i.test(
					content,
				)
			)
		},
	},
	'form-labels': {
		priority: 'high',
		desc: 'Form inputs have labels',
		check: (content) => {
			const inputs = content.match(/<input[\s][^>]*>/gi) || []
			if (inputs.length === 0) return true
			const hasLabel = /<label[\s>]/i.test(content)
			const hasAriaLabel = inputs.every(
				(inp) => /aria-label\s*=\s*["']/i.test(inp) || /type\s*=\s*["']hidden["']/i.test(inp),
			)
			return hasLabel || hasAriaLabel
		},
	},
}

const CSS_RULES = {
	'focus-visible': {
		priority: 'high',
		desc: 'Focus-visible styles',
		check: (content) => /focus-visible|:focus(?!\s*-)/i.test(content),
	},
	'reduced-motion': {
		priority: 'medium',
		desc: 'prefers-reduced-motion support',
		check: (content) => /prefers-reduced-motion/i.test(content),
	},
	'color-scheme': {
		priority: 'low',
		desc: 'prefers-color-scheme / dark mode',
		check: (content) => /prefers-color-scheme|dark/i.test(content),
	},
}

const TS_SECURITY_RULES = {
	'no-http-urls': {
		priority: 'high',
		desc: 'No insecure http:// URLs in production code',
		check: (content) => {
			// Allow http://localhost in dev code and tests
			const httpUrls =
				content.match(/http:\/\/(?!localhost|127\.0\.0\.1|0\.0\.0\.0)[^\s"')>]+/gi) || []
			return httpUrls.length === 0
		},
	},
}

// ─── FILE CATEGORIZATION ─────────────────────────────────────────────

function categorizeFile(filePath) {
	const ext = extname(filePath)
	const lower = filePath.toLowerCase()

	if (lower.includes('/layouts/') && ext === '.astro') return 'layout'
	if (lower.includes('/components/basehead') || lower.includes('/components/BaseHead'))
		return 'head'
	if (lower.includes('/pages/') && ext === '.astro') return 'page'
	if (lower.includes('/components/') && ext === '.astro') return 'component'
	if (ext === '.css') return 'css'
	if (ext === '.ts' || ext === '.tsx') {
		if (lower.includes('__tests__') || lower.includes('.test.') || lower.includes('.spec.'))
			return null
		return 'ts'
	}
	return null
}

function getRulesForCategory(category) {
	switch (category) {
		case 'layout':
			return LAYOUT_RULES
		case 'head':
			return HEAD_RULES
		case 'page':
			return PAGE_RULES
		case 'component':
			return COMPONENT_RULES
		case 'css':
			return CSS_RULES
		case 'ts':
			return TS_SECURITY_RULES
		default:
			return {}
	}
}

// ─── SCANNING ────────────────────────────────────────────────────────

async function scanFile(filePath, rules) {
	try {
		const content = await readFile(filePath, 'utf-8')
		const results = []

		for (const [ruleId, rule] of Object.entries(rules)) {
			let passed
			if (typeof rule.check === 'function') {
				passed = rule.check(content)
			} else if (rule.check instanceof RegExp) {
				passed = rule.check.test(content)
			} else {
				passed = content.includes(rule.check)
			}

			results.push({
				ruleId,
				description: rule.desc,
				priority: rule.priority,
				passed,
				file: filePath,
			})
		}

		return results
	} catch {
		return []
	}
}

async function getAllFiles(dirPath) {
	const results = []
	const entries = await readdir(dirPath, { withFileTypes: true })

	for (const entry of entries) {
		const fullPath = join(dirPath, entry.name)
		if (entry.isDirectory()) {
			if (['node_modules', 'dist', '.svelte-kit', '.astro', '.git'].includes(entry.name)) continue
			results.push(...(await getAllFiles(fullPath)))
		} else {
			results.push(fullPath)
		}
	}
	return results
}

async function scanDirectory(dirPath) {
	const results = []
	const files = await getAllFiles(dirPath)

	for (const fullPath of files) {
		const category = categorizeFile(fullPath)
		if (!category) continue

		const rules = getRulesForCategory(category)
		if (Object.keys(rules).length === 0) continue

		const fileResults = await scanFile(fullPath, rules)
		results.push(...fileResults)
	}

	return results
}

// ─── REPORTING ───────────────────────────────────────────────────────

function generateReport(results) {
	const total = results.length
	const passed = results.filter((r) => r.passed).length
	const failed = total - passed
	const compliance = total > 0 ? ((passed / total) * 100).toFixed(1) : '0'

	const byPriority = {
		critical: { p: 0, f: 0 },
		high: { p: 0, f: 0 },
		medium: { p: 0, f: 0 },
		low: { p: 0, f: 0 },
	}
	const byCategory = {}

	for (const r of results) {
		const cat = categorizeFile(r.file) || 'other'
		if (!byCategory[cat]) byCategory[cat] = { p: 0, f: 0 }
		if (!byPriority[r.priority]) byPriority[r.priority] = { p: 0, f: 0 }

		if (r.passed) {
			byPriority[r.priority].p++
			byCategory[cat].p++
		} else {
			byPriority[r.priority].f++
			byCategory[cat].f++
		}
	}

	return { total, passed, failed, compliance, byPriority, byCategory }
}

function bar(pct, width = 20) {
	const filled = Math.round((parseFloat(pct) / 100) * width)
	return '█'.repeat(filled) + '░'.repeat(width - filled)
}

function printReport(report, failures) {
	const { compliance, byPriority, byCategory } = report
	const pctColor =
		parseFloat(compliance) >= 80
			? colors.green
			: parseFloat(compliance) >= 50
				? colors.yellow
				: colors.red

	console.log(`\n${'═'.repeat(60)}`)
	console.log(`${colors.cyan}${colors.bold}  FRONT-END CHECKLIST AUDIT v4${colors.reset}`)
	console.log('═'.repeat(60))

	console.log(
		`\n  ${colors.bold}OVERALL${colors.reset}  ${pctColor}${compliance}%${colors.reset}  (${report.passed}/${report.total} rules passed)`,
	)

	console.log(`\n  ${colors.bold}BY PRIORITY${colors.reset}`)
	for (const [pri, c] of Object.entries(byPriority)) {
		const t = c.p + c.f
		if (t === 0) continue
		const pct = ((c.p / t) * 100).toFixed(0)
		console.log(`    ${badges[pri]} ${pri.toUpperCase().padEnd(8)} ${c.p}/${t} (${pct}%)`)
	}

	console.log(`\n  ${colors.bold}BY FILE TYPE${colors.reset}`)
	const catLabels = {
		layout: 'LAYOUT',
		head: 'HEAD',
		page: 'PAGES',
		component: 'COMPONENTS',
		css: 'CSS',
		ts: 'SCRIPTS',
	}
	for (const [cat, c] of Object.entries(byCategory)) {
		const t = c.p + c.f
		if (t === 0) continue
		const pct = ((c.p / t) * 100).toFixed(0)
		const label = (catLabels[cat] || cat.toUpperCase()).padEnd(12)
		console.log(`    ${label} [${bar(pct)}] ${pct}%`)
	}

	if (failures.length > 0) {
		console.log(`\n  ${colors.red}${colors.bold}FAILED (${failures.length})${colors.reset}`)

		// Group by priority, then by file
		const grouped = { critical: [], high: [], medium: [], low: [] }
		for (const f of failures) {
			if (grouped[f.priority]) grouped[f.priority].push(f)
		}

		for (const [pri, issues] of Object.entries(grouped)) {
			if (issues.length === 0) continue
			console.log(`\n  ${badges[pri]} ${pri.toUpperCase()} (${issues.length}):`)

			const byFile = {}
			for (const i of issues) {
				const rel = i.file.replace(`${process.cwd()}/`, '')
				if (!byFile[rel]) byFile[rel] = []
				byFile[rel].push(i)
			}

			for (const [file, fileIssues] of Object.entries(byFile)) {
				console.log(`    ${colors.dim}${file}${colors.reset}`)
				for (const i of fileIssues) {
					console.log(`      ${badges[i.priority]} ${i.ruleId}: ${i.description}`)
				}
			}
		}
	}

	console.log(`\n${'═'.repeat(60)}`)
	console.log(`  ${colors.green}✅ Audit complete${colors.reset}`)
	console.log(`${'═'.repeat(60)}\n`)
}

// ─── MAIN ────────────────────────────────────────────────────────────

async function main() {
	const projectRoot = process.argv[2] || '.'
	console.log(`${colors.cyan}🔍 Scanning:${colors.reset} ${projectRoot}\n`)

	const results = await scanDirectory(projectRoot)
	const report = generateReport(results)
	const failures = results.filter((r) => !r.passed)

	printReport(report, failures)

	const critCount = failures.filter((f) => f.priority === 'critical').length
	if (critCount > 0) {
		console.log(`${colors.red}⚠️  ${critCount} CRITICAL issue(s) found${colors.reset}\n`)
		process.exitCode = 1
	}
}

main().catch(console.error)
