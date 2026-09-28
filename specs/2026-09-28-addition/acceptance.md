# Feature 5: Addition — Acceptance

All scenarios are automated: A1 to A10 are engine unit tests with no DOM, A11 to A14 are DOM tests driving keys by accessible name and reading the "Result" status.

## Engine

**A1. New fields**
Given the initial state, then it has a typing flag that is true, an empty result, and the existing entry, display, operator, operand and error fields.

**A2. Operator accepts only add**
Given any state, when the operator action is called with "subtract" or "x", then a range error is thrown; with "add" it succeeds.

**A3. Add stores the operand**
Given an entry of 12, when Add is applied, then the operand is "12", the operator is "add", the display shows 12, the entry is 0 and typing is false.

**A4. Simple sum**
Given 12, Add, 30, when Equals is applied, then the result is 42, display is "42", operator and operand are empty and typing is false.

**A5. Chained additions**
Given 1, Add, 2, Add, then the display shows 3 with "add" still pending; when 4 and Equals follow, the result is 7.

**A6. Repeated Add without typing**
Given 5, Add, Add, then the state equals the state after a single Add.

**A7. Equals without pending operation**
Given an entry of 7, when Equals is applied, then the state is unchanged.

**A8. Equals without a second number**
Given 5, Add, Equals, then the result is 10.

**A9. Full precision internally, rounding on display**
Given 0.1, Add, 0.2, Equals, then the result field equals the language's own sum of 0.1 and 0.2 (not 0.3), and the engine display string is that raw value; when the value formatter formats it, the text is "0.3".

**A10. Continuing after a result**
Given a shown result of 42, when 7 is typed the entry is "7" and the result is empty; when Add is pressed instead the operand is "42"; when Clear entry is pressed the entry is 0 and the result is empty while the operator is kept; when Clear all is pressed the state is initial.

## Keypad and display

**A11. Add and Equals on screen**
Given a mounted page, when 1, 2, Add, 3, 0, Equals are activated, then the display shows "42".

**A12. Chained on screen**
Given a mounted page, when 1, Add, 2, Add are activated, the display shows "3"; when 4, Equals follow, it shows "7".

**A13. Decimal sum on screen**
Given a mounted page in a comma-grouping locale, when Decimal point, 1, Add, Decimal point, 2, Equals are activated, then the display shows "0.3"; and in a comma-decimal locale it shows "0,3".

**A14. Remaining keys inert**
Given a display of 42 after a sum, when Subtract, Multiply, Divide and Toggle sign are activated, then the display still shows "42" and nothing throws.
