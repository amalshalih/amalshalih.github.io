#!/usr/bin/env bun
/**
 * Front-End Checklist Audit Script v3
 * Context-aware: Different rules for pages vs components
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
}

const badges = { critical: '🔴', high: '🟠', medium: '🟡', low: '🟢' }

// Context-aware rules
const PAGE_RULES = {
	'meta-charset': { priority: 'critical', check: 'charset="UTF-8"', desc: 'UTF-8 charset' },
	'meta-viewport': { priority: 'critical', check: 'name="viewport"', desc: 'Viewport meta' },
	doctype: { priority: 'high', check: '<!DOCTYPE html>', desc: 'HTML5 doctype' },
	'html-lang': { priority: 'high', check: /<html[^>]*lang=/, desc: 'Lang attribute' },
	'meta-description': { priority: 'high', check: 'name="description"', desc: 'Meta description' },
	favicon: { priority: 'medium', check: /favicon|icon/, desc: 'Favicon' },
	'open-graph': { priority: 'high', check: 'og:', desc: 'Open Graph' },
	'twitter-card': { priority: 'medium', check: 'twitter:', desc: 'Twitter Card' },
	canonical: { priority: 'high', check: 'canonical', desc: 'Canonical URL' },
	'structured-data': { priority: 'high', check: 'ld+json', desc: 'Structured data' },
}

const COMPONENT_RULES = {
	'aria-labels': { priority: 'high', check: /aria-/, desc: 'ARIA labels' },
	'semantic-html': {
		priority: 'high',
		check: /<(header|main|footer|nav|article|section|aside)/,
		desc: 'Semantic HTML',
	},
	'alt-text': { priority: 'critical', check: /<img[^>]*alt=/, desc: 'Alt text' },
	'form-labels': { priority: 'high', check: /<label/, desc: 'Form labels' },
	'focus-visible': { priority: 'high', check: /focus-visible|focus\\:/, desc: 'Focus styles' },
	'skip-link': { priority: 'critical', check: /skip|skip-to/, desc: 'Skip link' },
}

const LAYOUT_RULES = {
	...PAGE_RULES,
	'skip-link': { priority: 'critical', check: /skip|skip-to/, desc: 'Skip link' },
	'aria-labels': { priority: 'high', check: /aria-/, desc: 'ARIA labels' },
	'semantic-html': { priority: 'high', check: /<(header|main|footer|nav)/, desc: 'Semantic HTML' },
}

const CSS_RULES = {
	'focus-visible': { priority: 'high', check: /focus-visible|focus\\:/, desc: 'Focus styles' },
	'prefers-reduced-motion': {
		priority: 'medium',
		check: /prefers-reduced-motion/,
		desc: 'Reduced motion',
	},
	'prefers-color-scheme': {
		priority: 'medium',
		check: /prefers-color-scheme|dark/,
		desc: 'Dark mode',
	},
}

const TS_RULES = {
	https: { priority: 'critical', check: /https:\/\//, desc: 'HTTPS URLs' },
	'xss-protection': {
		priority: 'high',
		check: /escape|sanitize|htmlEncode/,
		desc: 'XSS protection',
	},
}

function getRulesForFile(filePath) {
	const ext = extname(filePath)
	const path = filePath.toLowerCase()

	// Pages need full HTML rules
	if (path.includes('/pages/') && ext === '.astro') return PAGE_RULES

	// Layouts need layout rules
	if (path.includes('/layouts/') && ext === '.astro') return LAYOUT_RULES

	// Components need component rules
	if (path.includes('/components/') && ext === '.astro') return COMPONENT_RULES

	// CSS files
	if (ext === '.css') return CSS_RULES

	// TypeScript files
	if (ext === '.ts' || ext === '.tsx') return TS_RULES

	return {}
}

async function scanFile(filePath, rules) {
	try {
		const content = await readFile(filePath, 'utf-8')
		const results = []

		for (const [ruleId, rule] of Object.entries(rules)) {
			const match =
				typeof rule.check === 'string' ? content.includes(rule.check) : rule.check.test(content)

			results.push({
				ruleId,
				description: rule.desc,
				priority: rule.priority,
				passed: match,
				file: filePath,
			})
		}

		return results
	} catch (error) {
		return []
	}
}

async function scanDirectory(dirPath) {
	const results = []
	const files = await readdir(dirPath, { recursive: true })

	for (const file of files) {
		const fullPath = join(dirPath, file)
		const rules = getRulesForFile(fullPath)

		if (
			Object.keys(rules).length > 0 &&
			!file.includes('node_modules') &&
			!file.includes('dist') &&
			!file.includes('.svelte-kit') &&
			!file.includes('__tests__')
		) {
			const fileResults = await scanFile(fullPath, rules)
			results.push(...fileResults)
		}
	}

	return results
}

function generateReport(results) {
	const total = results.length
	const passed = results.filter((r) => r.passed).length
	const failed = total - passed
	const compliance = total > 0 ? ((passed / total) * 100).toFixed(1) : 0

	const byPriority = {
		critical: { passed: 0, failed: 0 },
		high: { passed: 0, failed: 0 },
		medium: { passed: 0, failed: 0 },
	}
	const byCategory = {
		pages: { passed: 0, failed: 0 },
		components: { passed: 0, failed: 0 },
		layouts: { passed: 0, failed: 0 },
		styles: { passed: 0, failed: 0 },
		scripts: { passed: 0, failed: 0 },
	}

	for (const result of results) {
		const priority = result.priority
		const file = result.file.toLowerCase()
		let category = 'scripts'
		if (file.includes('/pages/')) category = 'pages'
		else if (file.includes('/components/')) category = 'components'
		else if (file.includes('/layouts/')) category = 'layouts'
		else if (file.endsWith('.css')) category = 'styles'

		if (!byCategory[category]) byCategory[category] = { passed: 0, failed: 0 }
		if (!byPriority[priority]) byPriority[priority] = { passed: 0, failed: 0 }

		if (result.passed) {
			byPriority[priority].passed++
			byCategory[category].passed++
		} else {
			byPriority[priority].failed++
			byCategory[category].failed++
		}
	}

	return { total, passed, failed, compliance, byPriority, byCategory }
}

function printReport(report, failures) {
	console.log('\n' + '='.repeat(70))
	console.log(`${colors.cyan}🎯 FRONT-END CHECKLIST AUDIT${colors.reset}`)
	console.log('='.repeat(70))

	console.log(
		`\n${colors.blue}📊 OVERALL:${colors.reset} ${colors.green}${report.compliance}%${colors.reset} (${report.passed}/${report.total})`,
	)

	console.log(`\n${colors.blue}BY PRIORITY:${colors.reset}`)
	for (const [priority, counts] of Object.entries(report.byPriority)) {
		const badge = badges[priority]
		const total = counts.passed + counts.failed
		if (total === 0) continue
		const pct = ((counts.passed / total) * 100).toFixed(0)
		console.log(
			`  ${badge} ${priority.toUpperCase().padEnd(10)}: ${counts.passed}/${total} (${pct}%)`,
		)
	}

	console.log(`\n${colors.blue}BY CATEGORY:${colors.reset}`)
	for (const [category, counts] of Object.entries(report.byCategory)) {
		const total = counts.passed + counts.failed
		if (total === 0) continue
		const pct = ((counts.passed / total) * 100).toFixed(0)
		const barLen = Math.floor(pct / 5)
		const bar = '█'.repeat(barLen) + '░'.repeat(20 - barLen)
		console.log(`  ${category.toUpperCase().padEnd(15)} [${bar}] ${pct}%`)
	}

	if (failures.length > 0) {
		console.log(`\n${colors.red}❌ FAILED (${failures.length} issues):${colors.reset}`)
		const byFile = {}
		for (const f of failures) {
			if (!byFile[f.file]) byFile[f.file] = []
			byFile[f.file].push(f)
		}

		const criticalFirst = Object.entries(byFile).sort((a, b) => {
			const aCrit = a[1].filter((x) => x.priority === 'critical').length
			const bCrit = b[1].filter((x) => x.priority === 'critical').length
			return bCrit - aCrit
		})

		for (const [file, issues] of criticalFirst) {
			const critCount = issues.filter((i) => i.priority === 'critical').length
			if (critCount === 0) continue // Skip non-critical for brevity

			console.log(`\n  ${colors.cyan}${file}${colors.reset}`)
			for (const issue of issues.filter((i) => i.priority === 'critical')) {
				const badge = badges[issue.priority]
				console.log(`    ${badge} ${issue.ruleId}: ${issue.description}`)
			}
		}
	}

	console.log('\n' + '='.repeat(70))
	console.log(`${colors.green}✅ Audit complete!${colors.reset}`)
	console.log('='.repeat(70) + '\n')
}

async function main() {
	const projectRoot = process.argv[2] || '.'
	console.log(`${colors.cyan}🔍 Scanning:${colors.reset} ${projectRoot}\n`)

	const results = await scanDirectory(projectRoot)
	const report = generateReport(results)
	const failures = results.filter((r) => !r.passed)

	printReport(report, failures)

	const criticalFailures = failures.filter((f) => f.priority === 'critical')
	if (criticalFailures.length > 0) {
		console.log(`${colors.red}⚠️  ${criticalFailures.length} CRITICAL issues${colors.reset}\n`)
	}
}

main().catch(console.error)
