const CACHE_NAME = 'flat-lili-v1';
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/offline.html',
    '/index.css',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip chrome extensions and non-http requests
    if (!event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);

            // Try network first for API calls
            if (event.request.url.includes('/api/')) {
                try {
                    const networkResponse = await fetch(event.request);
                    return networkResponse;
                } catch (error) {
                    console.log('[Service Worker] API call failed, returning offline');
                    const cachedResponse = await cache.match('/offline.html');
                    return cachedResponse || new Response('Offline');
                }
            }

            // For other requests, try cache first
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) {
                // Update cache in background
                fetch(event.request).then((networkResponse) => {
                    cache.put(event.request, networkResponse.clone());
                });
                return cachedResponse;
            }

            // Fallback to network
            try {
                const networkResponse = await fetch(event.request);
                // Cache successful responses
                if (networkResponse && networkResponse.status === 200) {
                    cache.put(event.request, networkResponse.clone());
                }
                return networkResponse;
            } catch (error) {
                console.log('[Service Worker] Fetch failed, returning offline');
                // Return offline page for navigation requests
                if (event.request.mode === 'navigate') {
                    return cache.match('/offline.html');
                }
                return new Response('Offline', { status: 503 });
            }
        })()
    );
});
