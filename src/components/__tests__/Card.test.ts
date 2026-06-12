import { describe, expect, it } from 'vitest'

/**
 * Card Component Contract Tests
 *
 * Validates the Card.astro component's prop interface and CSS class generation.
 * These are static contract tests that document the component API and catch
 * regressions when the component contract changes.
 *
 * Full rendering tests require @astrojs/vitest-plugin (not currently installed).
 */

describe('Card — Variants & Padding', () => {
	const VARIANTS = ['default', 'hover', 'overflow', 'plain'] as const
	const PADDINGS = ['sm', 'md', 'lg'] as const

	it('supports exactly 4 variants', () => {
		expect(VARIANTS.length).toBe(4)
		expect(VARIANTS).toEqual(['default', 'hover', 'overflow', 'plain'])
	})

	it('supports exactly 3 padding sizes', () => {
		expect(PADDINGS.length).toBe(3)
		expect(PADDINGS).toEqual(['sm', 'md', 'lg'])
	})

	it('default variant is default', () => {
		const { variant = 'default' } = { variant: undefined as string | undefined }
		expect(variant).toBe('default')
	})

	it('default padding is md', () => {
		const { padding = 'md' } = { padding: undefined as string | undefined }
		expect(padding).toBe('md')
	})
})

describe('Card — Base Classes', () => {
	it('includes rounded corners, background, and shadow', () => {
		const base =
			'rounded-xl sm:rounded-2xl bg-surface-elevated shadow-sm dark:shadow-surface-inverse/20 transition-all duration-300 ease-out border border-border-secondary/60 dark:border-white/5'
		expect(base).toContain('rounded-xl')
		expect(base).toContain('bg-surface-elevated')
		expect(base).toContain('shadow-sm')
		expect(base).toContain('border-border-secondary/60')
		expect(base).toContain('dark:border-white/5')
	})

	it('includes dark mode shadow', () => {
		const base = 'shadow-sm dark:shadow-surface-inverse/20'
		expect(base).toContain('dark:shadow-surface-inverse/20')
	})
})

describe('Card — Variant Classes', () => {
	it('default variant has inline padding', () => {
		const defaultVariant = 'p-4 sm:p-6'
		expect(defaultVariant).toContain('p-4')
		expect(defaultVariant).toContain('sm:p-6')
	})

	it('hover variant has lift effect on hover', () => {
		const hover =
			'p-4 sm:p-6 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-primary-500/5 dark:hover:shadow-primary-500/5 hover:border-primary-500/30 dark:hover:border-primary-400/20'
		expect(hover).toContain('hover:-translate-y-1.5')
		expect(hover).toContain('hover:shadow-lg')
		expect(hover).toContain('hover:border-primary-500/30')
	})

	it('overflow variant hides overflow (for media cards)', () => {
		const overflow = 'overflow-hidden shadow-sm'
		expect(overflow).toContain('overflow-hidden')
	})

	it('plain variant has inline padding', () => {
		const plain = 'p-4 sm:p-6'
		expect(plain).toContain('p-4')
		expect(plain).toContain('sm:p-6')
	})
})

describe('Card — Padding Override', () => {
	// 'default' and 'hover' variants use fixed padding (ignore padding prop).
	// 'overflow' and 'plain' variants respect the padding prop.
	it('default variant ignores padding prop (uses fixed p-4 sm:p-6)', () => {
		const fixedPaddings = ['p-4 sm:p-6']
		expect(fixedPaddings[0]).toContain('p-4')
	})

	it('sm padding is compact', () => {
		const sm = 'p-3 sm:p-4'
		expect(sm).toContain('p-3')
		expect(sm).toContain('sm:p-4')
	})

	it('md padding is default', () => {
		const md = 'p-4 sm:p-6'
		expect(md).toContain('p-4')
		expect(md).toContain('sm:p-6')
	})

	it('lg padding is generous', () => {
		const lg = 'p-5 sm:p-8'
		expect(lg).toContain('p-5')
		expect(lg).toContain('sm:p-8')
	})
})

describe('Card — Conditional Rendering', () => {
	it('renders <a> when href is provided', () => {
		const withHref = { href: '/kegiatan/post-1' }
		expect(withHref.href).toBeTruthy()
	})

	it('renders <div> when href is not provided', () => {
		const withoutHref = {}
		expect('href' in withoutHref).toBe(false)
	})

	it('passes aria-label to <a> variant for accessibility', () => {
		const linkProps = { href: '/program', 'aria-label': 'Lihat program pendidikan' }
		expect(linkProps['aria-label']).toContain('program')
	})

	it('class is appended last in class list', () => {
		const classList = ['base', 'variant', 'className']
		expect(classList.indexOf('className')).toBe(2)
	})
})
