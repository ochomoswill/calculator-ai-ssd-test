# Feature 15: Engine Package for Mobile — Plan

Plain JavaScript ES modules with no build step; the browser resolves the package through an import map and Node through an npm workspace. Tests run with Node's built-in test runner. No CSS, engine-logic or formatter changes.

## Tooling
| File | Purpose |
|---|---|
| `package.json` | Changed. Adds the workspaces list naming the engine folder. |
| `package-lock.json` | Changed. Records the workspace link after install. |
| `src/js/engine/package.json` | New. The package manifest from requirement R1. |

## HTML
| File | Purpose |
|---|---|
| `src/index.html` | Changed. Adds an import map script before the module script mapping "@calculator/engine" to the engine file. |

## CSS
| File | Purpose |
|---|---|
| none | Unchanged. |

## JavaScript
| File | Purpose |
|---|---|
| `src/js/app.js` | Changed. Imports the engine by the bare specifier. |
| `src/js/engine/README.md` | Changed. States the package name and consumption rules. |
| `src/sw.js` | Unchanged. The engine file path stays in the precache list; the package manifest is never fetched by the browser. |

## Tests
| File | Purpose |
|---|---|
| `test/package.test.js` | New. Tests for acceptance scenarios A1 to A6. |
| `test/engine.test.js`, `test/addition.test.js`, `test/subtraction.test.js`, `test/multiplication.test.js`, `test/division.test.js`, `test/range-check.test.js`, `test/keyboard.test.js`, `test/persistence.test.js` | Changed. Import the engine by the bare specifier. |
| `test/app.test.js` | Changed. Scenario A3's expected import list uses the bare specifier. |
| `test/offline.test.js` | Changed. The source listing ignores the engine's package manifest, which the browser never fetches. |

## Out of scope for this plan
No mobile app, no registry publishing, no engine logic changes.
