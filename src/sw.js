// Service worker: precaches every static file and serves cache-first.
// See specs/tech-design-web.md, Requirement 1 (Offline operation).
// Classic script: no imports. Bump CACHE_VERSION on every deployment.

const CACHE_VERSION = "v1";
const CACHE_NAME = `calculator-${CACHE_VERSION}`;

const PRECACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/base.css",
  "./css/calculator.css",
  "./js/main.js",
  "./js/app.js",
  "./js/format.js",
  "./js/storage.js",
  "./js/engine/engine.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  if (new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    if (request.mode === "navigate") {
      const page = await caches.match("./index.html");
      if (page) return page;
    }
    throw error;
  }
}
