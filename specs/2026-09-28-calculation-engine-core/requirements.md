# Feature 2: Calculation Engine Core — Requirements

Roadmap row 2. Branch `spec/2026-09-28-calculation-engine-core`.
Design authority: [Requirement 1 of the web technical design](../tech-design-web.md#requirement-1-a-calculator-application-for-web-and-mobile) (calculation engine and entry state machine) and [Requirement 2](../tech-design-web.md#requirement-2-addition) (number representation).

## Goal

Deliver the pure, DOM-free calculation engine that will hold what the user types: the entry state machine for digits, the decimal point, clear entry and clear all. Nothing is visible to the user yet. Feature 1 built the interface; this feature builds the logic behind it, and feature 4 will connect the two. Every later operation is added to this engine without changing its interface.

## Must do

### Module boundary
- R1. The engine is a single JavaScript ES module under the engine folder that imports nothing from the browser: no `document`, `window`, `navigator`, storage or timers.
- R2. The engine exposes pure functions only: every action takes a state object and returns a new state object, never mutating its input.
- R3. The engine exposes a function that returns the initial state, and the initial state is a frozen object.

### State shape
- R4. The state holds the current entry as a string of the characters typed so far, a pending operator (empty in this feature), a stored operand (empty in this feature) and an error (empty in this feature), so later features extend the shape without renaming fields.
- R5. The state exposes a display value: the text the interface will show. In this feature it is the raw entry string; feature 3 will format it.
- R6. The initial state's entry and display are the single digit zero.

### Digit entry
- R7. Entering a digit while the entry is exactly zero replaces the zero with that digit.
- R8. Entering a digit otherwise appends it to the entry.
- R9. The entry holds at most 12 digits, not counting a leading zero before the decimal point or the decimal point itself, matching the 12 significant-digit display cap chosen in Requirement 2 of the design; further digits are ignored and the state is returned unchanged.
- R10. A digit action with any value other than a single character from zero to nine throws a range error, because it is a programming mistake in the caller, not user input.

### Decimal point
- R11. Entering the decimal point when the entry contains none appends it.
- R12. Entering the decimal point when the entry already contains one leaves the state unchanged.
- R13. Entering the decimal point on the initial entry produces zero followed by the decimal point, and a following digit appends after it.

### Clearing
- R14. Clear entry resets the entry and display to zero and leaves every other field as it was.
- R15. Clear all returns the initial state from any state.

### Tests
- R16. The engine's unit tests run under Node's built-in test runner with no DOM present, and cover every requirement above.

## Explicitly not included

- No number formatting, locale separators or rounding for display (row 3).
- No connection between the engine and the keypad or output element; keys still do nothing (row 4).
- No arithmetic: the pending operator and stored operand fields exist but no action sets them (rows 5, 7, 8 and 9).
- No range check or error state; the error field exists but no action sets it (row 6).
- No sign toggle or negative entry (row 7).
- No physical keyboard mapping (row 10).
- No persistence of state (row 12).
- No packaging of the engine for mobile (row 15).
