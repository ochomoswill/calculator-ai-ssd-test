# Feature 14: Offline Support — Requirements

Roadmap row 14. Branch `spec/2026-09-28-offline-support`.
Design authority: [Requirement 1 of the web technical design](../tech-design-web.md#requirement-1-a-calculator-application-for-web-and-mobile) (Offline operation: a service worker precaches all static files during install using the Cache interface, serves with MDN's cache-first strategy, and versions cache names so a new deployment discards the previous files).

## Goal

Make the calculator work with no network after one online visit. A service worker precaches every static file at install, answers requests from the cache first and falls back to the network, and cleans up caches from earlier versions when a new version activates. The page registers the worker only when the browser supports it, so unsupported browsers are unaffected.

## Must do

### Service worker
- R1. A service worker script at the source root declares a versioned cache name and an explicit precache list containing every static file the app needs: the page, the manifest, both stylesheets, every JavaScript module and both icons.
- R2. On install the worker opens the versioned cache and adds every precache entry, and asks to skip waiting so a new version takes over promptly.
- R3. On activate the worker deletes every cache whose name is not the current versioned name and claims open clients.
- R4. On fetch the worker handles only GET requests for the same origin: it answers from the cache when a match exists, otherwise fetches from the network, stores a copy of a successful response in the current cache, and returns it; when both fail for a navigation request it falls back to the cached page.
- R5. The worker uses no browser API beyond the service worker globals, the Cache interface and fetch, and imports nothing.

### Registration
- R6. The entry module registers the worker after mounting, only when the service worker API exists, inside a guard so a registration failure never affects the calculator.

### Versioning
- R7. The cache version is a single constant in the worker; bumping it is the deployment step that discards old caches, and the precache list is checked by tests against the files that actually exist so a new file cannot be forgotten.

### Tests
- R8. Automated tests run the worker script in an isolated context with stubbed service-worker globals and verify: every precache entry maps to an existing file and every servable file under the source folder is listed; install adds the list to the versioned cache; activate deletes other caches; fetch returns cached responses, caches network responses on a miss, ignores non-GET and cross-origin requests, and falls back to the cached page for a failed navigation; the entry module registers the worker under a support check. A manual scenario covers real offline use.

## Explicitly not included

- No background sync, push or update prompts (not on the roadmap).
- No runtime caching of third-party resources; the app has none.
