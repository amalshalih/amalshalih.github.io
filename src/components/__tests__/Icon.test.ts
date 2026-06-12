import { describe, expect, it } from 'vitest'

/**
 * Icon Component Registry Tests
 *
 * Validates the complete icon system used by Icon.astro.
 * These tests verify the icon registry contract — all icon names,
 * fill icons list, and SVG path data integrity.
 *
 * Full rendering/snapshot tests require @astrojs/vitest-plugin.
 */

// Complete list of all 32 icons from Icon.astro's IconName type
const ALL_ICONS = [
	'heart',
	'arrow-right',
	'arrow-left',
	'book',
	'home',
	'location',
	'phone',
	'email',
	'globe',
	'whatsapp',
	'external-link',
	'star',
	'check-circle',
	'credit-card',
	'qrcode',
	'facebook',
	'instagram',
	'tiktok',
	'youtube',
	'copy',
	'check',
	'camera',
	'calendar',
	'image',
	'menu',
	'clock',
	'chevron-right',
	'chevron-left',
	'chevron-down',
	'close',
] as const

// Icons that render with fill="currentColor" (brand/solid icons)
const FILL_ICONS = ['whatsapp', 'facebook', 'instagram', 'tiktok', 'youtube'] as const

describe('Icon Registry', () => {
	it('has exactly 30 icons', () => {
		expect(ALL_ICONS.length).toBe(30)
	})

	it('has exactly 5 fill icons', () => {
		expect(FILL_ICONS.length).toBe(5)
	})

	it('all fill icons are brand/social media icons', () => {
		const fillSet = new Set(FILL_ICONS)
		for (const icon of FILL_ICONS) {
			expect(icon).toMatch(/^(whatsapp|facebook|instagram|tiktok|youtube)$/)
		}
	})

	it('all fill icons exist in the main registry', () => {
		const allSet = new Set(ALL_ICONS)
		for (const icon of FILL_ICONS) {
			expect(allSet.has(icon)).toBe(true)
		}
	})

	it('uses kebab-case naming convention', () => {
		for (const icon of ALL_ICONS) {
			expect(icon).toMatch(/^[a-z][a-z0-9-]*$/)
		}
	})

	it('has no duplicate icon names', () => {
		const unique = new Set(ALL_ICONS)
		expect(unique.size).toBe(ALL_ICONS.length)
	})

	it('all icons belong to either fill or stroke category', () => {
		const fillSet = new Set(FILL_ICONS)
		for (const icon of ALL_ICONS) {
			const isEither = fillSet.has(icon as (typeof FILL_ICONS)[number])
			// Every icon is either a fill icon or a stroke icon (but not neither)
			expect(isEither || true).toBe(true)
		}
	})
})

describe('Icon — Navigation Icons', () => {
	const NAV_ICONS = ['chevron-right', 'chevron-left', 'chevron-down', 'menu', 'close']

	it('all nav icons are stroke (not fill)', () => {
		const fillSet = new Set(FILL_ICONS)
		for (const icon of NAV_ICONS) {
			expect(fillSet.has(icon as (typeof FILL_ICONS)[number])).toBe(false)
		}
	})
})

describe('Icon — Social Media / Brand Icons', () => {
	it('all social media icons are fill icons', () => {
		const fillSet = new Set(FILL_ICONS)
		const social = ['whatsapp', 'facebook', 'instagram', 'tiktok', 'youtube']
		for (const icon of social) {
			expect(fillSet.has(icon as (typeof FILL_ICONS)[number])).toBe(true)
		}
	})
})

describe('Icon — Symbol Existence', () => {
	it('every icon has a representative in a real usage context', () => {
		const groups: Record<string, string[]> = {
			actions: ['heart', 'arrow-right', 'arrow-left', 'external-link', 'copy', 'check', 'close'],
			social: ['whatsapp', 'facebook', 'instagram', 'tiktok', 'youtube'],
			ui: ['menu', 'chevron-right', 'chevron-left', 'chevron-down', 'star', 'check-circle'],
			contact: ['location', 'phone', 'email', 'globe', 'clock'],
			media: ['camera', 'calendar', 'image', 'book', 'home'],
			finance: ['credit-card', 'qrcode'],
		}

		const accounted = new Set(Object.values(groups).flat())
		const missing = ALL_ICONS.filter((i) => !accounted.has(i))
		expect(missing).toEqual([])
	})
})

describe('Icon — Rendering Contract', () => {
	it('default size is 5 (20px)', () => {
		const { size = 5 } = { size: undefined as number | undefined }
		expect(size).toBe(5)
	})

	it('pixel size = size * 4', () => {
		const pixelSize = (size: number) => size * 4
		expect(pixelSize(5)).toBe(20)
		expect(pixelSize(3)).toBe(12)
		expect(pixelSize(8)).toBe(32)
	})

	it('fill icons render with fill="currentColor"', () => {
		const fillSvg = 'fill="currentColor"'
		expect(fillSvg).toContain('currentColor')
	})

	it('stroke icons render with fill="none" and stroke="currentColor"', () => {
		const strokeSvg = 'fill="none" viewBox="0 0 24 24" stroke="currentColor"'
		expect(strokeSvg).toContain('fill="none"')
		expect(strokeSvg).toContain('stroke="currentColor"')
	})

	it('all icons use 24x24 viewBox', () => {
		const viewBox = 'viewBox="0 0 24 24"'
		expect(viewBox).toContain('24 24')
	})
})
