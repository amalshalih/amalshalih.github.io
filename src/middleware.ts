import { defineMiddleware } from 'astro:middleware'

const LEGACY_DOMAINS = ['amalshalih.id', 'www.amalshalih.id']
const CANONICAL_HOST = 'amalshalih.or.id'

export const onRequest = defineMiddleware(async (context, next) => {
	const { hostname, pathname } = context.url

	if (LEGACY_DOMAINS.includes(hostname)) {
		return context.redirect(`https://${CANONICAL_HOST}${pathname}`, 301)
	}

	const response = await next()
	const headers = new Headers(response.headers)

	// Content-Security-Policy-Report-Only — production safety monitoring
	// Covers: Google Fonts, Sanity CMS, Sentry, Resend, Google Drive, social embeds
	headers.set(
		'Content-Security-Policy-Report-Only',
		"default-src 'self'; " +
			"script-src 'self' 'unsafe-inline' https://*.sentry.io; " +
			"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
			"font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com; " +
			"img-src 'self' data: blob: https://cdn.sanity.io https://facebook.com https://instagram.com https://youtube.com https://tiktok.com https://wa.me https://www.google.com/maps https://linktr.ee https://www.googleapis.com; " +
			"connect-src 'self' https://*.ingest.us.sentry.io https://api.resend.com https://www.googleapis.com https://fonts.googleapis.com https://fonts.gstatic.com; " +
			"frame-src 'self' https://www.youtube.com https://youtube.com https://facebook.com https://instagram.com https://linktr.ee https://wa.me; " +
			"form-action 'self' https://api.resend.com; " +
			"base-uri 'self'; media-src 'self'; object-src 'none'; worker-src 'self';",
	)

	headers.set('X-Content-Type-Options', 'nosniff')
	headers.set('X-Frame-Options', 'DENY')
	headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
	headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()')

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	})
})
