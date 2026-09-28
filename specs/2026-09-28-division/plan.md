# Feature 9: Division — Plan

Plain JavaScript ES modules, no framework, no build step; tests run with Node's built-in test runner. No HTML, CSS, formatter, tooling or dependency changes.

## Tooling
| File | Purpose |
|---|---|
| `package.json` | Unchanged. |

## HTML
| File | Purpose |
|---|---|
| `src/index.html` | Unchanged. The Divide key already exists with its glyph and accessible name. |

## CSS
| File | Purpose |
|---|---|
| none | Unchanged. |

## JavaScript
| File | Purpose |
|---|---|
| `src/js/engine/engine.js` | Changed. Adds "divide" to the operations table and "divide-by-zero" to the error kinds; the shared compute path checks the divisor before running a division and returns the error state. |
| `src/js/engine/README.md` | Changed. Lists the operation and the new error kind. |
| `src/js/app.js` | Changed. Maps the "divide" key; adds the message for the new kind. |

## Tests
| File | Purpose |
|---|---|
| `test/division.test.js` | New. Engine and DOM tests for acceptance scenarios A1 to A10. |
| `test/app.test.js`, `test/addition.test.js`, `test/subtraction.test.js`, `test/multiplication.test.js` | Changed. Inert-key checks are removed or reduced to a no-op assertion since every operation key is now live; the invalid-operator check uses a made-up name. |

## Out of scope for this plan
No keyboard, markup or style changes.
