# Feature 5: Addition — Plan

Plain JavaScript ES modules, no framework, no build step; tests run with Node's built-in test runner. No HTML, CSS, tooling or dependency changes.

## Tooling
| File | Purpose |
|---|---|
| `package.json` | Unchanged. |

## HTML
| File | Purpose |
|---|---|
| `src/index.html` | Unchanged. The Add and Equals keys already exist with their identifiers. |

## CSS
| File | Purpose |
|---|---|
| none | No styles are added or changed. |

## JavaScript
| File | Purpose |
|---|---|
| `src/js/engine/engine.js` | Changed. Adds the typing flag and result field to the state; adds the operator action (accepting "add") and the equals action; a table of operations holding addition; digit, decimal and clear-entry actions learn to start a new entry when a result is on show; display value follows R3. |
| `src/js/engine/README.md` | Changed. Documents the new fields and actions. |
| `src/js/app.js` | Changed. Maps the "add" key to the operator action and the "equals" key to the equals action; render chooses the value formatter when a result is on show. |
| `src/js/format.js` | Unchanged. |
| `src/js/main.js` | Unchanged. |

## Tests
| File | Purpose |
|---|---|
| `test/addition.test.js` | New. Engine unit tests and DOM tests for acceptance scenarios A1 to A14. |
| `test/app.test.js` | Changed. Scenario A13 (operator keys inert) drops "Add" and "Equals" from its inert list. |
| `test/engine.test.js` | Changed. Scenario A4 (initial state fields) includes the two new fields. |
| `test/helpers/dom.js` | Unchanged. |

## Out of scope for this plan
No range checking, no other operations, no keyboard handling, no markup or style changes.
