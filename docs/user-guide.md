# Calculator — User Guide

## About this application

This is a simple calculator for adding, subtracting, multiplying and dividing numbers. It runs in your web browser on a computer or a phone, with nothing to install, and it works the same way everywhere so you never have to hunt for a calculator app. This guide grows with each new capability the calculator gains.

## Table of contents

1. [Calculator interface](#calculator-interface)
2. [Calculation engine core](#calculation-engine-core)
3. [Number formatting](#number-formatting)
4. [Keypad and display](#keypad-and-display)
5. [Addition](#addition)
6. [Range check and error state](#range-check-and-error-state)
7. [Subtraction](#subtraction)
8. [Multiplication](#multiplication)

---

## Calculator interface

### What this feature does

The calculator interface is the screen you see when you open the calculator: a result area at the top and a keypad of buttons below it. The keypad has the digits zero to nine, a decimal point, the four arithmetic operations, an equals key, a key to switch a number between positive and negative, and two clear keys. The layout adapts to the size of your screen, follows your device's light or dark appearance setting, and every key can be reached with a keyboard or read aloud by a screen reader. When this feature first shipped the interface was display-only; the keys began to work with [Keypad and display](#keypad-and-display).

### Setup

No setup is needed. Open the calculator's web address in any modern browser. If you are running it on your own computer from the project files, follow the commands in the project README to start the local server, then open the address it prints.

### How to use

1. Open the calculator in your browser. The result area at the top shows 0.
2. Look over the keypad below the result. Reading left to right, top to bottom, the keys are: Clear all, Clear entry, Toggle sign, Divide; 7, 8, 9, Multiply; 4, 5, 6, Subtract; 1, 2, 3, Add; 0, Decimal point, Equals.
3. To move between keys with a keyboard, press Tab to go forward and Shift+Tab to go back. Keys are visited in the order listed above.
4. If you use a screen reader, each key announces its full name, such as "Multiply" or "Clear all", and the result area is announced whenever it changes.
5. To make the calculator larger or smaller, use your browser's normal zoom controls. Zooming is never blocked.
6. Switch your device between light and dark appearance and the calculator follows automatically.

### Related features

[Keypad and display](#keypad-and-display) makes these keys work for entering numbers. Later sections will cover each arithmetic operation, keyboard shortcuts, saving your last result and installing the calculator as an app.

---

## Calculation engine core

### What this feature does

This feature adds the part of the calculator that remembers the number you are typing. It follows the rules you would expect from a pocket calculator: the first digit you type replaces the starting zero, later digits join on the end, you can add one decimal point, and there are two ways to clear. When this feature first shipped nothing changed on screen; the keys were connected by [Keypad and display](#keypad-and-display).

### Setup

No setup is needed. Nothing about running the calculator has changed since the previous feature; see the project README if you run it on your own computer.

### How to use

Typing a number works like this:

1. The result area starts at 0. Press a digit and it replaces the 0. Pressing 0 on its own leaves it at 0.
2. Press more digits and they join on the end, so pressing 7, 8, 9 shows 789.
3. Press the decimal point to start a fraction. Pressing it first shows "0." and a following digit appears after the point.
4. Press the decimal point a second time in the same number and nothing happens; a number can have only one.
5. A number can hold up to 12 digits. Once it does, further digits are ignored until you clear.
6. Press Clear entry to set the number back to 0 while keeping any calculation in progress.
7. Press Clear all to return the whole calculator to its starting state.

### Related features

[Number formatting](#number-formatting), below, decides how the typed number is shown. [Keypad and display](#keypad-and-display) connects the keypad so the steps above happen on screen. [Calculator interface](#calculator-interface), above, is the screen these rules will drive.

---

## Number formatting

### What this feature does

This feature decides how numbers look on the calculator's display. Numbers follow the conventions of your language and region: the thousands are grouped with the separator you are used to, the decimal mark is a point or a comma as appropriate, and negative numbers use the correct minus sign for your locale. Results are shown to twelve significant figures, so a sum such as 0.1 plus 0.2 reads as 0.3 rather than a long tail of digits. While you are typing, what you have typed is kept exactly, including a decimal point with nothing after it yet. When this feature first shipped the display still showed 0; the formats appeared on screen with [Keypad and display](#keypad-and-display).

### Setup

No setup is needed. The calculator reads the language and region already set in your browser or device. To see a different format, change that setting; there is no separate option inside the calculator.

### How to use

Numbers appear like this:

1. Type a large number and the thousands are grouped automatically, for example 1,234,567 in an English locale or 1.234.567 in a German one.
2. Type a decimal point and it appears as the mark your locale uses, a point or a comma, and stays visible while you continue typing.
3. Type trailing zeros after the point, such as 0.10, and they stay exactly as typed until you finish the number.
4. Get a result with many decimal places, such as one third, and it is shown rounded to twelve significant figures.
5. Get a negative result and it carries your locale's minus sign in front.

### Related features

[Calculation engine core](#calculation-engine-core), above, supplies the typed number this feature formats. [Keypad and display](#keypad-and-display) puts these formats on screen. [Addition](#addition) and [Subtraction](#subtraction) produce results they apply to, including negative numbers with your locale's minus sign, and [Multiplication](#multiplication) rounds long products the same way; division (roadmap row 9) will follow.

---

## Keypad and display

### What this feature does

The calculator now responds when you use it. Pressing a digit, the decimal point or either clear key changes the number in the result area straight away, formatted for your language and region. This is the first release in which the calculator visibly does something. When this feature first shipped the operation keys were inactive; Add and Equals came to life with [Addition](#addition), and the other operations follow in their own features.

### Setup

No setup is needed. Open the calculator as before; see the project README if you run it on your own computer.

### How to use

1. Tap or click a digit key. The result area changes from 0 to that digit.
2. Keep pressing digits and they join on the end. Large numbers are grouped as you type, for example 1,234,567.
3. Press Decimal point to start a fraction. The mark appears immediately and further digits follow it.
4. Press Clear entry to set the current number back to 0, or Clear all to reset the calculator.
5. Using a keyboard, press Tab until the key you want is highlighted, then press Enter or Space to activate it.
6. Using a screen reader, activate a key as usual; the new value in the result area is announced without moving your focus.

### Related features

[Calculator interface](#calculator-interface) provides the keys and display this feature connects. [Calculation engine core](#calculation-engine-core) supplies the number-entry rules you see, and [Number formatting](#number-formatting) decides how the number looks. [Addition](#addition) makes the Add and Equals keys work and [Subtraction](#subtraction) the Subtract and Toggle sign keys. [Multiplication](#multiplication) makes the Multiply key work. Coming soon: division (roadmap row 9) will make the last key work, and Physical keyboard input (row 10) will let you type without focusing a key first.

---

## Addition

### What this feature does

You can now add numbers. Enter a number, press Add, enter another and press Equals to see the total. You can keep pressing Add to build up a running total, and the result of one sum can be the start of the next. Totals are shown rounded to twelve significant figures, so adding 0.1 and 0.2 shows 0.3. When this feature first shipped the other operation keys were inactive; Subtract and Toggle sign came with [Subtraction](#subtraction).

### Setup

No setup is needed.

### How to use

1. Enter the first number, for example 12.
2. Press Add. The display keeps showing 12 while it waits for the next number.
3. Enter the second number, for example 30.
4. Press Equals. The display shows 42.
5. To add several numbers, press Add between each one; the display shows the running total after each press. Finish with Equals.
6. To continue from a result, press Add straight after Equals and enter the next number, or start typing a new number to begin a fresh calculation.
7. Press Clear entry to retype the current number without losing a sum in progress, or Clear all to start over.

### Related features

[Keypad and display](#keypad-and-display) provides the keys and display this feature uses, and [Number formatting](#number-formatting) decides how totals look. [Range check and error state](#range-check-and-error-state) handles totals too large to show. [Subtraction](#subtraction) works the same way and can be mixed with addition in one chain. [Multiplication](#multiplication) is where very large totals become likely. Coming soon: Division (roadmap row 9) will complete the operations.

---

## Range check and error state

### What this feature does

If a calculation produces a number too large for the calculator to represent, the display shows the message "Number too large" instead of a meaningless value. While the message is showing, the digit, decimal point, operation and Equals keys are ignored so a bad value cannot carry into the next calculation. Pressing either clear key returns the calculator to 0. If you use a screen reader, the message is announced when it appears. With addition alone this limit is very hard to reach; it matters more once multiplication arrives.

### Setup

No setup is needed.

### How to use

1. If the display shows "Number too large", the last calculation could not be completed.
2. Press Clear entry or Clear all. The display returns to 0 and the calculator is ready again.
3. Re-enter the calculation with smaller numbers.

### Related features

[Addition](#addition) is the first operation checked this way. Coming soon: Division (roadmap row 9) will add a second message for dividing by zero, and Responsive layout and theming (row 11) will give the error message a distinct look.

---

## Subtraction

### What this feature does

You can now subtract, work with negative numbers and flip the sign of a value. Subtract works like Add and the two can be mixed in one chain, for example 10 plus 5 minus 20. Pressing Subtract before you have typed anything starts a negative number. Toggle sign switches whatever is showing between positive and negative. Negative values are shown with the minus sign your language uses. When this feature first shipped Multiply and Divide were inactive; Multiply came with [Multiplication](#multiplication).

### Setup

No setup is needed.

### How to use

1. Enter a number, press Subtract, enter another and press Equals. For example 12, Subtract, 30, Equals shows -18.
2. Mix operations by pressing Add or Subtract between numbers; the running total appears after each press.
3. To start with a negative number, press Subtract first and then type the digits, for example Subtract, 5 shows -5.
4. To make the number you are typing negative, or to flip a result, press Toggle sign. Press it again to flip back.
5. After pressing Add or Subtract, press Toggle sign before typing to make the next number negative.

### Related features

[Addition](#addition) introduced chaining and Equals, which subtraction shares. [Number formatting](#number-formatting) supplies the minus sign for your locale. [Multiplication](#multiplication) joins the same chains. Coming soon: Division (roadmap row 9).

---

## Multiplication

### What this feature does

You can now multiply. The Multiply key works like Add and Subtract and joins the same chains. Operations in a chain are applied in the order you press them, left to right, as on a pocket calculator: 2 plus 3 times 4 gives 20, not 14. Products with many digits are shown rounded to twelve significant figures. Multiplying large numbers is the easiest way to exceed what the calculator can hold, in which case it shows "Number too large". Divide is still inactive.

### Setup

No setup is needed.

### How to use

1. Enter a number, press Multiply, enter another and press Equals. For example 12, Multiply, 3, Equals shows 36.
2. Chain freely with Add and Subtract; each press applies the operation so far and shows the running value.
3. If the display shows "Number too large", press Clear all and try smaller numbers.

### Related features

[Addition](#addition) and [Subtraction](#subtraction) share the chaining rules. [Range check and error state](#range-check-and-error-state) explains the "Number too large" message. Coming soon: Division (roadmap row 9).

