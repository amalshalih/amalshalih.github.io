import { env } from 'cloudflare:workers'
import type { APIRoute } from 'astro'
import { getGoogleDriveCredentials } from '../../lib/config'

interface HealthCheckResult {
	status: 'healthy' | 'degraded' | 'unhealthy'
	timestamp: string
	version: string
	checks: {
		kv: { status: 'ok' | 'error'; latency: number; message?: string }
		googleDrive: { status: 'ok' | 'error'; latency: number; message?: string }
		sanity: { status: 'ok' | 'error'; latency: number; message?: string }
	}
}

export const GET: APIRoute = async () => {
	const timestamp = new Date().toISOString()
	const version = process.env.CF_PAGES_COMMIT_SHA?.slice(0, 7) || 'dev'

	const checks: HealthCheckResult['checks'] = {
		kv: { status: 'error', latency: 0 },
		googleDrive: { status: 'error', latency: 0 },
		sanity: { status: 'error', latency: 0 },
	}

	const kvStart = Date.now()
	try {
		const likes = env.LIKES
		await likes.list({ limit: 1 })
		checks.kv = { status: 'ok', latency: Date.now() - kvStart }
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error)
		checks.kv = {
			status: 'error',
			latency: Date.now() - kvStart,
			message: message || 'KV connection failed',
		}
		console.error('[Health Check] KV Error:', error)
	}

	const gdStart = Date.now()
	try {
		getGoogleDriveCredentials()
		checks.googleDrive = { status: 'ok', latency: Date.now() - gdStart }
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error)
		checks.googleDrive = {
			status: 'error',
			latency: Date.now() - gdStart,
			message: message || 'Google Drive config invalid',
		}
		console.error('[Health Check] Google Drive Error:', error)
	}

	const sanityStart = Date.now()
	try {
		const response = await fetch(
			'https://9yj0dq9v.api.sanity.io/v1/data/query/production?query=count(*[_type == "siteSettings"])',
			{ method: 'GET' },
		)
		if (!response.ok) {
			throw new Error(`Sanity API returned ${response.status}`)
		}
		const data = await response.json()
		if (typeof data.result !== 'number') {
			throw new Error('Unexpected Sanity response format')
		}
		checks.sanity = { status: 'ok', latency: Date.now() - sanityStart }
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error)
		checks.sanity = {
			status: 'error',
			latency: Date.now() - sanityStart,
			message: message || 'Sanity API unreachable',
		}
		console.error('[Health Check] Sanity Error:', error)
	}

	const allOk = Object.values(checks).every((c) => c.status === 'ok')
	const anyOk = Object.values(checks).some((c) => c.status === 'ok')
	const status: HealthCheckResult['status'] = allOk ? 'healthy' : anyOk ? 'degraded' : 'unhealthy'
	const httpStatus = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503

	const result: HealthCheckResult = {
		status,
		timestamp,
		version,
		checks,
	}

	return new Response(JSON.stringify(result, null, 2), {
		status: httpStatus,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-cache, no-store, must-revalidate',
			'X-Content-Type-Options': 'nosniff',
		},
	})
}
