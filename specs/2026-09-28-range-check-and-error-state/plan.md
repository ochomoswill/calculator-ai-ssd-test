# Feature 6: Range Check and Error State — Plan

Plain JavaScript ES modules, no framework, no build step; tests run with Node's built-in test runner. No HTML, CSS, tooling or dependency changes.

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
| none | No styles are added or changed; the marker attribute is added for later styling. |

## JavaScript
| File | Purpose |
|---|---|
| `src/js/engine/engine.js` | Changed. Exports the error-kinds table; the shared result path checks finiteness and returns the error state on failure; entry, operator and equals actions return unchanged while in error; both clear actions return the initial state from error. |
| `src/js/engine/README.md` | Changed. Documents the error state and kinds table. |
| `src/js/app.js` | Changed. Mount accepts a starting state option; a message table maps error kinds to text; render shows the message and toggles the marker attribute on the display when the state has an error. |

## Tests
| File | Purpose |
|---|---|
| `test/range-check.test.js` | New. Engine and DOM tests for acceptance scenarios A1 to A9. |
| `test/helpers/dom.js` | Changed. The mount helper accepts an optional starting state and passes it through. |

## Out of scope for this plan
No division by zero, no styling, no other operations, no markup changes.
