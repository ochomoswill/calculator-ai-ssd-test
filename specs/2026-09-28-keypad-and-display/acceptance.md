# Feature 4: Keypad and Display — Acceptance

Feature is done when every scenario below passes. A1 to A14 are automated DOM tests under Node's built-in test runner. A15 and A16 are checked by inspection of source and version control. A17 is a manual check in a real browser because the DOM implementation does not run the page's module script or synthesise keyboard activation of buttons.

## Wiring module

**A1. Mount renders zero**
Given the loaded page, when the wiring module is mounted on the calculator root with an explicit locale, then the "Result" status shows "0".

**A2. Single click listener, no keyboard listener**
Given the wiring module source, then it registers exactly one click listener and no keydown, keyup or keypress listener.

**A3. Imports limited**
Given the wiring module source, then its only imports are the engine module and the formatter module.

## Keys wired

**A4. First digit replaces zero**
Given a mounted page, when the "7" key is activated, then the display shows "7".

**A5. Digits append**
Given a mounted page, when "7", "8" and "9" are activated in turn, then the display shows "789".

**A6. Grouping on screen**
Given a page mounted with a comma-grouping locale, when the digits of 1234567 are activated, then the display shows "1,234,567".

**A7. Decimal point on screen**
Given a page mounted with a comma-grouping locale, when "1", "2", "Decimal point" are activated, then the display shows "12."; when "5" follows, it shows "12.5".

**A8. Locale decimal mark**
Given a page mounted with a comma-decimal locale, when "1", "2", "Decimal point", "5" are activated, then the display shows "12,5".

**A9. Second decimal ignored**
Given a display of "12.5", when "Decimal point" is activated again, then the display still shows "12.5".

**A10. Twelve-digit limit on screen**
Given twelve digits have been activated, when a thirteenth is activated, then the display is unchanged.

**A11. Clear entry**
Given a display of "12.5", when "Clear entry" is activated, then the display shows "0".

**A12. Clear all**
Given a display of "789", when "Clear all" is activated, then the display shows "0".

**A13. Operator keys inert**
Given a display of "789", when each of "Add", "Subtract", "Multiply", "Divide", "Equals" and "Toggle sign" is activated, then nothing throws and the display still shows "789".

## Display

**A14. Plain text only**
Given any sequence of activations, then the "Result" status contains no child elements, only text.

## Page and tests

**A15. Entry module mounts the app**
Given the page's entry module source, then it imports the wiring module and calls mount with the calculator root and no locale.

**A16. Untouched files**
Given the feature's diff, then the engine module, formatter module, page markup and stylesheets have no changes, and the full test suite passes with every earlier test intact.

**A17. Keyboard activation in a browser (manual)**
Given the page served locally and opened in a browser, when a digit key is focused with Tab and Enter or Space is pressed, then the display updates the same as a click.
