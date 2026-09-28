# Feature 3: Number Formatting — Plan

Plain JavaScript ES modules, no framework, no build step; tests run with Node's built-in test runner. The feature adds one presentation-side module and its tests, touches no HTML or CSS, and adds no dependencies. Node ships with full locale data, so the tests need nothing installed beyond what feature 1 set up.

## Tooling
| File | Purpose |
|---|---|
| `package.json` | Unchanged. The test script already runs every `test/*.test.js` file. |

## HTML
| File | Purpose |
|---|---|
| none | `src/index.html` is not changed. |

## CSS
| File | Purpose |
|---|---|
| none | No styles are added or changed. |

## JavaScript
| File | Purpose |
|---|---|
| `src/js/format.js` | New. The formatter module: a value formatter configured with the 12 significant-digit cap, grouping and negative-only sign display; an entry formatter that reads the locale's group and decimal tokens from the formatting API's parts output and applies them to the raw entry string while preserving a trailing point and trailing zeros; a finite-number guard that throws a range error. Imports nothing. |
| `src/js/engine/engine.js` | Unchanged. The engine keeps its raw display value; the formatter is applied on the presentation side. |
| `src/js/main.js` | Unchanged. Wiring the display to engine and formatter is feature 4. |

## Tests
| File | Purpose |
|---|---|
| `test/format.test.js` | New. Unit tests for acceptance scenarios A1 to A15 against explicit locales: one with comma grouping and point decimal, one with point grouping and comma decimal, and one whose minus sign is not the ASCII hyphen. |
| `test/engine.test.js` | Unchanged. |

## Out of scope for this plan
No DOM access, no changes to the page, engine, styles, server or dependencies, no locale selection, no negative entry handling, no error text.
