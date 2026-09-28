# Feature 12: Persistence — Plan

Plain HTML, CSS and JavaScript ES modules, no build step; tests run with Node's built-in test runner with the existing DOM implementation. No tooling or dependency changes.

## Tooling
| File | Purpose |
|---|---|
| `package.json` | Unchanged. |

## HTML
| File | Purpose |
|---|---|
| `src/index.html` | Changed. Adds a "History" region after the keypad with a visually hidden heading, an ordered list and a "Clear history" button. |

## CSS
| File | Purpose |
|---|---|
| `src/css/calculator.css` | Changed. Styles for the history region, list and button using tokens and logical properties. |

## JavaScript
| File | Purpose |
|---|---|
| `src/js/storage.js` | New. Availability check, load with validation, save, and the versioned key; never throws. |
| `src/js/app.js` | Changed. Storage option and default guarded local storage; restore on mount; record history on Equals; render the history list; Clear history handling; save after every render; Enter/Space guard widened to any button. |

## Tests
| File | Purpose |
|---|---|
| `test/persistence.test.js` | New. Storage unit tests and DOM tests for acceptance scenarios A1 to A10. |
| `test/helpers/dom.js` | Changed. The mount helper accepts an options object (locale, state, storage) and exposes the history region. |
| `test/interface.test.js` | Changed. Scenarios A5, A6 and A9 scope their button counts and focus order to the keypad now that a button exists outside it. |
| `test/app.test.js` | Changed. Listener count now includes the history button's click listener, and the import list for the wiring module now includes the storage module. |

## Out of scope for this plan
No offline caching, no sync, no re-running history entries.
