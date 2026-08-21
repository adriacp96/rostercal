const CACHE_NAME = 'rostercal-v1';

// Lista de todos los archivos necesarios para funcionar offline
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './airports.js',
  './event_codes.js',
  './manifest.json',
  './calendar.png',
  './success.gif'
];

// Evento de Instalación: Guarda los archivos en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✅ Service Worker: Guardando recursos en caché');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Evento de Activación: Limpia cachés antiguas si cambias la versión
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('🧹 Service Worker: Limpiando caché antigua');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Evento Fetch: Sirve los archivos desde la caché si el usuario está offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Devuelve la versión en caché si existe, si no, hace la petición a internet
      return cachedResponse || fetch(event.request);
    }).catch(() => {
      // Opcional: Podrías devolver una página de error offline aquí si fuera necesario
      console.error('Network request failed and no cache found for:', event.request.url);
    })
  );
});
