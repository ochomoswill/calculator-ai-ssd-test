# Feature 2: Calculation Engine Core — Acceptance

Feature is done when every scenario below passes. All scenarios are automated unit tests under Node's built-in test runner except A1, which is checked by inspection of the module's import list and by the test file running in Node's default environment.

## Module boundary

**A1. No browser dependency**
Given the engine module, when it is imported in a plain Node process with no DOM globals defined, then the import succeeds and the module source contains no reference to `document`, `window`, `navigator`, storage APIs or timers.

**A2. Actions are pure**
Given any state, when any action is applied, then the returned state is a different object, the input state is unchanged, and applying the same action to the same input twice gives equal results.

**A3. Initial state is frozen**
Given the initial state, when a caller tries to assign to one of its fields, then the assignment has no effect (or throws in strict mode) and the state still reads as initial.

## State shape

**A4. Fields present**
Given the initial state, then it has an entry of "0", a display of "0", an empty pending operator, an empty stored operand and an empty error.

**A5. Display mirrors entry**
Given any sequence of digit and decimal actions, then the display value equals the entry string exactly.

## Digit entry

**A6. First digit replaces zero**
Given the initial state, when the digit 7 is entered, then the entry is "7".

**A7. Digits append**
Given an entry of "7", when the digits 8 and 9 are entered, then the entry is "789".

**A8. Zero after zero stays zero**
Given the initial state, when the digit 0 is entered, then the entry is still "0".

**A9. Digit limit**
Given an entry of twelve digits, when a thirteenth digit is entered, then the state is returned unchanged; and given an entry of "0." followed by twelve digits, a further digit is also ignored.

**A10. Invalid digit throws**
Given any state, when the digit action is called with "a", "10", an empty string or a number outside the digit characters, then a range error is thrown and the state is unchanged.

## Decimal point

**A11. Decimal appends once**
Given an entry of "12", when the decimal point is entered, then the entry is "12."; when a digit 5 follows, the entry is "12.5".

**A12. Second decimal ignored**
Given an entry of "12.5", when the decimal point is entered again, then the state is returned unchanged.

**A13. Decimal on initial state**
Given the initial state, when the decimal point is entered, then the entry is "0."; when the digit 3 follows, the entry is "0.3".

## Clearing

**A14. Clear entry**
Given an entry of "12.5", when clear entry is applied, then the entry and display are "0" and the pending operator, stored operand and error fields are exactly as they were before.

**A15. Clear all**
Given any state reached through a sequence of actions, when clear all is applied, then the result equals the initial state.

## Tests

**A16. Runner and environment**
Given the test command, when it runs, then the engine tests execute in Node's default environment with no DOM and every scenario above passes.
