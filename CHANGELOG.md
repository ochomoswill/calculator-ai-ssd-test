# Changelog

2026-09-28 — calculator-interface
Static calculator interface in plain HTML, CSS and JavaScript: an output-element result display and a nineteen-key keypad of native buttons with accessible names, light/dark colour scheme, container context, a zero-dependency local server, and Node-runner DOM tests covering the acceptance scenarios.

2026-09-28 — calculation-engine-core
Added the pure, browser-free calculation engine that tracks the number being typed (digit entry with a twelve-digit limit, single decimal point, clear entry and clear all) with reserved operator, operand and error fields, nothing yet visible on screen, plus unit tests that also guard the module against browser APIs.
