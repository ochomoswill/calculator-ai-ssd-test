# Feature 14: Offline Support — Acceptance

A1 to A7 are automated with the worker running in Node's vm module against stubbed globals. A8 is manual in a browser.

**A1. Precache list complete and valid**
Given the worker's precache list, then every entry resolves to a file under the source folder, and every servable file under the source folder (page, manifest, stylesheets, modules, icons; documentation files excluded) appears in the list.

**A2. Install precaches into the versioned cache**
Given a fresh worker, when the install event runs to completion, then a cache named with the current version holds every precache entry and skip-waiting was requested.

**A3. Activate deletes old caches**
Given caches from two older versions and the current one, when the activate event runs, then only the current cache remains and clients were claimed.

**A4. Cache-first hit**
Given the current cache holds the page, when a same-origin GET for the page is fetched, then the cached response is returned and the network is not called.

**A5. Miss fetches and stores**
Given the cache lacks a file, when a same-origin GET for it is fetched, then the network response is returned and a copy is now in the cache.

**A6. Non-GET and cross-origin pass through**
Given a POST request and a cross-origin GET, when fetched, then the worker does not respond to them.

**A7. Navigation fallback and registration**
Given the network fails for a navigation request, then the cached page is returned; and given the entry module source, then it registers the worker inside a service-worker support check and a guard.

**A8. Real offline use (manual)**
Given the app served over HTTPS or localhost and loaded once, when the network is disabled and the page is reloaded, then the calculator loads and computes; and after bumping the cache version and reloading online, only the new cache remains.
