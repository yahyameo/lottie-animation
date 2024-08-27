self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('lottie-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/static/js/main.dcc3550c.js',
        '/static/css/main.15f09621.css',
        '/favicon.ico', 
        // Add other assets you want to cache
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
