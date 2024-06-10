import { precacheAndRoute } from 'workbox-precaching';

/* eslint-disable no-restricted-globals */
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('static-cache-v1').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/manifest.json',
          '/favicon.ico',
          '/logo192.png',
          '/logo512.png'
        ]);
      })
    );
  });
  
  self.addEventListener('activate', (event) => {
    const currentCaches = ['static-cache-v1'];
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
      }).then((cachesToDelete) => {
        return Promise.all(cachesToDelete.map((cacheToDelete) => {
          return caches.delete(cacheToDelete);
        }));
      }).then(() => self.clients.claim())
    );
  });
  
  self.addEventListener('fetch', (event) => {
    if (event.request.url.startsWith(self.location.origin)) {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
  
          return caches.open('static-cache-v1').then((cache) => {
            return fetch(event.request).then((response) => {
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            });
          });
        })
      );
    }
  });
  
  precacheAndRoute(self.__WB_MANIFEST || []);