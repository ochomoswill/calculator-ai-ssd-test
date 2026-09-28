# Feature 11: Responsive Layout and Theming — Acceptance

A1 to A8 are automated stylesheet inspections under Node's built-in test runner. A9 is manual in a real browser.

**A1. Tokens defined for both schemes**
Given the base stylesheet, then the root block defines at least six custom properties including background, foreground, surface, accent, error and border tokens, and a prefers-color-scheme dark media block redefines every one of them.

**A2. No literal colours outside token blocks**
Given both stylesheets with the root and dark blocks removed, then no remaining declaration contains a hex colour, an rgb or hsl function, or a named system colour; colours are referenced only through var().

**A3. Reduced motion honoured**
Given the base stylesheet, then a prefers-reduced-motion reduce media block sets transitions to none and transforms to none.

**A4. Container queries present**
Given the calculator stylesheet, then the root keeps the inline-size container type and at least two container at-rules adjust font sizes.

**A5. Error state styled**
Given the calculator stylesheet, then a rule targets the display's error marker attribute and sets the error colour token and a font size.

**A6. Focus visible**
Given the calculator stylesheet, then a focus-visible rule on keys sets an outline using the accent token and an outline offset.

**A7. Logical properties only**
Given both stylesheets, then no declaration uses margin-left, margin-right, margin-top, margin-bottom, padding-left, padding-right, padding-top, padding-bottom, left, right, top, bottom, width, height, min-width, min-height, max-width, max-height, or text-align left or right.

**A8. Grid and viewport preserved**
Given the calculator stylesheet and the page, then the keypad is a four-column grid, the zero key spans two columns, and the viewport tag sets device width without disabling user scaling.

**A9. Visual check (manual)**
Given the page served locally, when viewed at a phone width and a desktop width, in light and dark system themes, and with reduced motion enabled, then nothing overflows or clips horizontally, colours follow the theme, focus rings are visible when tabbing, an error message fits the display, and keys show no animation under reduced motion.
