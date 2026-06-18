import { apiErrorResponse } from '@lib/api-utils'
import { getPhotoLikes, incrementPhotoLike } from '@lib/likes'
import type { APIRoute } from 'astro'
import { z } from 'zod'

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
		return apiErrorResponse(error, 'like GET')
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
		return apiErrorResponse(error, 'like POST')
	}
}
