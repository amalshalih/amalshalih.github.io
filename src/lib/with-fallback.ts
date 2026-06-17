/**
 * Higher-order function for data fetching with graceful fallback
 *
 * @param fetchFn - The async fetch function to execute
 * @param fallback - Fallback value to return if fetch fails
 * @param context - Context name for error logging (e.g., 'Site settings fetch')
 * @returns Promise<T> - The fetched data or fallback value
 *
 * @example
 * const siteSettings = await withFallback(
 *   () => getSiteSettings(),
 *   DEFAULT_SETTINGS,
 *   'Site settings fetch'
 * )
 */
export async function withFallback<T>(
	fetchFn: () => Promise<T>,
	fallback: T,
	context: string,
): Promise<T> {
	try {
		const result = await fetchFn()
		return result ?? fallback
	} catch (error) {
		console.error(`[Sanity] ${context} failed:`, error)
		return fallback
	}
}

/**
 * Higher-order function for data fetching that returns null on failure
 *
 * @param fetchFn - The async fetch function to execute
 * @param context - Context name for error logging
 * @returns Promise<T | null> - The fetched data or null
 *
 * @example
 * const pengurus = await withNull(
 *   () => getPengurus(),
 *   'Pengurus fetch'
 * )
 */
export async function withNull<T>(fetchFn: () => Promise<T>, context: string): Promise<T | null> {
	try {
		const result = await fetchFn()
		return result ?? null
	} catch (error) {
		console.error(`[Sanity] ${context} failed:`, error)
		return null
	}
}
