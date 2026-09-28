# Feature 5: Addition — Requirements

Roadmap row 5. Branch `spec/2026-09-28-addition`.
Design authority: [Requirement 2 of the web technical design](../tech-design-web.md#requirement-2-addition) (addition as a pure engine function; number representation; display formatting) within the engine boundary of [Requirement 1](../tech-design-web.md#requirement-1-a-calculator-application-for-web-and-mobile).

## Goal

Deliver the first arithmetic operation. The user enters a number, presses Add, enters another and presses Equals to see the sum, or presses Add again to chain. The engine gains a pending-operation state machine that every later operation reuses; the keypad wiring maps the Add and Equals keys; the display shows finished values through the value formatter at full internal precision with display-time rounding.

## Must do

### Engine state
- R1. The state gains two fields: whether the user is typing into the entry since the last operator or equals, and a finished result value that is a number when a result is on show and empty otherwise; existing fields keep their names.
- R2. The pending operator field holds the operation name "add" while an addition is pending; the stored operand field holds the left operand as a full-precision number string.
- R3. The engine's display value is the raw entry while typing and the raw full-precision result string when a result is on show; the engine still never formats.

### Operator action
- R4. A new operator action takes a state and an operation name; the only name accepted in this feature is "add", and any other name throws a range error.
- R5. Pressing Add with no operation pending stores the current value as the operand, records "add" as pending, shows the current value as the result, and resets the entry so the next digit starts a new number.
- R6. Pressing Add while an addition is pending and a new number has been typed computes the pending sum first, shows it, stores it as the operand, and keeps "add" pending, so additions chain.
- R7. Pressing Add while an addition is pending and no new number has been typed keeps the pending operation and changes nothing else.

### Equals action
- R8. A new equals action computes the pending sum of the stored operand and the typed number, shows the result, clears the pending operator and operand, and resets the entry.
- R9. Pressing Equals with no operation pending changes nothing.
- R10. Pressing Equals when an addition is pending but no new number has been typed uses the value on show as the second operand.
- R11. Sums are computed with ordinary number addition and kept at full precision internally; rounding happens only in the value formatter, so 0.1 plus 0.2 shows 0.3 while a following addition uses the unrounded sum.

### Continuing after a result
- R12. Typing a digit or the decimal point while a result is on show starts a new entry and clears the shown result.
- R13. Pressing Add while a result is on show uses that result as the left operand.
- R14. Clear entry while a result is on show resets the entry and clears the shown result, keeping any pending operator and operand; clear all returns to the initial state.

### Keypad and display
- R15. The wiring maps the "Add" key to the operator action with "add" and the "Equals" key to the equals action; "Subtract", "Multiply", "Divide" and "Toggle sign" stay inert.
- R16. The display shows the value formatter's output when a result is on show and the entry formatter's output otherwise, for the mounted locale.

### Tests
- R17. Engine unit tests cover R1 to R14 with no DOM, and DOM tests drive Add and Equals by accessible name and read the display by role and name, including a chained addition and a decimal addition.

## Explicitly not included

- No overflow check; non-finite sums are not reachable from twelve-digit entries by addition alone (row 6).
- No subtraction, multiplication or division; those keys stay inert (rows 7, 8 and 9).
- No sign toggle or negative entry (row 7).
- No physical keyboard shortcuts (row 10).
- No persistence of the pending operation (row 12).
