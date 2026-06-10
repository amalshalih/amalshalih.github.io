import type { APIRoute } from 'astro'
import { fetchAllGalleries, filterPublishedGalleries } from '../../data/galleries'

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
		console.error('Error fetching galleries:', error)
		const message = error instanceof Error ? error.message : String(error)
		return new Response(JSON.stringify({ error: message || 'Failed to fetch galleries' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		})
	}
}
