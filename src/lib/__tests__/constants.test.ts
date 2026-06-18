import { describe, expect, it } from 'vitest'
import { KATEGORI_LABELS, NAV_ITEMS } from '../constants'

describe('NAV_ITEMS', () => {
	it('has 8 menu items with label and href (including BARKAS with children)', () => {
		expect(NAV_ITEMS).toHaveLength(8)
		for (const item of NAV_ITEMS) {
			expect(item).toHaveProperty('label')
			expect(item).toHaveProperty('href')
			expect(typeof item.label).toBe('string')
			expect(typeof item.href).toBe('string')
		}
	})

	it('starts with Beranda and ends with Kontak', () => {
		expect(NAV_ITEMS[0].label).toBe('Beranda')
		expect(NAV_ITEMS[0].href).toBe('/')
		expect(NAV_ITEMS.at(-1)?.label).toBe('Kontak')
	})

	it('has valid hrefs (all start with /)', () => {
		for (const item of NAV_ITEMS) {
			expect(item.href).toMatch(/^\//)
		}
	})
})

describe('KATEGORI_LABELS', () => {
	it('has labels for all 4 categories', () => {
		const expected = ['pendidikan', 'keagamaan', 'sosial', 'umum']
		for (const key of expected) {
			expect(KATEGORI_LABELS).toHaveProperty(key)
			expect(typeof KATEGORI_LABELS[key]).toBe('string')
			expect(KATEGORI_LABELS[key].length).toBeGreaterThan(0)
		}
	})

	it('returns key as fallback for unknown categories (hybrid safety)', () => {
		const unknownKey = 'berita'
		const result = KATEGORI_LABELS[unknownKey] || unknownKey
		expect(result).toBe('berita')
	})

	it('merges correctly with Sanity overrides (simulates hybrid pattern)', () => {
		const sanityLabels: Record<string, string> = { pendidikan: 'Edukasi' }
		const merged = { ...KATEGORI_LABELS, ...sanityLabels }

		// Overridden
		expect(merged.pendidikan).toBe('Edukasi')
		// Preserved
		expect(merged.keagamaan).toBe('Keagamaan')
		expect(merged.sosial).toBe('Sosial Kemanusiaan')
		expect(merged.umum).toBe('Umum')
		// Sanity empty/hybrid pattern
		const partialMerged = { ...KATEGORI_LABELS }
		delete partialMerged.sosial
		expect(partialMerged.sosial).toBeUndefined()
		expect(partialMerged.pendidikan).toBe('Pendidikan')
	})

	it('does not have empty labels', () => {
		for (const [key, label] of Object.entries(KATEGORI_LABELS)) {
			expect(label.trim(), `Label for "${key}" is empty`).toBeTruthy()
		}
	})
})

describe('Hybrid fallback pattern', () => {
	it('kategoriLabels fallback: Sanity > hardcoded > raw key', () => {
		const hardcoded = { ...KATEGORI_LABELS }
		const sanityOverride: Record<string, string> = { pendidikan: 'Edukasi' }
		const merged = { ...hardcoded, ...sanityOverride }

		// Sanity priority
		expect(merged.pendidikan).toBe('Edukasi')
		// Hardcoded fallback
		expect(merged.keagamaan).toBe('Keagamaan')
		// Raw key fallback (when both Sanity and hardcoded missing)
		const rawKey = 'berita'
		expect(merged[rawKey] || rawKey).toBe('berita')
	})
})
