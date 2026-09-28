# Feature 9: Division — Requirements

Roadmap row 9. Branch `spec/2026-09-28-division`.
Design authority: [Requirement 5 of the web technical design](../tech-design-web.md#requirement-5-division) (division as a pure function; typed "divide by zero" error checked before the operator runs; clear message announced; further keys ignored until clear; non-terminating results rounded for display) and [Requirement 2](../tech-design-web.md#requirement-2-addition) (shared rules).

## Goal

Deliver the last operation. The Divide key joins the operation chain; dividing by zero enters a typed error state with its own message instead of producing infinity or not-a-number; non-terminating quotients are shown rounded to twelve significant digits with the full value kept for chaining.

## Must do

### Engine
- R1. The operations table gains "divide", computed with ordinary number division and sharing pending, chaining, equals, sign and range behaviour with the other operations.
- R2. Before a division runs, the engine checks the divisor; if it is zero (including negative zero and zero divided by zero) the engine enters the error state with kind "divide-by-zero", never calling the operator, so infinity and not-a-number values never exist in state.
- R3. The error-kinds table gains "divide-by-zero"; the error state behaves exactly as for overflow: only the clear keys work and both return the initial state.
- R4. The divisor check applies on both the Equals path and the chained-operator path.

### Keypad and display
- R5. The wiring maps "Divide" to the operator action with "divide"; every operation key is now live.
- R6. The message table gains "Cannot divide by zero" for the new kind; the display shows it with the error marker and the live region announces it.
- R7. Non-terminating quotients such as one divided by three are shown rounded to twelve significant digits.

### Tests
- R8. Engine tests cover a simple quotient, a non-terminating quotient with display rounding, a chained division, divide by zero via Equals and via a chained operator, zero divided by zero, and recovery; DOM tests drive Divide by name and read the display including the message.

## Explicitly not included

- No keyboard shortcuts (row 10).
- No styling of error messages (row 11).
