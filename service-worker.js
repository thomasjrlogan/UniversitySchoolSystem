
const CACHE_NAME = 'cuc-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico', 
  // Add paths to your main JS/CSS bundles if they are local and versioned
  // e.g., '/static/js/bundle.js', '/static/css/main.css'
  // For CDN resources like Tailwind and esm.sh, the browser caching + service worker network-first strategy is usually sufficient.
  // Placeholder for icons directory if you add them:
  // '/icons/icon-192x192.png', 
  // '/icons/icon-512x512.png' 
];

// Install a service worker
self.addEventListener('install', event => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Precaching app shell');
        // Add core assets that make up the app shell.
        // Be careful with what you add here. Large files or too many files
        // can delay service worker installation.
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
      })
      .catch(error => {
        console.error('[Service Worker] Precaching app shell failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate the service worker
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate');
  clients.claim(); // Become available to all pages
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetching content using Service Worker
self.addEventListener('fetch', event => {
  // We only want to handle GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  // For navigation requests, try network first, then cache, then offline page.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If response is good, clone it and store in cache.
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache.
          return caches.match(event.request)
            .then(cachedResponse => {
              return cachedResponse || caches.match('/index.html'); // Fallback to index.html for SPAs
            });
        })
    );
    return;
  }

  // For other requests (assets), try cache first, then network.
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
  );
});
