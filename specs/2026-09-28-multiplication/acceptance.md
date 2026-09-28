# Feature 8: Multiplication — Acceptance

All scenarios are automated: A1 to A5 engine unit tests; A6 to A8 DOM tests driving keys by accessible name and reading the "Result" status.

## Engine

**A1. Simple product**
Given 12, Multiply, 3, when Equals is applied, then the result is 36.

**A2. Decimal product with display rounding**
Given 1.1, Multiply, 1.1, when Equals is applied, then the result is the language's own product (not exactly 1.21) and the value formatter shows "1.21".

**A3. Left-to-right chain**
Given 2, Add, 3, Multiply, 4, when Equals is applied, then the result is 20, not 14.

**A4. Overflow via Equals**
Given a shown result of the largest representable number with "multiply" pending, when 9 and Equals are applied, then the error is "overflow".

**A5. Overflow via chained operator**
Given a shown result of the largest representable number with "multiply" pending, when 9 is typed and Add is applied, then the error is "overflow" (the chained-operator path deferred from feature 6).

## Keypad and display

**A6. Product on screen**
Given a mounted page, when 1, 2, Multiply, 3, Equals are activated, then the display shows "36".

**A7. Overflow on screen**
Given a page mounted with the largest representable number on show and "multiply" pending, when 9 and Equals are activated, then the display shows "Number too large".

**A8. Divide inert**
Given a display of 36, when Divide is activated, then the display still shows "36" and nothing throws.
