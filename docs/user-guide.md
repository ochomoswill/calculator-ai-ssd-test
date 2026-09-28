# Calculator — User Guide

## About this application

This is a simple calculator for adding, subtracting, multiplying and dividing numbers. It runs in your web browser on a computer or a phone, with nothing to install, and it works the same way everywhere so you never have to hunt for a calculator app. This guide grows with each new capability the calculator gains.

## Table of contents

1. [Calculator interface](#calculator-interface)
2. [Calculation engine core](#calculation-engine-core)
3. [Number formatting](#number-formatting)

---

## Calculator interface

### What this feature does

The calculator interface is the screen you see when you open the calculator: a result area at the top and a keypad of buttons below it. The keypad has the digits zero to nine, a decimal point, the four arithmetic operations, an equals key, a key to switch a number between positive and negative, and two clear keys. The layout adapts to the size of your screen, follows your device's light or dark appearance setting, and every key can be reached with a keyboard or read aloud by a screen reader. At this stage the interface is display-only: the keys are visible but do not yet change the result, which always shows zero.

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

Coming soon. Later sections will cover entering numbers, each arithmetic operation, keyboard shortcuts, saving your last result and installing the calculator as an app.

---

## Calculation engine core

### What this feature does

This feature adds the part of the calculator that remembers the number you are typing. It follows the rules you would expect from a pocket calculator: the first digit you type replaces the starting zero, later digits join on the end, you can add one decimal point, and there are two ways to clear. Nothing changes on screen in this release. The keypad still does not respond, and the result area still shows 0, because the connection between the keys and this number-entry logic arrives in a later feature.

### Setup

No setup is needed. Nothing about running the calculator has changed since the previous feature; see the project README if you run it on your own computer.

### How to use

There is nothing new to do yet. When a later feature connects the keys, typing a number will work like this:

1. The result area starts at 0. Press a digit and it replaces the 0. Pressing 0 on its own leaves it at 0.
2. Press more digits and they join on the end, so pressing 7, 8, 9 shows 789.
3. Press the decimal point to start a fraction. Pressing it first shows "0." and a following digit appears after the point.
4. Press the decimal point a second time in the same number and nothing happens; a number can have only one.
5. A number can hold up to 12 digits. Once it does, further digits are ignored until you clear.
6. Press Clear entry to set the number back to 0 while keeping any calculation in progress.
7. Press Clear all to return the whole calculator to its starting state.

### Related features

[Number formatting](#number-formatting), below, decides how the typed number is shown. Connecting the keypad (roadmap row 4) is still to come and will make the steps above happen on screen. [Calculator interface](#calculator-interface), above, is the screen these rules will drive.

---

## Number formatting

### What this feature does

This feature decides how numbers look on the calculator's display. Numbers follow the conventions of your language and region: the thousands are grouped with the separator you are used to, the decimal mark is a point or a comma as appropriate, and negative numbers use the correct minus sign for your locale. Results are shown to twelve significant figures, so a sum such as 0.1 plus 0.2 reads as 0.3 rather than a long tail of digits. While you are typing, what you have typed is kept exactly, including a decimal point with nothing after it yet. Nothing changes on screen in this release: the display still shows 0, because the connection between the keys, the number logic and the display arrives in the next feature.

### Setup

No setup is needed. The calculator reads the language and region already set in your browser or device. To see a different format, change that setting; there is no separate option inside the calculator.

### How to use

There is nothing new to do yet. Once the display is connected, numbers will appear like this:

1. Type a large number and the thousands are grouped automatically, for example 1,234,567 in an English locale or 1.234.567 in a German one.
2. Type a decimal point and it appears as the mark your locale uses, a point or a comma, and stays visible while you continue typing.
3. Type trailing zeros after the point, such as 0.10, and they stay exactly as typed until you finish the number.
4. Get a result with many decimal places, such as one third, and it is shown rounded to twelve significant figures.
5. Get a negative result and it carries your locale's minus sign in front.

### Related features

[Calculation engine core](#calculation-engine-core), above, supplies the typed number this feature formats. Coming soon: connecting the keypad and display (roadmap row 4) will put these formats on screen, and each arithmetic operation (rows 5, 7, 8 and 9) will produce the results they apply to.

