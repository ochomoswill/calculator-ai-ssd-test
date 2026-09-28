# Feature 2: Calculation Engine Core — Plan

Plain JavaScript ES modules, no framework, no build step; tests run with Node's built-in test runner. This feature touches no HTML or CSS and adds no dependencies.

## Tooling
| File | Purpose |
|---|---|
| `package.json` | Unchanged. The existing test script already runs every file matching `test/*.test.js`. |

## HTML
| File | Purpose |
|---|---|
| none | The page is not changed. `src/index.html` stays as shipped in feature 1. |

## CSS
| File | Purpose |
|---|---|
| none | No styles are added or changed. |

## JavaScript
| File | Purpose |
|---|---|
| `src/js/engine/engine.js` | New. The engine module: the initial-state function, the digit, decimal point, clear-entry and clear-all actions, the digit limit, and the display value derived from the entry. Exports only pure functions and imports nothing. |
| `src/js/engine/README.md` | Changed. Replaces the placeholder text with a description of the module, the state fields and the rule that nothing in the folder may touch a browser API. |
| `src/js/main.js` | Unchanged. The entry module still imports nothing from the engine; wiring is feature 4. |

## Tests
| File | Purpose |
|---|---|
| `test/engine.test.js` | Changed. Keeps the no-DOM check from feature 1 and adds the unit tests for acceptance scenarios A2 to A15, importing the engine module directly. |
| `test/helpers/dom.js` | Unchanged. Not used by engine tests. |

## Out of scope for this plan
No formatting logic, no operator or operand handling, no error values, no DOM access, no changes to the page, styles, server or dependencies.
