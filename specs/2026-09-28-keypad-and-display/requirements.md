# Feature 4: Keypad and Display — Requirements

Roadmap row 4. Branch `spec/2026-09-28-keypad-and-display`.
Design authority: [Requirement 1 of the web technical design](../tech-design-web.md#requirement-1-a-calculator-application-for-web-and-mobile) (presentation layer forwards input to the engine; output element display; native buttons) and [Requirement 2](../tech-design-web.md#requirement-2-addition) (display formatting of entries).

## Goal

Connect the three pieces built so far. When the user activates a digit, decimal point or clear key on the keypad from feature 1, the engine from feature 2 updates the entry and the formatter from feature 3 renders it into the result display. This is the first release where the calculator visibly responds. Operator keys remain inert until their rows arrive.

## Must do

### Wiring module
- R1. A new presentation-side JavaScript ES module exports a single mount function that takes the calculator's root element and an optional locale, wires the keypad and display inside that root, and returns nothing the page needs to keep.
- R2. The mount function holds the engine state in a closure, starting from the engine's initial state, and replaces it with the state each engine action returns; it never mutates state.
- R3. The mount function attaches exactly one click listener, on the keypad region, and identifies the activated key from the key identifier attribute the markup already carries; it attaches no keyboard listeners, so keyboard activation with Enter and Space comes from the native buttons.
- R4. The page's entry module imports the wiring module and mounts it on the calculator root when the page loads, passing no locale so the runtime default applies.
- R5. The wiring module imports only the engine module and the formatter module, and touches the DOM only through the root element it is given.

### Keys wired
- R6. Activating a digit key "0" to "9" applies the engine's digit action with that digit.
- R7. Activating "Decimal point" applies the engine's decimal action.
- R8. Activating "Clear entry" applies the engine's clear-entry action.
- R9. Activating "Clear all" applies the engine's clear-all action.
- R10. Activating "Add", "Subtract", "Multiply", "Divide", "Equals" or "Toggle sign" leaves the state and display unchanged and throws nothing.

### Display
- R11. After mounting and after every key activation, the "Result" display shows the engine's entry passed through the formatter's entry function for the mounted locale.
- R12. The display shows "0" immediately after mounting.
- R13. The display's content stays plain text with no nested elements after updates.
- R14. Every engine rule is visible on screen: a first digit replaces the zero, digits append, one decimal point is accepted, the twelve-digit limit holds, clear entry resets to zero, clear all resets to zero.

### Tests
- R15. DOM tests load the real page into the DOM implementation, import the wiring module directly and mount it with an explicit locale, because the DOM implementation does not execute the page's module script; they drive keys by role and accessible name and read the display by role and name.
- R16. Tests cover at least one locale that groups with a comma and one that marks decimals with a comma, so the on-screen text proves the formatter is applied.
- R17. The engine module, the formatter module, the page markup and the styles are not changed by this feature, and all existing tests keep passing.

## Explicitly not included

- No arithmetic; operator and equals keys do nothing (rows 5, 7, 8 and 9).
- No error or overflow display (row 6).
- No sign toggle behaviour (row 7).
- No physical keyboard shortcuts such as typing digits without focusing a key (row 10).
- No layout, theme or motion changes (row 11).
- No persistence of the entry across reloads (row 12).
- No locale selector; the runtime default is used in production (not on the roadmap).
