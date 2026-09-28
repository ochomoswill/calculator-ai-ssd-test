# Feature 4: Keypad and Display — Plan

Plain JavaScript ES modules, no framework, no build step; tests run with Node's built-in test runner with the existing DOM implementation. The feature adds one wiring module, changes the page's entry module, extends the test helper and adds one test file. No HTML, CSS, engine, formatter, tooling or dependency changes.

## Tooling
| File | Purpose |
|---|---|
| `package.json` | Unchanged. The test script already runs every `test/*.test.js` file. |

## HTML
| File | Purpose |
|---|---|
| `src/index.html` | Unchanged. The keypad buttons already carry the key identifier attribute the wiring reads, and the display is already the output element named "Result". |

## CSS
| File | Purpose |
|---|---|
| none | No styles are added or changed. |

## JavaScript
| File | Purpose |
|---|---|
| `src/js/app.js` | New. Exports the mount function: finds the keypad region and the result display inside the given root, keeps the engine state in a closure, delegates one click listener on the keypad that maps the key identifier to an engine action (digits, decimal point, clear entry, clear all; all other keys ignored), and renders the entry through the formatter into the display after mounting and after every action. Imports only the engine and formatter modules. |
| `src/js/main.js` | Changed. Replaces the load marker with an import of the wiring module and a call to mount on the calculator root, with no locale so the runtime default applies. |
| `src/js/engine/engine.js` | Unchanged. |
| `src/js/format.js` | Unchanged. |

## Tests
| File | Purpose |
|---|---|
| `test/helpers/dom.js` | Changed. Adds a helper that loads the page, imports the wiring module, mounts it on the page's calculator root with a given locale, and returns the document plus a click helper that activates a key by accessible name. Existing helpers are unchanged. |
| `test/app.test.js` | New. DOM tests for acceptance scenarios A1 to A14 in two explicit locales, driving keys by role and name and reading the "Result" display by role and name. |
| `test/interface.test.js` | Unchanged. It loads the page without mounting, so its check that an unmounted page has no behaviour still holds. |
| `test/engine.test.js`, `test/format.test.js` | Unchanged. |

## Out of scope for this plan
No operator handling, no error text, no keyboard shortcuts, no changes to markup, styles, engine, formatter, server or dependencies.
