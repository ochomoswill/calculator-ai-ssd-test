# Feature 8: Multiplication — Plan

Plain JavaScript ES modules, no framework, no build step; tests run with Node's built-in test runner. No HTML, CSS, formatter, tooling or dependency changes.

## Tooling
| File | Purpose |
|---|---|
| `package.json` | Unchanged. |

## HTML
| File | Purpose |
|---|---|
| `src/index.html` | Unchanged. The Multiply key already exists with its glyph and accessible name. |

## CSS
| File | Purpose |
|---|---|
| none | Unchanged. |

## JavaScript
| File | Purpose |
|---|---|
| `src/js/engine/engine.js` | Changed. Adds "multiply" to the operations table. |
| `src/js/engine/README.md` | Changed. Lists the operation. |
| `src/js/app.js` | Changed. Maps the "multiply" key. |

## Tests
| File | Purpose |
|---|---|
| `test/multiplication.test.js` | New. Engine and DOM tests for acceptance scenarios A1 to A8. |
| `test/app.test.js`, `test/addition.test.js`, `test/subtraction.test.js` | Changed. Inert-key lists drop "Multiply"; the invalid-operator check in the addition tests uses "divide". |

## Out of scope for this plan
No division, precedence, keyboard, markup or style changes.
