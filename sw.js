// ================================
// SERVICE WORKER - PWA CAPABILITIES
// Advanced Caching & Offline Support
// ================================

const CACHE_NAME = 'vibeworks-v1.2';
const CRITICAL_CACHE = 'vibeworks-critical-v1.2';
const IMAGES_CACHE = 'vibeworks-images-v1.2';

// Critical resources for immediate caching
const CRITICAL_RESOURCES = [
    '/',
    '/index.html',
    '/styles.css',
    '/mobile-optimizations.css',
    '/mobile-advanced.css',
    '/script.js',
    '/mobile-optimizations.js',
    '/mobile-advanced.js',
    '/logo-test.png',
    '/manifest.json'
];

// Install event - cache critical resources
self.addEventListener('install', event => {
    console.log('Service Worker installing...');

    event.waitUntil(
        Promise.all([
            // Cache critical resources
            caches.open(CRITICAL_CACHE).then(cache => {
                return cache.addAll(CRITICAL_RESOURCES.map(url => new Request(url, {cache: 'reload'})));
            }),

            // Skip waiting to activate immediately
            self.skipWaiting()
        ])
    );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');

    event.waitUntil(
        Promise.all([
            // Clean old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME &&
                            cacheName !== CRITICAL_CACHE &&
                            cacheName !== IMAGES_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),

            // Take control of all clients
            self.clients.claim()
        ])
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Only handle same-origin requests
    if (url.origin !== location.origin) return;

    // Handle different types of requests
    if (request.destination === 'image') {
        event.respondWith(handleImageRequest(request));
    } else if (isCriticalResource(request.url)) {
        event.respondWith(handleCriticalRequest(request));
    } else {
        event.respondWith(handleGeneralRequest(request));
    }
});

// Handle critical resources (HTML, CSS, JS)
async function handleCriticalRequest(request) {
    try {
        // Try cache first for critical resources
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            // Fetch update in background
            fetchAndCache(request, CRITICAL_CACHE);
            return cachedResponse;
        }

        // If not in cache, fetch from network
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(CRITICAL_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('Critical resource fetch failed:', error);

        // Return offline fallback for HTML requests
        if (request.destination === 'document') {
            return caches.match('/offline.html') || new Response('Offline', { status: 503 });
        }

        throw error;
    }
}

// Handle image requests with progressive loading
async function handleImageRequest(request) {
    try {
        // Check cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Fetch from network
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            // Cache images
            const cache = await caches.open(IMAGES_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('Image fetch failed:', error);

        // Return placeholder image
        return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" fill="#999">Image unavailable</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
        );
    }
}

// Handle general requests
async function handleGeneralRequest(request) {
    try {
        // Network first for general requests
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            // Cache successful responses
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        // Fall back to cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        throw error;
    }
}

// Background fetch and cache
async function fetchAndCache(request, cacheName) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response);
        }
    } catch (error) {
        console.log('Background fetch failed:', error);
    }
}

// Check if resource is critical
function isCriticalResource(url) {
    return CRITICAL_RESOURCES.some(resource => url.includes(resource));
}