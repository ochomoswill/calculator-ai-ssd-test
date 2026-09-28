# Feature 11: Responsive Layout and Theming — Requirements

Roadmap row 11. Branch `spec/2026-09-28-responsive-layout-and-theming`.
Design authority: [Requirement 1 of the web technical design](../tech-design-web.md#requirement-1-a-calculator-application-for-web-and-mobile) (CSS Grid keypad; inline-size container queries; logical properties; viewport that keeps zoom; colour-scheme with prefers-color-scheme; prefers-reduced-motion).

## Goal

Make the calculator look finished on any screen and in any theme. The keypad and display scale with the width of the calculator's own container rather than the viewport, colours follow the operating-system light or dark setting through custom properties, error messages are visually distinct, keyboard focus is clearly visible, and the only motion (a brief key-press feedback) is removed when the user asks for reduced motion. No behaviour changes.

## Must do

### Theme tokens
- R1. All colours are defined once as custom properties on the root element for the light scheme and redefined inside a prefers-color-scheme dark media block; no rule outside those two places names a literal colour.
- R2. The root keeps declaring support for both light and dark schemes so form controls and scrollbars follow the system.
- R3. The display in the error state uses a distinct error colour token and a smaller font size so a message never overflows the display.
- R4. Operator and equals keys use an accent token so they are visually grouped; digit keys use the surface token.

### Layout
- R5. The calculator root remains an inline-size container, and at least two container queries adjust the display font size and key size for narrow and wide containers.
- R6. Every sizing and spacing rule uses logical properties (inline and block), never physical left, right, top or bottom properties, and text alignment uses logical start or end.
- R7. The keypad stays a four-column grid at every width, with the zero key spanning two columns, and the page never scrolls horizontally at phone width.
- R8. The viewport meta tag keeps user scaling enabled.

### Focus and motion
- R9. Keyboard focus is shown with a focus-visible outline using an accent token and an offset, on every key.
- R10. A key gives brief visual feedback while pressed through a transition; inside a prefers-reduced-motion reduce media block, transitions and transforms are disabled.

### Tests
- R11. Automated tests read the two stylesheets and assert: token definitions in the root block and in a dark media block; a reduced-motion block that disables transitions; at least two container queries; a rule targeting the error marker; a focus-visible rule; no physical directional properties; the viewport tag unchanged. A manual scenario covers the visual check in a browser.

## Explicitly not included

- No behaviour or markup changes beyond stylesheet links (already present).
- No user-selectable theme (not on the roadmap).
- No history area styling (row 12 adds the area and its styles).
