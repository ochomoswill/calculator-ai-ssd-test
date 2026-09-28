# Feature 3: Number Formatting — Requirements

Roadmap row 3. Branch `spec/2026-09-28-number-formatting`.
Design authority: [Requirement 2 of the web technical design](../tech-design-web.md#requirement-2-addition) (display formatting, number representation) and [Requirement 3](../tech-design-web.md#requirement-3-subtraction) (locale minus sign). The engine boundary in [Requirement 1](../tech-design-web.md#requirement-1-a-calculator-application-for-web-and-mobile) still applies: the engine never formats numbers.

## Goal

Deliver the module that turns numbers into the text the user sees, using the internationalisation number-formatting API so grouping separators, the decimal mark and the minus sign follow the user's locale, and so binary floating-point artefacts never reach the screen. It sits on the presentation side, beside the engine from feature 2, which keeps its raw entry text. Nothing changes on screen yet; feature 4 connects engine, formatter and display.

## Must do

### Module boundary
- R1. The formatter is a single JavaScript ES module outside the engine folder that uses only the internationalisation number-formatting API and imports nothing from the DOM or the engine.
- R2. The module exports two pure functions: one that formats a finished numeric value, and one that formats an in-progress entry string from the engine.
- R3. Both functions accept an optional locale; when it is omitted they use the runtime's default locale.

### Formatting a value
- R4. Integer digits are grouped with the locale's grouping separator, as produced by the formatting API.
- R5. The decimal mark is the locale's, as produced by the formatting API.
- R6. Output carries at most 12 significant digits, set through the formatting API's significant-digit option, so 0.1 plus 0.2 formats as 0.3 and one third formats with twelve threes.
- R7. Trailing fractional zeros are not shown, so 2.50 formats as 2.5 and 3.0 formats as 3.
- R8. Negative values carry the locale's minus sign, and that sign character equals the minus-sign part the formatting API reports for the same locale; the module never inserts an ASCII hyphen itself.
- R9. Negative zero formats as plain zero with no sign, using the formatting API's sign-display option.
- R10. A value that is not a finite number throws a range error; overflow and not-a-number handling belong to the engine, not the formatter.

### Formatting an entry
- R11. The integer part of an entry string is grouped with the locale's grouping separator.
- R12. The entry's decimal point is shown as the locale's decimal mark.
- R13. A trailing decimal point and trailing fractional zeros are preserved exactly as typed, so an entry of "12." shows the grouping and mark for the locale and still ends with the mark, and "0.10" keeps its final zero.
- R14. An entry of "0" formats as "0", and an entry of "0." formats as zero followed by the locale decimal mark.
- R15. Locale tokens for entries are read from the formatting API's parts output for that locale, never hard-coded.

### Tests
- R16. Unit tests run under Node's built-in runner with no DOM, pass explicit locales rather than relying on the runtime default, and cover at least one locale that groups with a comma and marks decimals with a point, one that does the opposite, and one whose minus sign is not the ASCII hyphen.

## Explicitly not included

- No connection to the output element; the display still shows the static zero (row 4).
- No arithmetic, so no computed values reach the formatter yet (rows 5, 7, 8 and 9).
- No error messages or overflow text; the formatter rejects non-finite input and the engine will own error display (row 6).
- No negative entry strings; the sign toggle and entry-time minus arrive with subtraction (row 7).
- No user-selectable locale or settings; the runtime default is used (not on the roadmap).
- No changes to the engine module.
