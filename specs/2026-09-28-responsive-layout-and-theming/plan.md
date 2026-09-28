# Feature 11: Responsive Layout and Theming — Plan

Plain CSS with no preprocessor; tests run with Node's built-in test runner and inspect the stylesheets as text. No JavaScript, HTML, tooling or dependency changes.

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
| `src/css/base.css` | Changed. Adds the colour token set on the root, a dark-scheme media block redefining the tokens, and a reduced-motion media block that disables transitions and transforms globally. Body uses the tokens. |
| `src/css/calculator.css` | Changed. Rewrites the display and key rules to use tokens; adds the error-state rule, operator accent rule, focus-visible rule, pressed-key transition, and container queries for narrow and wide containers. Keeps the grid, the zero-key span and the visually-hidden utility. Logical properties only. |

## JavaScript
| File | Purpose |
|---|---|
| none | Unchanged. |

## Tests
| File | Purpose |
|---|---|
| `test/theming.test.js` | New. Stylesheet inspection tests for acceptance scenarios A1 to A8. |
| `test/interface.test.js` | Unchanged. Its scenario A12 keeps passing (container, colour scheme, gap). |

## Out of scope for this plan
No behaviour, markup or tooling changes.
