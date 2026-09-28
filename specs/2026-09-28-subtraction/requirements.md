# Feature 7: Subtraction — Requirements

Roadmap row 7. Branch `spec/2026-09-28-subtraction`.
Design authority: [Requirement 3 of the web technical design](../tech-design-web.md#requirement-3-subtraction) (subtraction as a pure function; minus-key disambiguation; dedicated sign-toggle key; locale minus sign from the formatter) and [Requirement 2](../tech-design-web.md#requirement-2-addition) (shared representation, formatting and range rules).

## Goal

Deliver subtraction, negative numbers and the sign toggle. The user can subtract with the Subtract key, chain additions and subtractions, start a negative number by pressing Subtract before typing anything, and flip the sign of what is shown with Toggle sign. Negative values carry the locale's minus sign through the formatter, never a hand-inserted hyphen.

## Must do

### Engine
- R1. The operations table gains "subtract", computed with ordinary number subtraction and sharing the pending-operation, chaining, equals and range-check behaviour of addition.
- R2. Pressing Subtract when nothing has been started (no pending operator, no result on show, entry is zero and untouched) negates the entry instead of recording an operation: the entry becomes a negative zero placeholder so the next digits form a negative number.
- R3. Pressing Subtract in every other situation records or chains the "subtract" operation exactly as Add does for "add".
- R4. A new sign-toggle action flips the sign of the entry while typing (a leading minus is added or removed; zero becomes the negative placeholder and back), flips the sign of a finished result on show when no operation is pending, and starts a negative entry when an operation is pending and nothing has been typed yet.
- R5. Digit and decimal entry preserve a leading minus: the negative placeholder followed by a digit gives that negative digit, and the digit limit ignores the sign.
- R6. The sign toggle is ignored in the error state; clear entry and clear all behave as before.

### Formatter
- R7. The entry formatter accepts an optional leading minus and renders it as the locale's minus sign taken from the formatting API's parts output, so a negative entry never shows an ASCII hyphen in locales that use another sign.
- R8. Negative results continue to go through the value formatter, which already applies the locale minus sign.

### Keypad and display
- R9. The wiring maps "Subtract" to the operator action with "subtract" and "Toggle sign" to the sign-toggle action; "Multiply" and "Divide" stay inert.
- R10. The display shows negative entries and results with the locale minus sign in the mounted locale.

### Tests
- R11. Engine tests cover subtraction, mixed chains, negate-before-operand, the sign toggle in each situation and the digit limit with a sign; formatter tests cover negative entries in a locale with a non-ASCII minus; DOM tests drive Subtract and Toggle sign by name and read the display, including one locale whose minus is not the ASCII hyphen.

## Explicitly not included

- No multiplication or division (rows 8 and 9).
- No physical keyboard minus key (row 10).
- No styling changes (row 11).
