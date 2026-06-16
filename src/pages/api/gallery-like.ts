import { getGalleryLikes, toggleGalleryLike } from '@lib/likes'
import type { APIRoute } from 'astro'
import { z } from 'zod'

// Helper to generate a consistent hash from IP + User Agent
async function generateFingerprint(request: Request): Promise<string> {
	const ip =
		request.headers.get('cf-connecting-ip') ||
		request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
		'127.0.0.1'
	const ua = request.headers.get('user-agent') || 'unknown'

	const msgUint8 = new TextEncoder().encode(ip + ua)
	const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
	const hashArray = Array.from(new Uint8Array(hashBuffer))
	return hashArray
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('')
		.substring(0, 16)
}

const getQuerySchema = z.object({
	slug: z.string().min(1, 'Slug cannot be empty'),
})

export const GET: APIRoute = async ({ request }) => {
	try {
		const url = new URL(request.url)
		const parsed = getQuerySchema.safeParse({
			slug: url.searchParams.get('slug') ?? undefined,
		})

		if (!parsed.success) {
			return new Response(JSON.stringify({ error: parsed.error.issues[0].message }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			})
		}

		const { slug } = parsed.data
		const userId = await generateFingerprint(request)
		const data = await getGalleryLikes(slug)

		return new Response(
			JSON.stringify({
				count: data.count,
				liked: !!data.users[userId],
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			},
		)
	} catch (error) {
		console.error('[API /gallery-like GET] Error:', error)
		const message = error instanceof Error ? error.message : String(error)
		return new Response(JSON.stringify({ error: message }), { status: 500 })
	}
}

const postBodySchema = z.object({
	slug: z.string().min(1, 'Slug cannot be empty'),
	action: z.enum(['like', 'unlike']).optional(),
})

export const POST: APIRoute = async ({ request }) => {
	try {
		let body: unknown
		try {
			body = await request.json()
		} catch {
			return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			})
		}

		const parsed = postBodySchema.safeParse(body)
		if (!parsed.success) {
			return new Response(JSON.stringify({ error: parsed.error.issues[0].message }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			})
		}

		const { slug, action } = parsed.data
		const userId = await generateFingerprint(request)
		const result = await toggleGalleryLike(slug, userId, action)

		return new Response(
			JSON.stringify({
				count: result.count,
				liked: result.liked,
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			},
		)
	} catch (error) {
		console.error('[API /gallery-like POST] Error:', error)
		const message = error instanceof Error ? error.message : String(error)
		return new Response(JSON.stringify({ error: message }), { status: 500 })
	}
}
