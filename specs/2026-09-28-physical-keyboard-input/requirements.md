# Feature 10: Physical Keyboard Input — Requirements

Roadmap row 10. Branch `spec/2026-09-28-physical-keyboard-input`.
Design authority: [Requirement 1 of the web technical design](../tech-design-web.md#requirement-1-a-calculator-application-for-web-and-mobile) (keydown event, standard key property, numeric-keypad characters, Enter, Escape, Backspace, Delete mapped to evaluate, clear all, delete last digit, clear entry) and the key values named under [Requirements 2 to 5](../tech-design-web.md#requirement-2-addition) (plus, minus, asterisk and x, forward slash).

## Goal

Let the user operate the whole calculator from a physical keyboard without focusing a key first. Typed digits, the decimal point, the four operators, Enter, Escape, Backspace and Delete drive the same engine actions as the on-screen keys. The main row and the numeric keypad both work because modern browsers report the same key characters for both.

## Must do

### Engine
- R1. A new delete-last action removes the last typed character from the entry while typing; an entry reduced to nothing or to a bare minus becomes zero; it is ignored when a result is on show or in the error state.

### Keyboard listener
- R2. The wiring attaches exactly one keydown listener, on the document that owns the root, in addition to its single click listener.
- R3. The listener reads the event's key property and maps: the characters "0" to "9" to digits; "." and "," to the decimal point; "+" to add; "-" to subtract; "*", "x" and "X" to multiply; "/" to divide; "Enter" and "=" to equals; "Escape" to clear all; "Backspace" to delete last; "Delete" to clear entry.
- R4. Events with the Control, Meta or Alt modifier held are ignored so browser shortcuts keep working.
- R5. When the event target is one of the keypad's buttons and the key is Enter or Space, the listener does nothing, because the native button already activates on those keys and the click listener handles it; this prevents double actions.
- R6. For every key the listener handles it calls the event's default-prevention method so the browser does not also act on the key (for example quick-find on "/").
- R7. Unhandled keys are left untouched and the state does not change.

### Display
- R8. After a handled key the display updates exactly as after the equivalent on-screen key.

### Tests
- R9. DOM tests dispatch keydown events on the document with the key values above and read the display by role and name; they also cover a modifier-held key, an unhandled key, Backspace behaviour, and Enter on a focused keypad button producing a single action.

## Explicitly not included

- No visual highlight of the on-screen key when its keyboard equivalent is pressed (not on the roadmap).
- No keyboard shortcut for Toggle sign (not named in the design).
- No layout or theme changes (row 11).
