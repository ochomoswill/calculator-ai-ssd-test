# Feature 1: Calculator Interface — Requirements

Roadmap row 1. Branch `spec/2026-09-28-calculator-interface`.
Design authority: [Requirement 1 of the web technical design](../tech-design-web.md#requirement-1-a-calculator-application-for-web-and-mobile).

## Goal

Deliver the application shell and the visible calculator interface: a project that builds, runs locally and tests green, rendering the display and keypad exactly as the design describes them. Nothing responds to input yet. Every later feature adds behaviour to this interface without changing its structure.

## Must do

### Project
- R1. The project is plain HTML, CSS and JavaScript ES modules with no framework, no build step and no server-side code; the files on disk are the files served.
- R2. A fresh clone can install test dependencies, serve the site locally and run the test suite with one documented command each.
- R3. Two test layers exist and run green using Node's built-in test runner: unit tests for DOM-free modules, and DOM tests that load the real page and query it by role and accessible name.
- R4. The source tree separates a `engine` folder (reserved for the DOM-free calculation engine) from the presentation components, so the boundary in the design exists from day one, even though the engine folder holds no logic yet.

### Display
- R5. The result display is the HTML output element, so it carries the implicit status role and is announced by assistive technology as a polite live region.
- R6. The display has an accessible name of "Result" and initially shows the digit zero.
- R7. The display contains only text, never nested controls.

### Keypad
- R8. Every key is a native button with an explicit type of "button".
- R9. Every key has a text accessible name. Keys whose visible label is a symbol expose a visually hidden text name instead.
- R10. The keypad contains, with these accessible names: the digits "0" to "9", "Decimal point", "Add", "Subtract", "Multiply", "Divide", "Equals", "Toggle sign", "Clear entry" and "Clear all".
- R11. The multiply and divide keys show the conventional multiplication and division sign glyphs; the subtract key shows a minus sign; the add key shows a plus sign.
- R12. Keys are in a single keypad landmark region with an accessible name of "Keypad", and keyboard focus moves through them in document order with no positive tab-index values.
- R13. Keys have visible spacing between them.

### Page
- R14. The page has a title, a language attribute and a viewport meta tag that sets the width to the device width and does not disable user scaling.
- R15. The calculator root declares an inline-size containment context so later layout work can use container queries.
- R16. The root declares support for both light and dark colour schemes.

## Explicitly not included

- No calculation engine logic, entry state machine or number formatting (roadmap rows 2 and 3).
- No response to key presses of any kind: on-screen taps and physical keys do nothing (rows 4 to 10).
- No arithmetic operations, error states or range checks (rows 5 to 9).
- No responsive layout rules, theme colours or reduced-motion handling beyond the declarations in R15 and R16 (row 11).
- No persistence (row 12).
- No web app manifest, icons, service worker or offline behaviour (rows 13 and 14).
- No engine packaging for mobile (row 15).
- No calculation history area.
