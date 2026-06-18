import { describe, expect, it, vi } from 'vitest'
import { apiErrorResponse } from '../api-utils'

describe('apiErrorResponse', () => {
	it('returns 500 status', () => {
		const res = apiErrorResponse(new Error('fail'), 'test')
		expect(res.status).toBe(500)
	})

	it('returns JSON content type', () => {
		const res = apiErrorResponse('oops', 'test')
		expect(res.headers.get('Content-Type')).toBe('application/json')
	})

	it('includes error message from Error object', async () => {
		const res = apiErrorResponse(new Error('Database timeout'), 'db')
		const body = await res.json()
		expect(body.error).toBe('Database timeout')
	})

	it('includes string error as-is', async () => {
		const res = apiErrorResponse('rate limit exceeded', 'api')
		const body = await res.json()
		expect(body.error).toBe('rate limit exceeded')
	})

	it('handles non-Error thrown values', async () => {
		const res = apiErrorResponse({ code: 500, detail: 'crash' }, 'test')
		const body = await res.json()
		expect(body.error).toBe('[object Object]')
	})

	it('logs error to console with context prefix', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
		apiErrorResponse(new Error('fail'), 'my-context')
		expect(spy).toHaveBeenCalledWith('[API /my-context] Error:', expect.any(Error))
		spy.mockRestore()
	})
})
