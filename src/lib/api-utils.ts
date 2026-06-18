/**
 * API utility helpers
 */
export function apiErrorResponse(error: unknown, context: string): Response {
	console.error(`[API /${context}] Error:`, error)
	const message = error instanceof Error ? error.message : String(error)
	return new Response(JSON.stringify({ error: message }), {
		status: 500,
		headers: { 'Content-Type': 'application/json' },
	})
}
