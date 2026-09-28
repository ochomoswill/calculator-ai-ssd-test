# Feature 1: Calculator Interface — Acceptance

Feature is done when every scenario below passes. A1 and A2 are verified manually; A3 to A10 are automated DOM or unit tests; A11 and A12 are verified by inspection of the built page.

## Project

**A1. Fresh clone runs**
Given a fresh clone with no `node_modules`, when the documented install, serve and test commands run in order, then each exits successfully and the local server serves the calculator page.

**A2. Test layers exist**
Given the test command runs, then at least one unit test in the engine folder and at least one DOM test pass, and the unit test imports no browser API.

## Display

**A3. Output element with status role**
Given the page renders, when the accessibility tree is queried for a status role with the name "Result", then exactly one element is found and it is an output element.

**A4. Initial value**
Given the page renders, then the "Result" status shows the text "0" and contains no buttons or links.

## Keypad

**A5. Keypad landmark**
Given the page renders, when the accessibility tree is queried for a region named "Keypad", then exactly one is found and every key button is inside it.

**A6. All keys present by name**
Given the page renders, then buttons with these exact accessible names each exist once: "0" through "9", "Decimal point", "Add", "Subtract", "Multiply", "Divide", "Equals", "Toggle sign", "Clear entry", "Clear all".

**A7. Native buttons**
Given every element with the button role in the keypad, then each is a native button element with type "button".

**A8. Symbol glyphs**
Given the page renders, then the visible text of the "Multiply" key is the multiplication sign, "Divide" is the division sign, "Add" is the plus sign and "Subtract" is the minus sign, while their accessible names remain the words above.

**A9. Focus order**
Given the page renders, when focus is moved with Tab repeatedly, then every key receives focus in document order and no element has a positive tab-index.

**A10. No behaviour yet**
Given the page renders, when any key is activated by click or keyboard, then the "Result" text still reads "0".

## Page

**A11. Document metadata**
Given the built page, then it has a non-empty title, a language attribute, and a viewport meta tag whose content sets the width to the device width and does not set user-scalable to no.

**A12. Style declarations**
Given the built page, then the calculator root has an inline-size containment context, the root declares both light and dark colour schemes, and keys have a non-zero gap between them.
