import type { APIRoute } from 'astro'
import { z } from 'zod'
import { getGalleryLikes, toggleGalleryLike } from '../../lib/likes'

const getQuerySchema = z.object({
	slug: z.string().min(1, 'Slug cannot be empty'),
	userId: z.string().optional().default('anonymous'),
})

export const GET: APIRoute = async ({ request }) => {
	try {
		const url = new URL(request.url)
		const parsed = getQuerySchema.safeParse({
			slug: url.searchParams.get('slug') ?? undefined,
			userId: url.searchParams.get('userId') ?? undefined,
		})

		if (!parsed.success) {
			return new Response(JSON.stringify({ error: parsed.error.issues[0].message }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			})
		}

		const { slug, userId } = parsed.data
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
	userId: z.string().optional().default('anonymous'),
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

		const { slug, userId, action } = parsed.data
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
