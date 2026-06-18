import { fetchAllGalleries, filterPublishedGalleries } from '@data/galleries'
import { apiErrorResponse } from '@lib/api-utils'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
	try {
		const allGalleries = await fetchAllGalleries()
		const galleries = filterPublishedGalleries(allGalleries)

		return new Response(JSON.stringify(galleries), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=300',
			},
		})
	} catch (error) {
		return apiErrorResponse(error, 'galleries')
	}
}
