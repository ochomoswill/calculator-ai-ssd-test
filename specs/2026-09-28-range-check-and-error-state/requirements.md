# Feature 6: Range Check and Error State — Requirements

Roadmap row 6. Branch `spec/2026-09-28-range-check-and-error-state`.
Design authority: [Requirement 2 of the web technical design](../tech-design-web.md#requirement-2-addition) (range: non-finite results become a typed "overflow" error and the display shows an error state until the user clears) and [Requirement 5](../tech-design-web.md#requirement-5-division) (error handling pattern: message shown, announced, further operator keys ignored until clear).

## Goal

Make results that cannot be represented safe. After every operation the engine checks the result is a finite number; if not, it enters a typed error state instead of carrying infinity or not-a-number forward. The display shows a plain-language message, the live region announces it, and only the clear keys work until the user clears. Division by zero (row 9) will reuse this mechanism with its own kind.

## Must do

### Engine error state
- R1. After computing any operation, the engine checks the result with the standard finite-number test; a non-finite result puts the engine into the error state with kind "overflow" instead of storing the value.
- R2. In the error state the error field holds the kind, the result is empty, the operator and operand are empty, the entry is zero, typing is false, and the engine's raw display value is the error kind string.
- R3. While in the error state, the digit, decimal, operator and equals actions return the state unchanged.
- R4. While in the error state, clear entry and clear all both return the initial state.
- R5. Error kinds are exported as a frozen table so the presentation layer and later features refer to them by name, not by string literals; the table holds "overflow" now.

### Mount options
- R6. The mount function accepts an optional starting state so the page can begin from a given engine state; when omitted it starts from the initial state. This is what allows tests to reach overflow through the keypad and what persistence (row 12) will use to restore.

### Display
- R7. When the engine is in the error state, the display shows the message for that kind from a presentation-side message table; the message for "overflow" is "Number too large".
- R8. The display element carries an error marker attribute while an error is shown and not otherwise, so styling can target it later without any style change in this feature.
- R9. After clear entry or clear all from the error state, the display shows 0 and the marker is removed.

### Tests
- R10. Engine unit tests reach overflow by constructing a pending addition whose operands are near the largest representable number, and DOM tests reach it by mounting with such a state and pressing Equals, then drive keys by accessible name and read the display by role and name.

## Explicitly not included

- No division-by-zero error kind or message (row 9).
- No visual styling of the error state beyond the marker attribute (row 11).
- No other operations (rows 7, 8 and 9).
- No persistence of error state (row 12).
