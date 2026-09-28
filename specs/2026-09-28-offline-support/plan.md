# Feature 14: Offline Support — Plan

Plain JavaScript with no build step; tests run with Node's built-in test runner using its vm module to execute the worker with stubbed globals. No CSS, engine, formatter or dependency changes.

## Tooling
| File | Purpose |
|---|---|
| `tools/serve.js` | Unchanged. Serves the worker as JavaScript from the source root. |
| `package.json` | Unchanged. |

## HTML
| File | Purpose |
|---|---|
| `src/index.html` | Unchanged. |

## CSS
| File | Purpose |
|---|---|
| none | Unchanged. |

## JavaScript
| File | Purpose |
|---|---|
| `src/sw.js` | New. Versioned cache name, precache list, install, activate and fetch handlers as in requirements R1 to R5. Written as a classic script (no imports) because it runs as a worker. |
| `src/js/main.js` | Changed. After mounting, registers the worker when supported, inside a guard. |

## Tests
| File | Purpose |
|---|---|
| `test/offline.test.js` | New. Loads the worker into a vm context with fake caches, fetch and self; tests for acceptance scenarios A1 to A7. |
| `test/app.test.js` | Changed. Scenario A15 still checks the mount call and additionally allows the registration lines. |

## Out of scope for this plan
No background sync, push, update prompts or third-party caching.
