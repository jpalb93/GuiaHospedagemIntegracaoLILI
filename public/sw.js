const CACHE_NAME = 'flat-lili-v2'; // Increment version to force update
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/offline.html',
    '/index.css',
    '/logo.svg',
    '/vite.svg'
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

// Fetch event
self.addEventListener('fetch', (event) => {
    // Skip non-http requests (e.g. chrome-extension:)
    if (!event.request.url.startsWith('http')) return;

    // 1. API Strategy (Network First -> Cache -> JSON Offline Error)
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            (async () => {
                const cache = await caches.open(CACHE_NAME);
                try {
                    const networkResponse = await fetch(event.request);
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                } catch (error) {
                    console.log('[Service Worker] API offline fallback:', event.request.url);
                    const cachedResponse = await cache.match(event.request);
                    if (cachedResponse) return cachedResponse;

                    // JSON fallback for API
                    return new Response(JSON.stringify({ error: 'offline' }), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            })()
        );
        return;
    }

    // 2. Navigation Strategy (Network First -> Cache (index) -> Offline Page)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                try {
                    const networkResponse = await fetch(event.request);
                    return networkResponse;
                } catch (error) {
                    const cache = await caches.open(CACHE_NAME);
                    // Try to return the cached index.html for SPA to load
                    const cachedIndex = await cache.match('/');
                    if (cachedIndex) return cachedIndex;

                    const cachedOffline = await cache.match('/offline.html');
                    return cachedOffline || new Response('Offline Mode');
                }
            })()
        );
        return;
    }

    // 3. Asset Strategy (Stale-While-Revalidate)
    // Serves cache immediately, updates in background
    if (event.request.method === 'GET') {
        event.respondWith(
            (async () => {
                const cache = await caches.open(CACHE_NAME);
                const cachedResponse = await cache.match(event.request);

                if (cachedResponse) {
                    // Update cache in background
                    fetch(event.request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                    }).catch(() => { }); // Eat errors in background sync
                    return cachedResponse;
                }

                try {
                    const networkResponse = await fetch(event.request);
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                } catch (error) {
                    // If image, maybe return placeholder?
                    return new Response('Asset unavailable', { status: 404 });
                }
            })()
        );
    }
});
