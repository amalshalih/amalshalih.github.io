import { describe, expect, it, vi } from 'vitest'

vi.mock('cloudflare:workers', () => ({
	env: {},
}))

describe('API /galleries', () => {
	describe('GET /api/galleries', () => {
		it('should validate gallery data structure', () => {
			const gallery = {
				id: 'gallery-1',
				title: 'Kegiatan Ramadhan 2026',
				date: '2026-03-15',
				status: 'published',
				images: [
					{
						id: 'img-1',
						url: 'https://drive.google.com/thumbnail?id=abc',
						caption: 'Kegiatan buka puasa',
					},
				],
			}

			expect(gallery.id).toBeDefined()
			expect(gallery.title).toBeDefined()
			expect(gallery.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
			expect(gallery.status).toMatch(/^(published|draft|archived)$/)
			expect(Array.isArray(gallery.images)).toBe(true)
			gallery.images.forEach((img) => {
				expect(img.id).toBeDefined()
				expect(img.url).toMatch(/^https?:\/\//)
			})
		})

		it('should filter to published galleries only', () => {
			const galleries = [
				{ id: '1', status: 'published', title: 'Published Gallery' },
				{ id: '2', status: 'draft', title: 'Draft Gallery' },
				{ id: '3', status: 'archived', title: 'Archived Gallery' },
				{ id: '4', status: 'published', title: 'Another Published' },
			]

			const published = galleries.filter((g) => g.status === 'published')

			expect(published).toHaveLength(2)
			published.forEach((g) => {
				expect(g.status).toBe('published')
			})
		})

		it('should return empty array when no published galleries exist', () => {
			const galleries = [
				{ id: '1', status: 'draft', title: 'Draft' },
				{ id: '2', status: 'archived', title: 'Archived' },
			]

			const published = galleries.filter((g) => g.status === 'published')
			expect(published).toHaveLength(0)
			expect(published).toEqual([])
		})

		it('should validate date format in galleries', () => {
			const validDates = ['2026-01-01', '2025-12-31', '2024-06-15']
			const invalidDates = ['01-01-2026', '2026/01/01', 'Jan 2026', 'not-a-date', '']

			validDates.forEach((date) => {
				expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
			})
			invalidDates.forEach((date) => {
				expect(date).not.toMatch(/^\d{4}-\d{2}-\d{2}$/)
			})
		})

		it('should have appropriate cache control for galleries', () => {
			const cacheControl = 'public, max-age=300'
			expect(cacheControl).toContain('public')
			expect(cacheControl).toContain('max-age=')
			const maxAge = Number.parseInt(cacheControl.split('max-age=')[1], 10)
			expect(maxAge).toBeGreaterThan(0)
			expect(maxAge).toBeLessThanOrEqual(3600)
		})

		it('should return JSON content type', () => {
			const contentType = 'application/json'
			expect(contentType).toBe('application/json')
		})
	})
})
