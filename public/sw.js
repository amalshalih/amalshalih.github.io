// Service Worker for offline caching and performance optimization
// Scope: / (all paths)
// Cache strategy: Cache-first for hero images, Network-first for other resources

const CACHE_NAME = 'kegiatan-v1'
const HERO_CACHE = 'hero-images-v1'
const STATIC_CACHE = 'static-v1'

// Install event - cache static assets
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(STATIC_CACHE)
			.then((cache) =>
				cache.addAll([
					'/',
					'/donasi',
					'/kegiatan',
					'/api/kegiatan',
					'/offline.html',
					'/favicon.svg',
					'/favicon.ico',
					'/logo-yayasan.webp',
					'/logo-yayasan-sm.webp',
					'/qris.webp',
				]),
			)
			.then(() => self.skipWaiting()),
	)

	// Cache hero images separately
	event.waitUntil(
		caches.open(HERO_CACHE).then((cache) => {
			// Add hero image patterns (will be populated on fetch)
			return self.skipWaiting()
		}),
	)
})

// Activate event - clean up old caches
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

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
	const request = event.request
	const url = new URL(request.url)

	// Strategy 1: Hero images - Cache-first with fallback
	if (
		url.pathname.match(/\/kegiatan\/([^/]+)\//) &&
		(request.url.endsWith('.webp') || request.url.endsWith('.png'))
	) {
		event.respondWith(
			caches.match(request, { cacheName: HERO_CACHE }).then((response) => {
				// Return cached version if available
				if (response) {
					return response
				}
				// Otherwise fetch and cache
				return fetch(request).then((response) => {
					if (!response || response.status !== 200 || response.type !== 'basic') {
						return response
					}
					// Clone response for caching
					const responseClone = response.clone()
					caches.open(HERO_CACHE).then((cache) => cache.put(request, responseClone))
					return response
				})
			}),
		)
		return
	}

	// Strategy 2: Other images - Network-first with cache fallback
	if (request.url.match(/\.(webp|png|jpg|jpeg|gif|svg)$/)) {
		event.respondWith(
			fetch(request)
				.then((response) => {
					if (!response || response.status !== 200 || response.type !== 'basic') {
						return response
					}
					const responseClone = response.clone()
					// Cache successful responses
					caches.open(HERO_CACHE).then((cache) => cache.put(request, responseClone))
					return response
				})
				.catch(() => {
					// Network failed - try cache
					return caches.match(request, { cacheName: HERO_CACHE })
				}),
		)
		return
	}

	// Strategy 3: API routes - Network-first only
	if (url.pathname.startsWith('/api/')) {
		event.respondWith(
			fetch(request)
				.then((response) => {
					if (!response || response.status !== 200) {
						return response
					}
					return response
				})
				.catch(() => new Response('Network error', { status: 503 })),
		)
		return
	}

	// Strategy 4: Everything else - Try cache first, then network
	event.respondWith(
		caches.match(request, { cacheName: STATIC_CACHE }).then((response) => {
			if (response) return response
			return fetch(request)
		}),
	)
})

// Message event - for client communication
self.addEventListener('message', (event) => {
	if (event.data.action === 'CACHE_UPDATED') {
		// Notify client that new cache is available
		event.source.postMessage({ type: 'CACHE_UPDATE_COMPLETE' })
	}
})
