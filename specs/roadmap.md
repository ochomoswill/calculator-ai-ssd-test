# Roadmap — Web Calculator

Ordered queue of features. Each builds only on the ones above it. Design decisions live in [specs/tech-design-web.md](tech-design-web.md); statuses are `planned`, `in progress` or `done`.

---

### 1. Calculator interface
- **Delivers:** A calculator app that builds, runs locally, has a passing test suite and shows the static display and keypad layout.
- **Status:** done
- **Build:** Plain HTML, CSS and JavaScript ES modules with no build step, test runners, native buttons and the output element display, per [Requirement 1](tech-design-web.md#requirement-1-a-calculator-application-for-web-and-mobile). Spec: [2026-09-28-calculator-interface](2026-09-28-calculator-interface/requirements.md).
- **Done when:** A fresh clone builds, serves the keypad and display with correct accessible names, and the test suite is green.

### 2. Calculation engine core
- **Delivers:** Nothing visible yet; the pure logic that will hold what the user types.
- **Status:** done
- **Build:** DOM-free JavaScript ES module with the entry state machine and typed result/error interface, per [Requirement 1](tech-design-web.md#requirement-1-a-calculator-application-for-web-and-mobile). Spec: [2026-09-28-calculation-engine-core](2026-09-28-calculation-engine-core/requirements.md).
- **Done when:** Unit tests cover digit entry, decimal point, clear and clear-entry with no browser API imported.

### 3. Number formatting
- **Delivers:** Numbers shown with the user's locale separators and no floating-point noise.
- **Status:** planned
- **Build:** Internationalisation number-formatting with a significant-digit cap and locale minus sign, per [Requirement 2](tech-design-web.md#requirement-2-addition) and [Requirement 3](tech-design-web.md#requirement-3-subtraction).
- **Done when:** Unit tests confirm locale grouping, decimal mark, negative sign and the rounding of 0.1 + 0.2 to 0.3.

### 4. Keypad and display
- **Delivers:** The user can tap on-screen keys and see the number they are entering.
- **Status:** planned
- **Build:** Native buttons with accessible names and the HTML output element as the display, per [Requirement 1](tech-design-web.md#requirement-1-a-calculator-application-for-web-and-mobile).
- **Done when:** Component tests drive digit, decimal and clear keys through the accessibility tree and the display updates.

### 5. Addition
- **Delivers:** The user can add two numbers and chain further additions.
- **Status:** planned
- **Build:** Pure engine function wired to a plus key, per [Requirement 2](tech-design-web.md#requirement-2-addition).
- **Done when:** Engine and component tests pass for single and chained additions, including decimals.

### 6. Range check and error state
- **Delivers:** Results too large to represent show a clear error instead of nonsense, and clear recovers.
- **Status:** planned
- **Build:** Finite-number check after every operation returning a typed overflow error that the display announces, per [Requirement 2](tech-design-web.md#requirement-2-addition).
- **Done when:** Tests show an overflowing addition displays the error, blocks further operators and clears back to zero.

### 7. Subtraction
- **Delivers:** The user can subtract, enter negative numbers and toggle the sign of the current value.
- **Status:** planned
- **Build:** Pure engine function plus minus-key disambiguation and a sign-toggle key, per [Requirement 3](tech-design-web.md#requirement-3-subtraction).
- **Done when:** Tests cover subtraction, negate-before-operand, sign toggle and correctly signed display output.

### 8. Multiplication
- **Delivers:** The user can multiply two numbers.
- **Status:** planned
- **Build:** Pure engine function wired to a multiply key with a text accessible name, per [Requirement 4](tech-design-web.md#requirement-4-multiplication).
- **Done when:** Tests cover multiplication, chained operations and overflow at the representable edge.

### 9. Division
- **Delivers:** The user can divide two numbers and gets a clear message when dividing by zero.
- **Status:** planned
- **Build:** Pure engine function with a divisor check returning a typed divide-by-zero error, per [Requirement 5](tech-design-web.md#requirement-5-division).
- **Done when:** Tests cover division, non-terminating results rounded for display, and divide-by-zero error and recovery.

### 10. Physical keyboard input
- **Delivers:** The user can operate the whole calculator from a keyboard, including the numeric keypad.
- **Status:** planned
- **Build:** Keydown handling on the standard key property mapped to engine actions, per [Requirement 1](tech-design-web.md#requirement-1-a-calculator-application-for-web-and-mobile).
- **Done when:** Component tests confirm digits, four operators, Enter, Escape, Backspace and Delete all act as designed.

### 11. Responsive layout and theming
- **Delivers:** The calculator fits any screen or container, respects zoom, and follows the OS light/dark and reduced-motion settings.
- **Status:** planned
- **Build:** CSS Grid in a container-query context with logical properties, viewport meta and colour-scheme support, per [Requirement 1](tech-design-web.md#requirement-1-a-calculator-application-for-web-and-mobile).
- **Done when:** Manual check on phone and desktop widths, both colour schemes and reduced motion shows no overflow, clipping or animation.

### 12. Persistence
- **Delivers:** The last value and recent history survive a reload.
- **Status:** planned
- **Build:** Web Storage behind the MDN feature-detection guard, per [Requirement 1](tech-design-web.md#requirement-1-a-calculator-application-for-web-and-mobile).
- **Done when:** Tests show state restored after reload and identical behaviour when storage is blocked or full.

### 13. Installable PWA
- **Delivers:** The user can install the calculator on a phone or desktop and open it as a standalone app.
- **Status:** planned
- **Build:** Web app manifest with name, icons, start URL and standalone display, served over HTTPS, per [Requirement 1](tech-design-web.md#requirement-1-a-calculator-application-for-web-and-mobile).
- **Done when:** A supporting browser offers installation and the installed app launches without browser chrome.

### 14. Offline support
- **Delivers:** The installed calculator works with no network connection.
- **Status:** planned
- **Build:** Service worker precaching the static files with a versioned cache-first strategy, per [Requirement 1](tech-design-web.md#requirement-1-a-calculator-application-for-web-and-mobile).
- **Done when:** After one online visit the app loads and calculates with the network disabled, and a new deploy replaces the old cache.

### 15. Engine package for mobile
- **Delivers:** The mobile app can reuse the exact same arithmetic as the web app.
- **Status:** planned
- **Build:** Publish the engine as an internal package with no web dependencies, per [Requirement 1](tech-design-web.md#requirement-1-a-calculator-application-for-web-and-mobile).
- **Done when:** The web app consumes the engine only through the package and its tests run outside a browser.
