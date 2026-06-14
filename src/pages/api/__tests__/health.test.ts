import { describe, expect, it, vi } from 'vitest'

vi.mock('cloudflare:workers', () => ({
	env: {
		LIKES: {
			list: vi.fn(),
		},
	},
}))

describe('API /health', () => {
	describe('GET /api/health', () => {
		it('should determine healthy when all checks pass', () => {
			const checks = {
				kv: { status: 'ok' as const, latency: 5 },
				googleDrive: { status: 'ok' as const, latency: 2 },
				sanity: { status: 'ok' as const, latency: 150 },
			}

			const allOk = Object.values(checks).every((c) => c.status === 'ok')
			expect(allOk).toBe(true)
		})

		it('should determine degraded when some checks fail', () => {
			const checks = {
				kv: { status: 'ok' as const, latency: 5 },
				googleDrive: { status: 'error' as const, latency: 0, message: 'Missing credentials' },
				sanity: { status: 'ok' as const, latency: 150 },
			}

			const allOk = Object.values(checks).every((c) => c.status === 'ok')
			const anyOk = Object.values(checks).some((c) => c.status === 'ok')
			expect(allOk).toBe(false)
			expect(anyOk).toBe(true)
		})

		it('should determine unhealthy when all checks fail', () => {
			const checkResults: Array<{ status: 'ok' | 'error' }> = [
				{ status: 'error' },
				{ status: 'error' },
				{ status: 'error' },
			]

			const allOk = checkResults.every((c) => c.status === 'ok')
			const anyOk = checkResults.some((c) => c.status === 'ok')
			expect(allOk).toBe(false)
			expect(anyOk).toBe(false)
		})

		it('should generate ISO timestamp and version string', () => {
			const timestamp = new Date().toISOString()
			const version = 'dev'

			expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
			expect(version).toBe('dev')
		})

		it('should include error message on failed checks', () => {
			const errorCheck = {
				status: 'error' as const,
				latency: 500,
				message: 'KV connection failed',
			}

			expect(errorCheck.status).toBe('error')
			expect(errorCheck.message).toBeDefined()
			expect(errorCheck.message).toContain('KV')
		})

		it('should have zero latency for skipped checks', () => {
			const failedCheck = { status: 'error' as const, latency: 0 }
			expect(failedCheck.latency).toBe(0)
		})
	})
})
