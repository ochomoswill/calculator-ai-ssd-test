# Feature 3: Number Formatting — Acceptance

Feature is done when every scenario below passes. All scenarios are automated unit tests under Node's built-in test runner, except A1 which is checked by inspection of the module's imports and by the tests running in Node's default environment.

## Module boundary

**A1. No DOM or engine dependency**
Given the formatter module, when it is imported in a plain Node process, then the import succeeds and the module source references neither browser globals nor the engine module.

**A2. Pure and locale-optional**
Given the same value and the same explicit locale, when formatted twice, then the results are equal; and when no locale is given, formatting succeeds and returns a non-empty string.

## Formatting a value

**A3. Grouping per locale**
Given the value 1234567.5, when formatted for a comma-grouping locale, then the integer digits are separated into groups by that locale's group token; and when formatted for a point-grouping locale, they are separated by that locale's group token instead.

**A4. Decimal mark per locale**
Given the value 2.5, when formatted for a locale that marks decimals with a comma, then the output uses that comma, and for a locale that marks with a point, the output uses the point.

**A5. Floating-point artefacts hidden**
Given the value produced by adding 0.1 and 0.2, when formatted, then the output reads as three tenths with no trailing digits.

**A6. Twelve significant digits**
Given one third, when formatted, then the output has exactly twelve significant digits; and given 123456789012345, the output shows at most twelve significant digits.

**A7. No trailing zeros**
Given 2.50 and 3.0, when formatted, then the outputs are the locale forms of 2.5 and 3.

**A8. Locale minus sign**
Given the value negative 42, when formatted for each test locale, then the output starts with the minus-sign part the formatting API reports for that locale, and for the locale whose minus is not the ASCII hyphen the first character is not the ASCII hyphen.

**A9. Negative zero**
Given negative zero, when formatted, then the output is "0" with no sign.

**A10. Non-finite rejected**
Given positive infinity, negative infinity and not-a-number, when formatted, then a range error is thrown for each.

## Formatting an entry

**A11. Entry grouping**
Given the entry string "1234567", when formatted for each test locale, then the integer digits are grouped with that locale's group token.

**A12. Entry decimal mark**
Given the entry string "12.5", when formatted for a comma-decimal locale, then the output uses the comma as its mark; for a point-decimal locale, the point.

**A13. Trailing point and zeros preserved**
Given the entry strings "12." and "0.10", when formatted, then the first ends with the locale decimal mark and the second keeps its final zero.

**A14. Zero entries**
Given the entry strings "0" and "0.", when formatted, then the outputs are "0" and zero followed by the locale decimal mark.

**A15. Tokens not hard-coded**
Given any test locale, when an entry is formatted, then the group and decimal characters in the output equal the group and decimal parts the formatting API reports for that locale.

## Tests

**A16. Runner, environment and locales**
Given the test command, when it runs, then the formatter tests execute in Node's default environment with no DOM, every scenario passes, and each scenario passes explicit locales rather than relying on the runtime default.
