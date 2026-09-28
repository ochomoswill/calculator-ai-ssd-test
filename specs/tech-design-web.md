# Technical Design — Web Calculator

Source: `specs/brief.md`. This document covers the web application. It also states how the web design keeps the door open for the mobile app the brief asks for, without designing that app here.

Every standards claim below was checked against MDN Web Docs on 2026-09-28 through the MDN MCP server. The MDN pages consulted are listed at the end of each section.

The brief contains five requirements: the application must run on web and mobile, and it must support addition, subtraction, multiplication and division. Each requirement has its own section with the implementation decision for it.

---

## Requirement 1: A calculator application for web (and mobile)

### Implementation decision

The web application will be a Progressive Web App (PWA) built with React and TypeScript. It is served as a single static bundle with no server-side calculation: every operation runs in the browser.

The application is split into two layers with a hard boundary between them:

- **A calculation engine** with no dependency on the DOM, React, or any browser API. It exposes a small, pure interface: it takes an operation and two operands and returns either a result or a typed error. It also owns the state machine for keypad entry (current operand, pending operator, display value).
- **A presentation layer** (React components) that renders the display and keypad and forwards user input to the engine.

This boundary is the main concession to the "mobile" half of the brief. Because the engine is plain TypeScript, it can be published as an internal package and consumed unchanged by a React Native app later, so the two apps never disagree on an answer. The web app itself also installs on phones as a PWA, which gives an installable, offline-capable mobile experience before a native app exists.

**Installability.** MDN lists the installability prerequisites, and the design meets all of them: the app is served over HTTPS, and every page links a web app manifest that provides a name and short name, a start URL, icons at both 192 and 512 pixels, and a display mode of "standalone" so the installed app opens in its own window without browser chrome. A service worker is not required for installability, but is added for the offline behaviour below.

**Offline operation.** A service worker precaches the whole static bundle during its install step using the Cache interface, then serves requests with the cache-first strategy MDN documents: answer from the cache if present, otherwise fetch from the network and store the response for next time. A calculator has no remote data, so this makes the entire app work with no connectivity after the first visit. Cache names are versioned so a new deployment can discard the previous bundle.

**Display element.** The calculator's result display is the HTML output element. MDN describes it as the container for "the results of a calculation", and it carries an implicit ARIA role of status, which is a polite, atomic live region. Screen readers therefore announce each new result without focus leaving the keypad, and the app does not need hand-written live-region attributes. Because live-region updates are announced as plain text, the display holds only the formatted value or error message and no nested controls.

**Keypad.** Every key is a native button with an explicit type of "button" so it has no form-submission behaviour, and a text-based accessible name (visually hidden where the visible label is a symbol). MDN's keyboard-accessibility guidance states that native interactive elements are already keyboard accessible and are the fastest path to a keyboard-operable component, so no custom focus management or positive tab-index values are used. Keys are spaced apart, per MDN's note on grouped interactive content and motor-control needs.

**Physical keyboard.** The app listens for the keydown event and reads the key property of the keyboard event, which MDN documents as the standard replacement for the deprecated key-code and key-identifier properties. MDN's key-value tables confirm that modern browsers report numeric-keypad operators as the actual characters plus, minus, asterisk and slash, and that Enter, Escape, Backspace and Delete have stable named values. Those map to evaluate, clear all, delete last digit and clear entry respectively.

**Layout.** The keypad is laid out with CSS Grid. The calculator root declares an inline-size containment context so container queries can reflow the keypad based on the width of the calculator itself rather than the viewport, which lets the same component work embedded at any size. Spacing and alignment use logical properties so the layout is correct in right-to-left locales. The viewport meta tag sets the width to the device width and does not disable user scaling; MDN warns that disabling zoom prevents people with low vision from reading the page.

**Theme and motion.** The root element declares that it supports both light and dark colour schemes, which makes form controls, scrollbars and system colours follow the operating-system theme. The app's own colours switch on the prefers-color-scheme media feature, and non-essential transitions are removed under prefers-reduced-motion.

**Persistence.** The last display value and a short calculation history are stored in Web Storage (localStorage). MDN documents that access can throw a security error when the origin is invalid or the user has blocked data persistence, that private browsing may give a store with zero quota, and that writes can fail with a quota error. The app therefore uses MDN's feature-detection pattern before first use and wraps every read and write, so the calculator works identically when storage is unavailable.

**Testing.** The engine is covered by unit tests with exhaustive cases per operation. The presentation layer is covered by component tests that drive the keypad through the accessibility tree (roles and names) rather than CSS selectors, so the tests fail if the accessible names regress.

MDN references: Making PWAs installable; Web app manifest `display` member; Offline and background operation (Service Worker API, Cache); `<output>` element; ARIA `status` role; `<button>` element; Keyboard-navigable JavaScript widgets; `KeyboardEvent` and `KeyboardEvent.key`; Key values for keyboard events; CSS container queries; CSS logical properties and values; `<meta name="viewport">`; `color-scheme`; `prefers-color-scheme`; `prefers-reduced-motion`; `Window.localStorage`; Using the Web Storage API.

---

## Requirement 2: Addition

### Implementation decision

Addition is implemented in the calculation engine as a single pure function over two operands. Three decisions made here apply to every operation.

**Number representation.** Operands are JavaScript numbers, which MDN defines as IEEE 754 double-precision 64-bit values with roughly 15 to 17 significant decimal digits of precision. The engine does not emulate arbitrary precision. MDN documents the consequence directly: 0.1 plus 0.2 is not exactly 0.3, because binary floating point cannot represent 0.1. The engine therefore keeps the full-precision value internally for chained calculations and rounds only at display time, so error does not accumulate through repeated rounding.

**Display formatting.** All values are formatted through the internationalisation number-formatting API. It is configured with a maximum number of significant digits (12, comfortably below the 15-to-17 digit precision limit) so floating-point artefacts never reach the screen, and the same call applies the locale's grouping separator and decimal mark. The engine never formats numbers itself.

**Range.** After every operation the engine checks the result with the standard finite-number test. MDN documents that a magnitude above the largest representable number becomes positive or negative infinity, and the finite test rejects infinity and not-a-number values. Any non-finite result is returned as a typed "overflow" error and the display shows an error state until the user clears. Integers are only exact up to the safe-integer limit (2 to the power 53, minus 1); this is accepted as a documented limitation of a basic calculator and is not treated as an error.

Addition has no failure cases of its own beyond range. Keypad entry accepts the on-screen plus key and, from a physical keyboard, the plus character from either the main row or the numeric keypad.

MDN references: `Number`; `Number.EPSILON` (floating-point equality discussion); `Number.isFinite()`; `Number.MAX_VALUE`; `Number.MAX_SAFE_INTEGER`; `Intl.NumberFormat()` constructor (`maximumSignificantDigits`, `useGrouping`).

---

## Requirement 3: Subtraction

### Implementation decision

Subtraction follows the same pure-function shape as addition, with the same representation, formatting and range rules.

The decision specific to subtraction is how the minus key is disambiguated. The same key means "subtract" when an operand has already been entered and "negate" when no operand has been started. The engine's entry state machine makes that decision so the presentation layer contains no arithmetic logic. A dedicated sign-toggle key is also provided on the keypad so the user never has to rely on the ambiguous form.

Negative results are formatted by the internationalisation number-formatting API, whose sign-display option controls when a sign is shown and whose parts output exposes the minus sign as its own locale-specific token. The app therefore never inserts an ASCII hyphen by hand, and the output element announces the sign as part of the value.

MDN references: `Intl.NumberFormat()` constructor (`signDisplay`); `Intl.NumberFormat.prototype.formatToParts()` (`minusSign` part); `<output>` element.

---

## Requirement 4: Multiplication

### Implementation decision

Multiplication follows the same pure-function shape, with the same representation, formatting and range rules. Overflow to infinity is more likely here than in addition, so the finite-number check is the primary failure path and is tested with operands at the edge of the representable range.

The keypad renders the conventional multiplication-sign glyph on the button with a text accessible name of "multiply", following MDN's guidance that icon-only buttons need an accessible name, so a screen reader user hears the operation rather than a symbol name. Physical keyboard input accepts the asterisk character (which MDN confirms is what the numeric keypad's multiply key reports in modern browsers) and the letter x.

MDN references: `<button>` element (icon buttons and accessible names); Key values for keyboard events; `Number.isFinite()`.

---

## Requirement 5: Division

### Implementation decision

Division follows the same pure-function shape, with the same representation, formatting and range rules, and adds one explicit failure case: division by zero.

MDN documents that number division by zero returns positive or negative infinity rather than throwing, and zero divided by zero returns not-a-number. The engine checks the divisor before the operator runs and returns a typed "divide by zero" error instead. This is deliberate: those built-in values would otherwise propagate silently into chained calculations and persisted history. The display shows a clear error message, the output element announces it, and any further operator key is ignored until the user clears. Clearing returns the engine to its initial state.

Non-terminating results such as one divided by three are shown rounded by the formatter's significant-digit limit, with the full-precision value retained internally for any following operation.

The keypad renders the conventional division-sign glyph with a text accessible name of "divide". Physical keyboard input accepts the forward slash, which MDN confirms is the value reported by both the main-row and numeric-keypad divide keys.

MDN references: Division operator (`/`); `Number.isFinite()`; `NaN`; Key values for keyboard events; `<output>` element.

---

## Key design decisions

- The calculation engine is pure TypeScript with no browser or React dependency, so the mobile app can reuse it unchanged and both platforms compute identical results.
- The web app ships as a Progressive Web App that meets MDN's installability prerequisites (HTTPS, manifest with name, icons, start URL and standalone display) and adds a cache-first service worker for full offline use.
- Arithmetic uses standard IEEE 754 numbers with full precision kept internally and rounding applied only at display time, hiding binary floating-point artefacts without accumulating error.
- All number formatting goes through the internationalisation number-formatting API, which supplies significant-digit rounding, locale separators and the locale minus sign in one place.
- Division by zero and non-finite results are typed errors returned by the engine, never the language's infinity or not-a-number values, so bad states cannot leak into history or later calculations.
- The result display is the HTML output element, whose implicit status role gives a polite live region for screen readers with no custom ARIA.
- The keypad is built from native buttons with explicit text accessible names, which gives keyboard, touch and screen-reader support through the platform rather than custom code.
- Physical keyboard handling uses the keydown event and the standard key property, mapping the character values modern browsers report for both the main row and the numeric keypad.
- Layout uses CSS Grid inside a container-query context, keeps user zoom enabled, and honours the operating-system colour scheme and reduced-motion preferences by default.
- Persistence uses Web Storage behind MDN's feature-detection pattern, so the app degrades gracefully when storage is blocked, full or absent.
