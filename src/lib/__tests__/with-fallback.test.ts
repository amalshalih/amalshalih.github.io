import { describe, expect, it, vi } from 'vitest'
import { withFallback, withNull } from '../with-fallback'

describe('withFallback', () => {
	it('returns fetched data on success', async () => {
		const result = await withFallback(() => Promise.resolve('ok'), 'fallback', 'test')
		expect(result).toBe('ok')
	})

	it('returns fallback on null result', async () => {
		const result = await withFallback(() => Promise.resolve(null), 'fallback', 'test')
		expect(result).toBe('fallback')
	})

	it('returns fallback on rejected promise', async () => {
		const result = await withFallback(() => Promise.reject(new Error('fail')), 'fallback', 'test')
		expect(result).toBe('fallback')
	})

	it('returns fallback on thrown error', async () => {
		const result = await withFallback<string>(
			() => {
				throw new Error('crash')
			},
			'fallback',
			'test',
		)
		expect(result).toBe('fallback')
	})

	it('logs error to console on failure', async () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
		await withFallback(() => Promise.reject(new Error('fail')), 'fb', 'MyContext')
		expect(spy).toHaveBeenCalledWith('[Sanity] MyContext failed:', expect.any(Error))
		spy.mockRestore()
	})
})

describe('withNull', () => {
	it('returns data on success', async () => {
		const result = await withNull(() => Promise.resolve('data'), 'test')
		expect(result).toBe('data')
	})

	it('returns null on null result', async () => {
		const result = await withNull(() => Promise.resolve(null), 'test')
		expect(result).toBeNull()
	})

	it('returns null on fetch failure', async () => {
		const result = await withNull(() => Promise.reject(new Error('fail')), 'test')
		expect(result).toBeNull()
	})

	it('returns null on thrown error', async () => {
		const result = await withNull<string>(() => {
			throw new Error('crash')
		}, 'test')
		expect(result).toBeNull()
	})
})
