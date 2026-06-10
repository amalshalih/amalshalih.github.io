import { env } from 'cloudflare:workers'
import type { APIRoute } from 'astro'
import { getAccessToken } from '../../../lib/google-drive'

export const prerender = false

function getCredentials(): string | undefined {
	return env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY
}

const GOOGLE_DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files'

export const GET: APIRoute = async ({ params, request }) => {
	const { id } = params
	const url = new URL(request.url)
	const size = Number(url.searchParams.get('size')) || 800

	if (!id) {
		return new Response('Missing file ID', { status: 400 })
	}

	const credentials = getCredentials()
	if (!credentials) {
		return new Response(null, { status: 404 })
	}

	try {
		const token = await getAccessToken()

		// Thumbnail: use Drive API thumbnailLink (a small Google CDN image)
		if (size <= 800) {
			const metaRes = await fetch(`${GOOGLE_DRIVE_API_URL}/${id}?fields=thumbnailLink`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			if (metaRes.ok) {
				const meta: { thumbnailLink?: string } = await metaRes.json()
				if (meta.thumbnailLink) {
					const thumbRes = await fetch(meta.thumbnailLink)
					if (thumbRes.ok) {
						return new Response(thumbRes.body, {
							headers: {
								'Content-Type': thumbRes.headers.get('Content-Type') || 'image/jpeg',
								'Cache-Control': 'public, max-age=86400',
							},
						})
					}
				}
			}
		}

		// Full image: Drive API alt=media
		const apiRes = await fetch(`${GOOGLE_DRIVE_API_URL}/${id}?alt=media`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		if (apiRes.ok) {
			return new Response(apiRes.body, {
				headers: {
					'Content-Type': apiRes.headers.get('Content-Type') || 'image/jpeg',
					'Cache-Control': 'public, max-age=86400',
				},
			})
		}
	} catch (e) {
		console.error('Drive API proxy failed:', e)
	}

	return new Response(null, { status: 404 })
}
