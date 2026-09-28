# Feature 12: Persistence — Requirements

Roadmap row 12. Branch `spec/2026-09-28-persistence`.
Design authority: [Requirement 1 of the web technical design](../tech-design-web.md#requirement-1-a-calculator-application-for-web-and-mobile) (Persistence: last display value and a short calculation history in Web Storage; MDN feature-detection pattern; every read and write guarded; identical behaviour when storage is unavailable).

## Goal

Make the calculator remember. After a reload the display shows the value it showed before, any pending operation is intact, and a short list of recent completed calculations is visible below the keypad. Storage failures of every kind (blocked, private mode with zero quota, full) leave the calculator working exactly as before, only without memory.

## Must do

### Storage module
- R1. A new presentation-side module wraps Web Storage: it implements MDN's availability check (a test write and remove, treating a quota error as available only when the store already holds data), and exposes load and save functions that never throw.
- R2. Saved data is one JSON document under a single versioned key holding the engine state and the history list.
- R3. Loading validates the shape: every engine field with its type, an entry matching the entry pattern, an operator that is empty or a known operation, a result that is empty or a finite number, and history entries with the expected fields; anything invalid yields no restored state.
- R4. An engine error state is never persisted; the initial state is saved in its place.

### History
- R5. Each completed calculation (an Equals press that produces a result) is recorded as left operand, operation, right operand and result, newest first, keeping at most ten entries.
- R6. The page gains a region named "History" containing a list; each item shows the calculation with the locale-formatted numbers and the operation glyph, for example "12 + 30 = 42", as plain text.
- R7. A "Clear history" button inside the region empties the list and the saved history; Clear all does not clear history.

### Mount and restore
- R8. The mount function accepts an optional storage object; when omitted it uses the page's local storage guarded by the availability check, and when that is unavailable it runs without persistence.
- R9. On mount, an explicit starting state takes precedence; otherwise a valid saved state and history are restored and rendered before any key is pressed.
- R10. After every action the state and history are saved; a failing save is ignored.
- R11. Enter or Space on any button, not only keypad keys, is left to the button's native activation so the keyboard listener never double-fires on the Clear history button.

### Tests
- R12. Unit tests cover the availability check with a throwing store, an empty quota-exceeded store and a populated quota-exceeded store, and load validation against malformed documents; DOM tests use an in-memory fake store to show state and history restored on a second mount, ten-entry cap, Clear history, and identical behaviour with a blocked store and a full store.

## Explicitly not included

- No sync between devices or accounts (not on the roadmap).
- No re-running a calculation from history (not on the roadmap).
- No offline caching of the app itself (row 14).
