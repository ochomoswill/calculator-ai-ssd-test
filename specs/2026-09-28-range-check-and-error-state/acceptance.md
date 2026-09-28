# Feature 6: Range Check and Error State — Acceptance

All scenarios are automated: A1 to A5 are engine unit tests with no DOM; A6 to A9 are DOM tests driving keys by accessible name and reading the "Result" status.

## Engine

**A1. Overflow enters the error state**
Given a pending addition whose operand and entry are both the largest representable number, when Equals is applied, then the error is "overflow", the result is empty, operator and operand are empty, entry is 0, typing is false and the display is "overflow".

**A2. Chained operator shares the check**
Given the same state, when Add is applied with no new number typed, then the pending addition is kept and no error occurs (requirement R7 of feature 5); the chained-operator overflow path goes through the same result routine as Equals and becomes reachable with multiplication, where row 8 tests it.

**A3. Entry, operator and equals are ignored in error**
Given the error state, when a digit, the decimal point, Add or Equals is applied, then the state is returned unchanged.

**A4. Clears recover**
Given the error state, when clear entry or clear all is applied, then the result equals the initial state.

**A5. Kinds table**
Given the engine module, then it exports a frozen error-kinds table containing "overflow".

## Keypad and display

**A6. Overflow message on screen**
Given a page mounted with a pending addition of two largest-representable numbers, when Equals is activated, then the display shows "Number too large" and carries the error marker.

**A7. Keys ignored on screen**
Given the display shows "Number too large", when 5, Decimal point, Add and Equals are activated, then the display still shows "Number too large".

**A8. Clear recovers on screen**
Given the display shows "Number too large", when Clear entry is activated, then the display shows "0" and the marker is gone; and the same for Clear all.

**A9. Starting state option**
Given a page mounted with a starting state whose entry is 42, then the display shows "42" before any key is activated; and given no starting state, it shows "0".
