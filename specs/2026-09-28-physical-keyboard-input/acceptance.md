# Feature 10: Physical Keyboard Input — Acceptance

A1 is an engine unit test; A2 to A9 are DOM tests dispatching keydown events and reading the "Result" status. A10 is a manual check in a real browser.

## Engine

**A1. Delete last**
Given an entry of "12.5", when delete-last is applied three times, then the entry goes "12." then "12" then "1"; a fourth gives "0"; on "-5" it gives "0"; on a shown result or in the error state the state is unchanged.

## Keyboard

**A2. Digits and decimal**
Given a mounted page, when the keys 1, 2, ".", 5 are pressed, then the display shows "12.5"; and "," also enters the decimal point.

**A3. Operators and Enter**
Given a mounted page, when 1, 2, "+", 3, "Enter" are pressed the display shows "15"; "-" subtracts, "*" and "x" multiply, "/" divides, and "=" evaluates like Enter.

**A4. Escape, Delete and Backspace**
Given a display of "12.5", when Backspace is pressed the display shows "12."; when Delete is pressed it shows "0" while a pending operation is kept; when Escape is pressed after 5, "+", 3 the display shows "0" and a following "Enter" leaves it at "0".

**A5. Default prevented for handled keys**
Given a mounted page, when "/" or "Enter" is pressed, then the event's default is prevented; when an unhandled key such as "q" is pressed, it is not.

**A6. Modifier keys ignored**
Given a mounted page, when "5" is pressed with Control, Meta or Alt held, then the display still shows "0" and default is not prevented.

**A7. Unhandled keys ignored**
Given a mounted page, when "q", "Tab" or "ArrowUp" is pressed, then the display is unchanged.

**A8. Enter on a focused key acts once**
Given a mounted page with the "7" key focused, when Enter is dispatched on that button and the button's native click follows, then the display shows "7", not a result of Equals.

**A9. Listener count**
Given the wiring module source, then it registers exactly one click listener and one keydown listener.

**A10. Real browser (manual)**
Given the page served locally, when 1 2 + 3 Enter are typed on the main row and again on the numeric keypad, then the display shows 15 both times and "/" does not open the browser's quick-find.
