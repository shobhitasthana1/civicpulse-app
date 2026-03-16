/* ═══════════════════════════════════════════════════════
   CivicPulse — sw.js  (Service Worker v2)
   Improved offline caching + background sync ready
═══════════════════════════════════════════════════════ */

const CACHE_NAME = 'civicpulse-v2';
const STATIC_CACHE = 'civicpulse-static-v2';
const DYNAMIC_CACHE = 'civicpulse-dynamic-v2';

/* Core assets to pre-cache on install */
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/css/mobile-fix.css',
  '/assets/js/app.js',
  '/assets/js/shared-ui.js',
  '/page/report.html',
  '/page/reports.html',
  '/page/dashboard.html',
  '/page/emergency.html',
  '/page/resources.html',
  '/page/activity.html',
  '/page/contact.html',
  '/page/features.html',
  '/page/team.html',
  '/manifest_json',
];

/* ── INSTALL — pre-cache static assets ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      })
      .catch(err => {
        /* If some assets fail, still install — don't block */
        console.warn('[SW] Some assets failed to cache during install:', err);
      })
  );
  /* Force this SW to become active immediately */
  self.skipWaiting();
});

/* ── ACTIVATE — clean up old caches ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  /* Take control of all pages immediately */
  self.clients.claim();
});

/* ── FETCH — cache-first for static, network-first for dynamic ── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  /* Skip non-GET requests */
  if (request.method !== 'GET') return;

  /* Skip chrome-extension, analytics, external CDNs for caching */
  if (
    url.protocol === 'chrome-extension:' ||
    url.hostname.includes('google-analytics') ||
    url.hostname.includes('doubleclick') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('cdn.tailwindcss.com')
  ) {
    /* For fonts/CDN: network with cache fallback */
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(cache =>
        fetch(request)
          .then(response => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          })
          .catch(() => caches.match(request))
      )
    );
    return;
  }

  /* Static assets: cache-first */
  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const cloned = response.clone();
            caches.open(STATIC_CACHE).then(cache => cache.put(request, cloned));
          }
          return response;
        }).catch(() => {
          /* Return offline fallback for HTML pages */
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
        });
      })
    );
    return;
  }

  /* Default: network-first with dynamic cache fallback */
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const cloned = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, cloned));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then(cached => {
          if (cached) return cached;
          /* For navigation requests, return index.html as offline fallback */
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
        });
      })
  );
});

/* ── Helper: detect static assets ── */
function isStaticAsset(pathname) {
  return (
    pathname.endsWith('.html') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.webp') ||
    pathname === '/' ||
    pathname.includes('/icons/') ||
    pathname.includes('/image/')
  );
}

/* ── PUSH NOTIFICATION support (future use) ── */
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  self.registration.showNotification(data.title || 'CivicPulse', {
    body: data.body || 'New update from Kanpur civic reports',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: { url: data.url || '/' },
    vibrate: [200, 100, 200],
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});