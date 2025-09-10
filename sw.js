// VibeWorks AI Studio - Advanced Service Worker
// High-performance caching for lightning-fast loading

const CACHE_NAME = 'vibeworks-v1';
const STATIC_CACHE = 'vibeworks-static-v1';
const IMAGE_CACHE = 'vibeworks-images-v1';
const API_CACHE = 'vibeworks-api-v1';

// Assets to cache immediately
const CRITICAL_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json'
];

// Images to cache on demand
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];

// Cache strategies
const CACHE_STRATEGIES = {
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Install event - cache critical assets
self.addEventListener('install', event => {
    console.log('[SW] Installing service worker...');
    
    event.waitUntil(
        Promise.all([
            // Cache critical assets
            caches.open(STATIC_CACHE).then(cache => {
                console.log('[SW] Caching critical assets');
                return cache.addAll(CRITICAL_ASSETS);
            }),
            // Skip waiting to activate immediately
            self.skipWaiting()
        ])
    );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating service worker...');
    
    event.waitUntil(
        Promise.all([
            // Clean old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (!cacheName.includes('vibeworks-') || 
                            cacheName.includes('old') ||
                            (!cacheName.includes(STATIC_CACHE.split('-')[2]) && 
                             !cacheName.includes(IMAGE_CACHE.split('-')[2]) && 
                             !cacheName.includes(API_CACHE.split('-')[2]))) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Claim clients immediately
            self.clients.claim()
        ])
    );
});

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-HTTP requests
    if (!request.url.startsWith('http')) return;
    
    // Determine caching strategy based on request type
    if (isStaticAsset(url)) {
        event.respondWith(handleStaticAsset(request));
    } else if (isImage(url)) {
        event.respondWith(handleImage(request));
    } else if (isAPIRequest(url)) {
        event.respondWith(handleAPIRequest(request));
    } else {
        event.respondWith(handleDocument(request));
    }
});

// Check if URL is a static asset
function isStaticAsset(url) {
    const pathname = url.pathname;
    return pathname.endsWith('.css') || 
           pathname.endsWith('.js') || 
           pathname.endsWith('.json') ||
           pathname.endsWith('.woff') ||
           pathname.endsWith('.woff2');
}

// Check if URL is an image
function isImage(url) {
    const pathname = url.pathname.toLowerCase();
    return IMAGE_EXTENSIONS.some(ext => pathname.endsWith(ext));
}

// Check if URL is an API request
function isAPIRequest(url) {
    return url.pathname.includes('/api/') || 
           url.hostname !== self.location.hostname;
}

// Handle static assets - Cache First strategy
async function handleStaticAsset(request) {
    try {
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            // Serve from cache, update in background
            updateCacheInBackground(request, cache);
            return cachedResponse;
        }
        
        // Not in cache, fetch and cache
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
        
    } catch (error) {
        console.error('[SW] Static asset fetch failed:', error);
        return new Response('Asset not available', { status: 503 });
    }
}

// Handle images - Cache First with compression
async function handleImage(request) {
    try {
        const cache = await caches.open(IMAGE_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Fetch with optimization
        const networkResponse = await fetchWithOptimization(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
        
    } catch (error) {
        console.error('[SW] Image fetch failed:', error);
        // Return placeholder image or empty response
        return new Response('', { status: 503 });
    }
}

// Handle API requests - Network First with timeout
async function handleAPIRequest(request) {
    try {
        const cache = await caches.open(API_CACHE);
        
        // Try network first with timeout
        const networkPromise = fetchWithTimeout(request, 5000);
        const cachePromise = cache.match(request);
        
        try {
            const networkResponse = await networkPromise;
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
                return networkResponse;
            }
        } catch (networkError) {
            console.warn('[SW] Network failed, trying cache:', networkError);
        }
        
        // Fallback to cache
        const cachedResponse = await cachePromise;
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw new Error('No network or cache available');
        
    } catch (error) {
        console.error('[SW] API request failed:', error);
        return new Response(JSON.stringify({ error: 'Service unavailable' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Handle documents - Stale While Revalidate
async function handleDocument(request) {
    try {
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        // Always try to fetch fresh content
        const networkPromise = fetch(request);
        
        if (cachedResponse) {
            // Serve stale content immediately
            networkPromise
                .then(response => {
                    if (response.ok) {
                        cache.put(request, response.clone());
                    }
                })
                .catch(error => console.warn('[SW] Background update failed:', error));
            
            return cachedResponse;
        }
        
        // No cache, wait for network
        const networkResponse = await networkPromise;
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
        
    } catch (error) {
        console.error('[SW] Document fetch failed:', error);
        return new Response('Page not available', { 
            status: 503,
            headers: { 'Content-Type': 'text/html' }
        });
    }
}

// Utility functions
async function updateCacheInBackground(request, cache) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
    } catch (error) {
        console.warn('[SW] Background cache update failed:', error);
    }
}

async function fetchWithTimeout(request, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(request, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

async function fetchWithOptimization(request) {
    // Add image optimization headers if possible
    const headers = new Headers(request.headers);
    
    // Request WebP if supported
    if (headers.get('accept')?.includes('image/webp')) {
        headers.set('accept', 'image/webp,image/*,*/*;q=0.8');
    }
    
    return fetch(request, {
        headers,
        mode: request.mode,
        cache: 'default'
    });
}

// Handle cache storage quota
self.addEventListener('quotaexceeded', event => {
    console.warn('[SW] Storage quota exceeded, cleaning cache...');
    
    event.waitUntil(
        cleanOldCaches()
    );
});

async function cleanOldCaches() {
    try {
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => 
            name.includes('vibeworks-') && 
            !name.includes('v1')
        );
        
        await Promise.all(
            oldCaches.map(cacheName => caches.delete(cacheName))
        );
        
        console.log('[SW] Cleaned old caches:', oldCaches);
    } catch (error) {
        console.error('[SW] Cache cleanup failed:', error);
    }
}

// Performance monitoring
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'PERFORMANCE_MEASURE') {
        const { name, startTime, endTime } = event.data;
        console.log(`[SW] Performance: ${name} took ${endTime - startTime}ms`);
    }
});

console.log('[SW] Service worker loaded successfully');
