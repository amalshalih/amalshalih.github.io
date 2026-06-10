import { env } from 'cloudflare:workers'

interface GalleryLikeData {
	count: number
	users: Record<string, number>
}

/**
 * Gets the KV key for gallery likes
 */
function getGalleryKey(slug: string): string {
	return `gallery:${slug}`
}

/**
 * Gets the KV key for photo likes
 */
function getPhotoLikeKey(slug: string, photoId: string): string {
	return `photo:${slug}:${photoId}`
}

/**
 * Fetch like statistics for a specific gallery
 */
export async function getGalleryLikes(slug: string): Promise<GalleryLikeData> {
	try {
		const data = await env.LIKES.get(getGalleryKey(slug))
		if (data) {
			return JSON.parse(data) as GalleryLikeData
		}
	} catch (error) {
		console.error('[Likes Library] getGalleryLikes error:', error)
	}
	return { count: 0, users: {} }
}

/**
 * Toggle like for a gallery by a user
 */
export async function toggleGalleryLike(
	slug: string,
	userId: string,
	action?: 'like' | 'unlike',
): Promise<{ count: number; liked: boolean }> {
	const data = await getGalleryLikes(slug)
	const currentlyLiked = !!data.users[userId]

	if (action === 'unlike' || currentlyLiked) {
		delete data.users[userId]
		data.count = Math.max(0, data.count - 1)
	} else {
		data.users[userId] = Date.now()
		data.count = data.count + 1
	}

	await env.LIKES.put(getGalleryKey(slug), JSON.stringify(data))

	return {
		count: data.count,
		liked: !!data.users[userId],
	}
}

/**
 * Fetch like counts for all photos in a gallery
 */
export async function getPhotoLikes(slug: string): Promise<Record<string, number>> {
	try {
		const prefix = `photo:${slug}:`
		const keys = await env.LIKES.list({ prefix })
		const result: Record<string, number> = {}

		await Promise.all(
			keys.keys.map(async (key: { name: string }) => {
				const photoId = key.name.replace(prefix, '')
				const count = await env.LIKES.get(key.name)
				result[photoId] = parseInt(count || '0', 10)
			}),
		)
		return result
	} catch (error) {
		console.error('[Likes Library] getPhotoLikes error:', error)
		return {}
	}
}

/**
 * Increment like count for a specific photo
 */
export async function incrementPhotoLike(slug: string, photoId: string): Promise<number> {
	const key = getPhotoLikeKey(slug, photoId)
	const current = await env.LIKES.get(key)
	const newLikes = parseInt(current || '0', 10) + 1
	await env.LIKES.put(key, newLikes.toString())
	return newLikes
}
