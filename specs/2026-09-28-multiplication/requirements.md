# Feature 8: Multiplication — Requirements

Roadmap row 8. Branch `spec/2026-09-28-multiplication`.
Design authority: [Requirement 4 of the web technical design](../tech-design-web.md#requirement-4-multiplication) (multiplication as a pure function; overflow is the primary failure path; glyph with accessible name "multiply") and [Requirement 2](../tech-design-web.md#requirement-2-addition) (shared representation, formatting and range rules).

## Goal

Deliver multiplication. The Multiply key records or chains the operation exactly as Add and Subtract do, results share the twelve-digit display rounding, and products that overflow enter the error state from feature 6. Operations in a chain apply left to right in the order pressed, as on a pocket calculator; there is no operator precedence.

## Must do

### Engine
- R1. The operations table gains "multiply", computed with ordinary number multiplication and sharing pending, chaining, equals, sign and range behaviour with the other operations.
- R2. A chain mixing multiply with add or subtract applies each operation in the order pressed, left to right, with no precedence.
- R3. A product that is not finite enters the "overflow" error state, both when reached through Equals and when reached through pressing another operator after typing (the chained-operator path deferred from feature 6).

### Keypad and display
- R4. The wiring maps "Multiply" to the operator action with "multiply"; "Divide" stays inert.
- R5. The display shows products through the value formatter, so a product with more than twelve significant digits is shown rounded and its full value is kept for chaining.

### Tests
- R6. Engine tests cover a simple product, a decimal product, a mixed left-to-right chain, overflow via Equals and overflow via a chained operator; DOM tests drive Multiply by name and read the display, including the overflow message.

## Explicitly not included

- No division (row 9).
- No operator precedence (not on the roadmap; pocket-calculator order is the design).
- No keyboard shortcuts (row 10).
