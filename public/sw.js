// Service Worker for offline caching and performance optimization
// Scope: / (all paths)

const CACHE_NAME = 'kegiatan-v1'
const HERO_CACHE = 'hero-images-v1'
const STATIC_CACHE = 'static-v1'

// Helper: safely cache a URL — skips non-200/redirected responses instead of crashing addAll
async function cacheUrl(cache, url) {
	try {
		const response = await fetch(url)
		if (response.ok && response.type === 'basic') {
			await cache.put(url, response)
		} else {
			console.warn('[SW] Skipping (non-ok/opaque):', url, response.status)
		}
	} catch (err) {
		console.warn('[SW] Skipping (fetch failed):', url, err.message)
	}
}

// Install event — cache static assets
self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(STATIC_CACHE)
			const urls = [
				'/',
				'/donasi',
				'/kegiatan',
				'/favicon.svg',
				'/favicon.ico',
				'/logo-yayasan.webp',
				'/logo-yayasan-sm.webp',
				'/qris.webp',
			]
			// Cache each URL individually so one failure doesn't crash the whole install
			await Promise.allSettled(urls.map((url) => cacheUrl(cache, url)))
			return self.skipWaiting()
		})(),
	)
})

// Activate event — clean up old caches
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames
						.filter((cacheName) => {
							return (
								cacheName !== CACHE_NAME && cacheName !== HERO_CACHE && cacheName !== STATIC_CACHE
							)
						})
						.map((cacheName) => caches.delete(cacheName)),
				)
			})
			.then(() => self.clients.claim()),
	)
})

// Fetch event — implement caching strategies
self.addEventListener('fetch', (event) => {
	const request = event.request
	const url = new URL(request.url)

	// Strategy 1: Hero images — Cache-first with fallback
	if (
		url.pathname.match(/\/kegiatan\/([^/]+)\//) &&
		(request.url.endsWith('.webp') || request.url.endsWith('.png'))
	) {
		event.respondWith(
			caches.match(request, { cacheName: HERO_CACHE }).then((response) => {
				if (response) return response
				return fetch(request).then((response) => {
					if (response?.status !== 200 || response.type !== 'basic') return response
					const responseClone = response.clone()
					caches.open(HERO_CACHE).then((cache) => cache.put(request, responseClone))
					return response
				})
			}),
		)
		return
	}

	// Strategy 2: Other images — Network-first with cache fallback
	if (request.url.match(/\.(webp|png|jpg|jpeg|gif|svg)$/)) {
		event.respondWith(
			fetch(request)
				.then((response) => {
					if (response?.status !== 200 || response.type !== 'basic') return response
					const responseClone = response.clone()
					caches.open(HERO_CACHE).then((cache) => cache.put(request, responseClone))
					return response
				})
				.catch(() => {
					return caches.match(request, { cacheName: HERO_CACHE })
				}),
		)
		return
	}

	// Strategy 3: API routes — Network-first only
	if (url.pathname.startsWith('/api/')) {
		event.respondWith(fetch(request).catch(() => new Response('Network error', { status: 503 })))
		return
	}

	// Strategy 4: Everything else — Try cache first, then network
	event.respondWith(
		caches.match(request, { cacheName: STATIC_CACHE }).then((response) => {
			if (response) return response
			return fetch(request)
		}),
	)
})

// Message event — for client communication
self.addEventListener('message', (event) => {
	if (event.data.action === 'CACHE_UPDATED') {
		event.source.postMessage({ type: 'CACHE_UPDATE_COMPLETE' })
	}
})
