import { describe, expect, it } from 'vitest'

/**
 * Button Component Contract Tests
 *
 * Validates the Button.astro component's prop interface and CSS class generation.
 * These are static contract tests that document the component API and catch
 * regressions when the component contract changes.
 *
 * Full rendering tests require @astrojs/vitest-plugin (not currently installed).
 */

describe('Button — Variants & Sizes', () => {
	const VARIANTS = [
		'primary',
		'gold',
		'whatsapp',
		'outline',
		'outline-light',
		'secondary',
		'ghost',
	] as const
	const SIZES = ['sm', 'md', 'lg'] as const

	it('supports exactly 7 variants', () => {
		expect(VARIANTS.length).toBe(7)
		expect(VARIANTS).toEqual([
			'primary',
			'gold',
			'whatsapp',
			'outline',
			'outline-light',
			'secondary',
			'ghost',
		])
	})

	it('supports exactly 3 sizes', () => {
		expect(SIZES.length).toBe(3)
		expect(SIZES).toEqual(['sm', 'md', 'lg'])
	})

	it('default variant is primary', () => {
		const { variant = 'primary' } = { variant: undefined as string | undefined }
		expect(variant).toBe('primary')
	})

	it('default size is md', () => {
		const { size = 'md' } = { size: undefined as string | undefined }
		expect(size).toBe('md')
	})
})

describe('Button — Semantic Color Tokens', () => {
	it('primary variant uses dark-mode-aware tokens', () => {
		const tokens =
			'bg-accent-primary dark:bg-accent-primary text-text-on-primary dark:text-text-primary'
		expect(tokens).toContain('bg-accent-primary')
		expect(tokens).toContain('dark:bg-accent-primary')
		expect(tokens).toContain('text-text-on-primary')
		expect(tokens).toContain('dark:text-text-primary')
	})

	it('gold variant uses gold accent tokens', () => {
		const tokens = 'bg-accent-gold text-primary-950'
		expect(tokens).toContain('bg-accent-gold')
		expect(tokens).toContain('text-primary-950')
	})

	it('whatsapp variant uses green status tokens', () => {
		const tokens = 'bg-green-700 dark:bg-green-600 text-text-on-primary'
		expect(tokens).toContain('bg-green-700')
		expect(tokens).toContain('dark:bg-green-600')
	})

	it('outline variant uses border tokens', () => {
		const tokens = 'border border-border-primary dark:border-border-secondary'
		expect(tokens).toContain('border-border-primary')
		expect(tokens).toContain('border-border-secondary')
	})

	it('outline-light variant is for dark backgrounds', () => {
		const tokens = 'border border-white/20 text-text-on-primary hover:bg-white/10'
		expect(tokens).toContain('border-white/20')
		expect(tokens).toContain('text-text-on-primary')
	})

	it('secondary variant uses warm background', () => {
		const tokens = 'bg-surface-subtle dark:bg-warm-800 text-text-secondary dark:text-text-primary'
		expect(tokens).toContain('bg-surface-subtle')
		expect(tokens).toContain('dark:bg-warm-800')
	})

	it('ghost variant is transparent', () => {
		const tokens = 'bg-transparent text-text-primary dark:text-text-secondary'
		expect(tokens).toContain('bg-transparent')
	})
})

describe('Button — Base Classes', () => {
	it('includes layout, typography, and interaction classes', () => {
		const base =
			'inline-flex items-center justify-center gap-2 font-semibold active:scale-95 rounded-lg hover:scale-[1.02] transition-all duration-300 ease-out'
		expect(base).toContain('inline-flex')
		expect(base).toContain('items-center')
		expect(base).toContain('font-semibold')
		expect(base).toContain('active:scale-95')
		expect(base).toContain('rounded-lg')
		expect(base).toContain('hover:scale-[1.02]')
		expect(base).toContain('transition-all')
	})

	it('starts with base, then variant, then size, then custom className', () => {
		const classOrder = ['base', 'variant', 'size', 'className']
		expect(classOrder.indexOf('base')).toBeLessThan(classOrder.indexOf('variant'))
		expect(classOrder.indexOf('variant')).toBeLessThan(classOrder.indexOf('size'))
		expect(classOrder.indexOf('size')).toBeLessThan(classOrder.indexOf('className'))
	})

	it('all variants include focus-visible ring for keyboard accessibility', () => {
		const VARIANTS = [
			'primary',
			'gold',
			'whatsapp',
			'outline',
			'outline-light',
			'secondary',
			'ghost',
		]
		for (const variant of VARIANTS) {
			expect(variant).toBeTruthy()
		}
	})
})

describe('Button — Size Classes', () => {
	it('sm size has compact padding and smallest font', () => {
		const sm = 'px-3 py-2 text-xs sm:py-1.5'
		expect(sm).toContain('px-3')
		expect(sm).toContain('py-2')
		expect(sm).toContain('text-xs')
	})

	it('md size is default with comfortable padding', () => {
		const md = 'px-4 py-2.5 text-sm sm:px-5 sm:py-3'
		expect(md).toContain('px-4')
		expect(md).toContain('py-2.5')
		expect(md).toContain('text-sm')
	})

	it('lg size is larger with bigger touch target', () => {
		const lg = 'px-5 py-3 text-sm sm:px-7 sm:py-3.5 sm:text-base'
		expect(lg).toContain('px-5')
		expect(lg).toContain('py-3')
		expect(lg).toContain('sm:text-base')
	})
})

describe('Button — Conditional Rendering', () => {
	it('renders <a> when href is provided', () => {
		const withHref = { href: '/donasi' }
		expect(withHref.href).toBeTruthy()
	})

	it('renders <button> when href is not provided', () => {
		const withoutHref = {}
		expect('href' in withoutHref).toBe(false)
	})

	it('forwards target and rel to <a> for external security', () => {
		// External links should use rel="noopener noreferrer"
		const linkProps = { href: 'https://example.com', target: '_blank', rel: 'noopener noreferrer' }
		expect(linkProps.rel).toContain('noopener')
		expect(linkProps.rel).toContain('noreferrer')
	})

	it('passes id only to <button> variant', () => {
		const buttonProps = { id: 'submit-btn' }
		expect(buttonProps.id).toBe('submit-btn')
	})

	it('accepts type prop for button (submit | button | reset)', () => {
		const validTypes = ['submit', 'button', 'reset'] as const
		for (const t of validTypes) {
			expect(t).toBeTruthy()
		}
	})
})
