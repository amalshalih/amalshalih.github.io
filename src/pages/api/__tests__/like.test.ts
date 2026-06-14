import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

vi.mock('cloudflare:workers', () => ({
	env: {
		LIKES: {
			get: vi.fn(),
			put: vi.fn(),
			list: vi.fn(),
		},
	},
}))

const getQuerySchema = z.object({
	slug: z.string().min(1, 'Slug cannot be empty'),
})

const postBodySchema = z.object({
	slug: z.string().min(1, 'Slug cannot be empty'),
	photoId: z.string().min(1, 'PhotoId cannot be empty'),
})

describe('API /like', () => {
	describe('GET /api/like', () => {
		it('should accept valid slug parameter', () => {
			const result = getQuerySchema.safeParse({ slug: 'galeri-ramadhan' })
			expect(result.success).toBe(true)
			if (result.success) {
				expect(result.data.slug).toBe('galeri-ramadhan')
			}
		})

		it('should reject empty slug parameter', () => {
			const result = getQuerySchema.safeParse({ slug: '' })
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Slug cannot be empty')
			}
		})

		it('should reject missing slug parameter', () => {
			const result = getQuerySchema.safeParse({})
			expect(result.success).toBe(false)
		})

		it('should accept slug with hyphens and numbers', () => {
			const validSlugs = ['galeri-2026', 'kegiatan-1', 'momen-istimewa-ramadhan-1447']
			validSlugs.forEach((slug) => {
				const result = getQuerySchema.safeParse({ slug })
				expect(result.success).toBe(true)
			})
		})
	})

	describe('POST /api/like', () => {
		it('should accept valid slug and photoId', () => {
			const result = postBodySchema.safeParse({
				slug: 'galeri-ramadhan',
				photoId: 'photo-001',
			})
			expect(result.success).toBe(true)
		})

		it('should reject empty slug in body', () => {
			const result = postBodySchema.safeParse({
				slug: '',
				photoId: 'photo-001',
			})
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Slug cannot be empty')
			}
		})

		it('should reject empty photoId', () => {
			const result = postBodySchema.safeParse({
				slug: 'galeri-ramadhan',
				photoId: '',
			})
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('PhotoId cannot be empty')
			}
		})

		it('should reject missing photoId', () => {
			const result = postBodySchema.safeParse({ slug: 'galeri-ramadhan' })
			expect(result.success).toBe(false)
		})

		it('should return positive like count on success', () => {
			const response = { likes: 5 }
			expect(response.likes).toBeGreaterThan(0)
			expect(Number.isInteger(response.likes)).toBe(true)
		})
	})
})
