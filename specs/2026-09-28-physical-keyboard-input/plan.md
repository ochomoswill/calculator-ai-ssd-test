# Feature 10: Physical Keyboard Input — Plan

Plain JavaScript ES modules, no framework, no build step; tests run with Node's built-in test runner. No HTML, CSS, formatter, tooling or dependency changes.

## Tooling
| File | Purpose |
|---|---|
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
| `src/js/engine/engine.js` | Changed. Adds the delete-last action. |
| `src/js/engine/README.md` | Changed. Lists the action. |
| `src/js/app.js` | Changed. Adds a key-to-action map for keyboard keys and one keydown listener on the owning document that applies R3 to R7; the shared apply-and-render step is factored so click and keydown use it. |

## Tests
| File | Purpose |
|---|---|
| `test/keyboard.test.js` | New. Engine test for delete-last and DOM tests for acceptance scenarios A1 to A9. |
| `test/app.test.js` | Changed. Scenario A2 now expects exactly one click listener and one keydown listener. |
| `test/helpers/dom.js` | Changed. Adds a helper that dispatches a keydown with a given key on the document (or a target) and returns whether default was prevented. |

## Out of scope for this plan
No markup, style or tooling changes; no shortcut for Toggle sign.
