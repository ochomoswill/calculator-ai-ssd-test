# Changelog

2026-09-28 — calculator-interface
Static calculator interface in plain HTML, CSS and JavaScript: an output-element result display and a nineteen-key keypad of native buttons with accessible names, light/dark colour scheme, container context, a zero-dependency local server, and Node-runner DOM tests covering the acceptance scenarios.

2026-09-28 — calculation-engine-core
Added the pure, browser-free calculation engine that tracks the number being typed (digit entry with a twelve-digit limit, single decimal point, clear entry and clear all) with reserved operator, operand and error fields, nothing yet visible on screen, plus unit tests that also guard the module against browser APIs.

2026-09-28 — number-formatting
Added the display formatter that shows numbers with the user's locale grouping, decimal mark and minus sign, rounds results to twelve significant digits so floating-point noise never appears, and keeps in-progress entries exactly as typed, still not connected to the screen, plus unit tests across three locales.

2026-09-28 — keypad-and-display
Connected the keypad to the calculator: digit, decimal point, clear entry and clear all keys now update the result display with the locale-formatted entry, operator keys stay inert, plus a mountable wiring module and DOM tests in two locales.

2026-09-28 — addition
Added addition: the Add and Equals keys compute sums and chained running totals shown at twelve significant digits with full precision kept internally, built on a new pending-operation state machine in the engine, with engine and DOM tests.

2026-09-28 — range-check-and-error-state
Added the range check: any result that is not a finite number now shows "Number too large", ignores every key except the clear keys, and clears back to zero, with a typed error state in the engine, a starting-state option on mount, and engine and DOM tests.

2026-09-28 — subtraction
Added subtraction, negative numbers and the Toggle sign key: Subtract chains with Add, pressing it first starts a negative number, and negative entries and results show the locale's minus sign, with engine, formatter and DOM tests.

2026-09-28 — multiplication
Added multiplication: the Multiply key joins the left-to-right operation chain, products are rounded to twelve significant digits on screen, and overflow through Equals or a chained operator shows "Number too large", with engine and DOM tests.

2026-09-28 — division
Added division, completing the four operations: the Divide key joins the chain, non-terminating quotients are shown rounded to twelve significant digits, and dividing by zero shows "Cannot divide by zero" until cleared, with engine and DOM tests.

2026-09-28 — physical-keyboard-input
Added physical keyboard input: digits, point or comma, + - * x /, Enter or =, Escape, Backspace and Delete drive the calculator from the main row or numeric keypad, with modifier shortcuts left to the browser, a new delete-last engine action, and DOM tests.
