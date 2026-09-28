# Feature 9: Division — Acceptance

All scenarios are automated: A1 to A7 engine unit tests; A8 to A10 DOM tests driving keys by accessible name and reading the "Result" status.

## Engine

**A1. Simple quotient**
Given 12, Divide, 3, when Equals is applied, then the result is 4.

**A2. Non-terminating quotient rounded on display**
Given 1, Divide, 3, when Equals is applied, then the result is the language's own quotient and the value formatter shows "0." followed by twelve threes.

**A3. Chained division**
Given 100, Divide, 4, Divide, then the display shows 25; when 5 and Equals follow the result is 5.

**A4. Divide by zero via Equals**
Given 5, Divide, 0, when Equals is applied, then the error is "divide-by-zero", the result is empty and the display is "divide-by-zero".

**A5. Divide by zero via chained operator**
Given 5, Divide, 0, when Add is applied, then the error is "divide-by-zero".

**A6. Zero divided by zero**
Given 0, Divide, 0, when Equals is applied, then the error is "divide-by-zero", not a not-a-number result.

**A7. Recovery and kinds table**
Given the divide-by-zero error state, digits, operators and Equals leave it unchanged, clear entry and clear all return the initial state, and the error-kinds table contains "divide-by-zero".

## Keypad and display

**A8. Quotient on screen**
Given a mounted page, when 1, 2, Divide, 3, Equals are activated, then the display shows "4"; and when 1, Divide, 3, Equals are activated on a fresh page it shows "0.333333333333".

**A9. Divide by zero on screen**
Given a mounted page, when 5, Divide, 0, Equals are activated, then the display shows "Cannot divide by zero" with the error marker; when 7 is activated it is unchanged; when Clear all is activated it shows "0" without the marker.

**A10. All operation keys live**
Given a mounted page, when 8, Add, 2, Subtract, 1, Multiply, 3, Divide, 9, Equals are activated, then the display shows "3".
