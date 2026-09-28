# Feature 1: Calculator Interface — Plan

Plain HTML, CSS and JavaScript. No framework, no bundler, no transpiler: browsers load the ES modules directly, so the files below are the files served. The only tooling is Node's built-in test runner and one development dependency (a DOM implementation) so the page can be tested without a browser.

## Tooling
| File | Purpose |
|---|---|
| `package.json` | Scripts: `serve` (static file server on localhost) and `test` (Node's built-in test runner). One dev dependency: `jsdom`, used only by the DOM tests. No runtime dependencies. |
| `tools/serve.js` | Zero-dependency static file server for `src/` using Node's built-in HTTP module, so the site can be served locally without installing anything beyond Node. |
| `.gitignore` | Already present; keeps `node_modules/` out of the repository. |
| `README.md` | The three commands from requirement R2. |

## HTML
| File | Purpose |
|---|---|
| `src/index.html` | The whole interface: language attribute, title, viewport meta tag (device width, zoom allowed), stylesheet links, the output element display named "Result" showing "0", the keypad region named "Keypad" with nineteen native buttons in document order, and a module script tag for the entry script. |

## CSS
| File | Purpose |
|---|---|
| `src/css/base.css` | Colour-scheme declaration for light and dark, box-sizing reset, body background and text using system colours. |
| `src/css/calculator.css` | Calculator root as an inline-size container; CSS Grid keypad with gaps for key spacing; display and key styling; visually-hidden utility class for symbol-key names. Logical properties only. |

## JavaScript
| File | Purpose |
|---|---|
| `src/js/main.js` | Entry module loaded by the page. In this feature it only confirms the page has loaded; it attaches no handlers and imports nothing from the engine. |
| `src/js/engine/README.md` | Placeholder marking the DOM-free engine boundary; no logic in this feature. Nothing in this folder may touch the DOM or any browser API. |

## Tests
| File | Purpose |
|---|---|
| `test/interface.test.js` | DOM tests for acceptance scenarios A3 to A10: loads `src/index.html` into jsdom, resolves elements by role and accessible name, checks the display, keypad, key names, glyphs, button types, focus order and lack of behaviour. |
| `test/engine.test.js` | Placeholder unit test proving the runner works with no DOM present. |
| `test/helpers/dom.js` | Loads the HTML file into jsdom and provides small role and accessible-name query helpers shared by later features. |

## Out of scope for this plan
No event handlers, no engine functions, no manifest or service worker files, no build or bundling configuration.
