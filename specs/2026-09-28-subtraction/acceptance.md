# Feature 7: Subtraction — Acceptance

All scenarios are automated: A1 to A7 engine unit tests, A8 formatter unit test, A9 to A12 DOM tests driving keys by accessible name and reading the "Result" status.

## Engine

**A1. Simple subtraction**
Given 12, Subtract, 30, when Equals is applied, then the result is -18 and the display is "-18".

**A2. Mixed chain**
Given 10, Add, 5, Subtract, then the display shows 15 with "subtract" pending; when 20 and Equals follow, the result is -5.

**A3. Negate before operand**
Given the initial state, when Subtract is applied, then the entry is "-0" with no operator pending; when 5 follows the entry is "-5"; when Add, 3, Equals follow the result is -2.

**A4. Sign toggle while typing**
Given an entry of 42, when Toggle sign is applied the entry is "-42"; applied again it is "42"; on the initial state it gives "-0" and again "0".

**A5. Sign toggle on a result**
Given a shown result of 42 with nothing pending, when Toggle sign is applied, then the result is -42 and the display is "-42".

**A6. Sign toggle after an operator**
Given 5, Add, when Toggle sign is applied, then the entry is "-0" and typing is true with "add" still pending; when 3 and Equals follow the result is 2.

**A7. Sign and digit limit; error state**
Given an entry of "-" followed by twelve digits, when another digit is applied the state is unchanged; and given the error state, Toggle sign returns it unchanged.

## Formatter

**A8. Negative entries use the locale minus**
Given the entry "-12.5", when formatted for a locale whose minus is not the ASCII hyphen, then the output starts with that locale's minus-sign part and contains no hyphen; for a comma-grouping locale it is "-12.5"; and "-0" formats as the locale minus followed by "0".

## Keypad and display

**A9. Subtraction on screen**
Given a mounted page, when 1, 2, Subtract, 3, 0, Equals are activated, then the display shows "-18" in a comma-grouping locale.

**A10. Negative entry on screen with locale minus**
Given a page mounted in a locale whose minus is not the ASCII hyphen, when Subtract, 5 are activated, then the display shows that minus followed by "5".

**A11. Toggle sign on screen**
Given a mounted page, when 4, 2, Toggle sign are activated the display shows "-42"; when Toggle sign is activated again it shows "42".

**A12. Remaining keys inert**
Given a display of -18, when Multiply and Divide are activated, then the display still shows "-18" and nothing throws.
