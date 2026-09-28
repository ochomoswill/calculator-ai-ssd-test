# Feature 7: Subtraction — Plan

Plain JavaScript ES modules, no framework, no build step; tests run with Node's built-in test runner. No HTML, CSS, tooling or dependency changes.

## Tooling
| File | Purpose |
|---|---|
| `package.json` | Unchanged. |

## HTML
| File | Purpose |
|---|---|
| `src/index.html` | Unchanged. Subtract and Toggle sign keys already exist. |

## CSS
| File | Purpose |
|---|---|
| none | Unchanged. |

## JavaScript
| File | Purpose |
|---|---|
| `src/js/engine/engine.js` | Changed. Adds "subtract" to the operations table; the operator action negates instead when nothing has been started; new sign-toggle action; digit, decimal and digit-count logic handle a leading minus. |
| `src/js/engine/README.md` | Changed. Documents the sign toggle, the negate rule and the negative placeholder. |
| `src/js/format.js` | Changed. Entry pattern allows a leading minus; the entry formatter emits the locale minus sign for it. |
| `src/js/app.js` | Changed. Maps "subtract" and "toggle-sign" keys. |

## Tests
| File | Purpose |
|---|---|
| `test/subtraction.test.js` | New. Engine, formatter and DOM tests for acceptance scenarios A1 to A12. |
| `test/app.test.js` | Changed. Inert-key list drops "Subtract" and "Toggle sign". |
| `test/addition.test.js` | Changed. Scenario A14's inert-key list drops "Subtract" and "Toggle sign"; scenario A2 accepts "subtract". |
| `test/format.test.js` | Changed. The invalid-entry list no longer treats "-1" as invalid. |

## Out of scope for this plan
No multiplication, division, keyboard handling, markup or style changes.
