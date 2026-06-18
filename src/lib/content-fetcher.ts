import { getCollection } from 'astro:content'
import { withFallback } from './with-fallback'

/**
 * Fetch content with Sanity-first strategy and markdown fallback
 *
 * @param sanityFetcher - Async function to fetch from Sanity
 * @param collectionName - Astro collection name ('blog' or 'kegiatan')
 * @param context - Context name for error logging
 * @returns Array of content items
 */
export async function fetchContentWithFallback<T>(
	sanityFetcher: () => Promise<T[]>,
	collectionName: 'blog' | 'kegiatan',
	context: string,
): Promise<T[]> {
	// Try Sanity first
	const sanityData = await withFallback(sanityFetcher, [], `${context} - Sanity fetch`)

	if (sanityData && sanityData.length > 0) {
		return sanityData
	}

	// Fallback to markdown collection
	const markdownData = await getCollection(collectionName)
	return markdownData as unknown as T[]
}

/**
 * Sort content items by date (newest first)
 */
export function sortByDate<T extends { data: { date: Date } }>(items: T[]): T[] {
	return items.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}
