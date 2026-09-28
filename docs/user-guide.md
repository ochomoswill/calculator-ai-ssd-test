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
9. [Division](#division)
10. [Physical keyboard input](#physical-keyboard-input)
11. [Responsive layout and theming](#responsive-layout-and-theming)
12. [Persistence](#persistence)
13. [Installable PWA](#installable-pwa)
14. [Offline support](#offline-support)

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

[Keypad and display](#keypad-and-display) makes these keys work for entering numbers. [Physical keyboard input](#physical-keyboard-input) lets you type instead of pressing keys. [Persistence](#persistence) saves your last result and recent calculations. [Installable PWA](#installable-pwa) covers installing the calculator as an app.

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

[Calculation engine core](#calculation-engine-core), above, supplies the typed number this feature formats. [Keypad and display](#keypad-and-display) puts these formats on screen. [Addition](#addition) and [Subtraction](#subtraction) produce results they apply to, including negative numbers with your locale's minus sign, and [Multiplication](#multiplication) and [Division](#division) round long results the same way.

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

[Calculator interface](#calculator-interface) provides the keys and display this feature connects. [Calculation engine core](#calculation-engine-core) supplies the number-entry rules you see, and [Number formatting](#number-formatting) decides how the number looks. [Addition](#addition) makes the Add and Equals keys work and [Subtraction](#subtraction) the Subtract and Toggle sign keys. [Multiplication](#multiplication) makes the Multiply key work and [Division](#division) the Divide key. Coming soon: and [Physical keyboard input](#physical-keyboard-input) lets you type without focusing a key first.

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

[Keypad and display](#keypad-and-display) provides the keys and display this feature uses, and [Number formatting](#number-formatting) decides how totals look. [Range check and error state](#range-check-and-error-state) handles totals too large to show. [Subtraction](#subtraction) works the same way and can be mixed with addition in one chain. [Multiplication](#multiplication) is where very large totals become likely, and [Division](#division) adds a second message for dividing by zero.

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

[Addition](#addition) is the first operation checked this way. [Division](#division) adds a second message for dividing by zero. [Responsive layout and theming](#responsive-layout-and-theming) gives the error messages a distinct look.

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

[Addition](#addition) introduced chaining and Equals, which subtraction shares. [Number formatting](#number-formatting) supplies the minus sign for your locale. [Multiplication](#multiplication) and [Division](#division) join the same chains.

---

## Multiplication

### What this feature does

You can now multiply. The Multiply key works like Add and Subtract and joins the same chains. Operations in a chain are applied in the order you press them, left to right, as on a pocket calculator: 2 plus 3 times 4 gives 20, not 14. Products with many digits are shown rounded to twelve significant figures. Multiplying large numbers is the easiest way to exceed what the calculator can hold, in which case it shows "Number too large". When this feature first shipped Divide was inactive; it came with [Division](#division).

### Setup

No setup is needed.

### How to use

1. Enter a number, press Multiply, enter another and press Equals. For example 12, Multiply, 3, Equals shows 36.
2. Chain freely with Add and Subtract; each press applies the operation so far and shows the running value.
3. If the display shows "Number too large", press Clear all and try smaller numbers.

### Related features

[Addition](#addition) and [Subtraction](#subtraction) share the chaining rules. [Range check and error state](#range-check-and-error-state) explains the "Number too large" message. [Division](#division) completes the four operations.

---

## Division

### What this feature does

You can now divide, which completes the four operations. The Divide key joins the same left-to-right chain as the others. Results that go on forever, such as one third, are shown rounded to twelve significant figures. Dividing by zero has no answer, so the calculator shows "Cannot divide by zero" and waits for you to clear, exactly as it does for numbers that are too large.

### Setup

No setup is needed.

### How to use

1. Enter a number, press Divide, enter another and press Equals. For example 12, Divide, 3, Equals shows 4.
2. Divide 1 by 3 and the display shows 0.333333333333; the full value is still used if you continue the calculation.
3. If you divide by zero, the display shows "Cannot divide by zero". Press Clear entry or Clear all to continue.

### Related features

[Addition](#addition), [Subtraction](#subtraction) and [Multiplication](#multiplication) share the chaining rules. [Range check and error state](#range-check-and-error-state) describes how error messages behave. [Physical keyboard input](#physical-keyboard-input) lets you type calculations directly.

---

## Physical keyboard input

### What this feature does

You can now type a whole calculation on a physical keyboard without clicking any on-screen key. Digits, the decimal point, the four operators, Enter, Escape, Backspace and Delete all work, from the main row or the numeric keypad. Keys pressed together with Control, Command or Alt are left to the browser, so your usual shortcuts still work.

### Setup

No setup is needed. Click anywhere on the calculator page once so it has the keyboard's attention, then type.

### How to use

1. Type digits and a point or comma to enter a number, for example 1 2 . 5.
2. Type + to add, - to subtract, * or x to multiply and / to divide.
3. Press Enter or = to see the result.
4. Press Backspace to remove the last character you typed.
5. Press Delete to clear the current number while keeping the calculation in progress, or Escape to clear everything.
6. To start a negative number, type - before the digits, exactly as with the Subtract key.

### Related features

[Keypad and display](#keypad-and-display) covers reaching the on-screen keys with Tab, Enter and Space. Every operation section above applies equally to typed input. [Responsive layout and theming](#responsive-layout-and-theming) shows where your keyboard focus is. [Persistence](#persistence) keeps a list of the calculations you complete.

---

## Responsive layout and theming

### What this feature does

The calculator now adapts to where it is shown. Keys and the display grow on wide screens and tighten on narrow ones, the page never scrolls sideways on a phone, and you can zoom as much as you like. Colours follow your device's light or dark setting automatically. Operation keys are tinted so they stand out from the digits, error messages appear in a warning colour that fits the display, and when you move through the keys with Tab a clear ring shows which one is selected. Keys give a brief press animation, which is switched off if your device asks for reduced motion.

### Setup

No setup is needed. The calculator reads your device's appearance and motion settings; change those settings to change the calculator.

### How to use

1. Open the calculator on a phone or resize the browser window; the layout adjusts by itself.
2. Switch your device between light and dark appearance; the calculator follows without a reload.
3. Press Tab to move between keys and watch for the highlighted ring around the selected key.
4. If you prefer less animation, turn on your device's reduce-motion setting; key presses then show no movement.

### Related features

[Calculator interface](#calculator-interface) laid out the keys this feature styles. [Range check and error state](#range-check-and-error-state) and [Division](#division) produce the messages shown in the warning colour. [Persistence](#persistence) adds the history list below the keypad. [Installable PWA](#installable-pwa) uses the same accent colour for the app icon and window.

---

## Persistence

### What this feature does

The calculator now remembers where you left off. Reload the page or come back later and the display shows the value it showed before, including a calculation you were in the middle of. Below the keypad, a History list shows your ten most recent completed calculations, newest first, such as "12 + 30 = 42". Everything is stored in your own browser; nothing is sent anywhere. If your browser blocks storage, for example in a private window, the calculator works exactly the same but forgets when you leave.

### Setup

No setup is needed. To let the calculator remember between visits, allow the site to store data in your browser, which is the usual default.

### How to use

1. Use the calculator as normal. Each time you press Equals, the calculation is added to the top of the History list.
2. Reload the page. The display and the History list come back as they were.
3. Press Clear history, below the list, to empty it. Clear all resets the display but keeps the history.
4. To stop the calculator remembering, clear the site's data in your browser settings.

### Related features

[Keypad and display](#keypad-and-display) and every operation section describe what gets remembered. [Number formatting](#number-formatting) formats the numbers in the history list for your locale. [Installable PWA](#installable-pwa) lets you keep the calculator as an app, and [Offline support](#offline-support) keeps your saved history reachable without a connection.

---

## Installable PWA

### What this feature does

You can now install the calculator on your phone, tablet or computer like an ordinary app. Once installed it has its own icon, opens in its own window without browser toolbars, and remembers your history as before. Nothing is downloaded from an app store; the installation comes straight from the web page. With [Offline support](#offline-support) it also works without an internet connection.

### Setup

Open the calculator over a secure (https) address in a browser that supports installing web apps, such as Chrome, Edge or Samsung Internet. On iPhone and iPad, use Safari's Share menu and choose Add to Home Screen.

### How to use

1. Open the calculator in your browser.
2. Look for an Install option: an icon in the address bar, an entry in the browser menu, or a banner on a phone. On iPhone and iPad, choose Add to Home Screen from the Share menu.
3. Confirm. The calculator's icon appears with your other apps.
4. Open it from that icon. It launches in its own window.
5. To remove it, uninstall it as you would any app, or remove it from your home screen.

### Related features

[Responsive layout and theming](#responsive-layout-and-theming) gives the app its colours, which the icon and window frame share. [Persistence](#persistence) keeps your history inside the installed app, and [Offline support](#offline-support) makes it work without a connection.

---

## Offline support

### What this feature does

After you have opened the calculator once while online, it keeps working with no internet connection, whether you open it in the browser or from its installed icon. Everything the calculator needs is kept on your device, and when a new version is published it replaces the old one the next time you are online.

### Setup

Open the calculator once while connected, over a secure (https) address. Browsers only store the app for offline use from secure addresses.

### How to use

1. Open the calculator while online. It saves itself for later in the background.
2. Go offline, or switch on aeroplane mode, and open the calculator again. It loads and calculates as normal, and your history is still there.
3. When you are back online, simply use the calculator; any new version is picked up automatically and takes effect on the next visit.

### Related features

[Installable PWA](#installable-pwa) gives the calculator its own icon and window; this feature makes that app usable anywhere. [Persistence](#persistence) stores your history on the device, so it is available offline too.

