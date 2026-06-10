import type { APIRoute } from 'astro'
import { z } from 'zod'
import { getPhotoLikes, incrementPhotoLike } from '../../lib/likes'

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
		const result = await getPhotoLikes(slug)

		return new Response(JSON.stringify(result), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		})
	} catch (error) {
		console.error('[API /like GET] Error:', error)
		const message = error instanceof Error ? error.message : String(error)
		return new Response(JSON.stringify({ error: message }), { status: 500 })
	}
}

const postBodySchema = z.object({
	slug: z.string().min(1, 'Slug cannot be empty'),
	photoId: z.string().min(1, 'PhotoId cannot be empty'),
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

		const { slug, photoId } = parsed.data
		const newLikes = await incrementPhotoLike(slug, photoId)

		return new Response(JSON.stringify({ likes: newLikes }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		})
	} catch (error) {
		console.error('[API /like POST] Error:', error)
		const message = error instanceof Error ? error.message : String(error)
		return new Response(JSON.stringify({ error: message }), { status: 500 })
	}
}
