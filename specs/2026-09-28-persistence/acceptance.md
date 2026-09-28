# Feature 12: Persistence — Acceptance

A1 to A3 are unit tests of the storage module; A4 to A10 are DOM tests with an in-memory fake store. All automated.

## Storage module

**A1. Availability check**
Given a store whose test write throws a security error, the check reports unavailable; given a store that throws a quota error while empty, unavailable; given a store that throws a quota error while holding data, available; given a working store, available and the probe key is removed afterwards.

**A2. Load validation**
Given documents that are not JSON, lack fields, have a non-matching entry, an unknown operator, an infinite result or malformed history, when loaded, then nothing is restored; given a valid document, the state and history are returned.

**A3. Error state not persisted**
Given a divide-by-zero error state, when saved and loaded, then the loaded state is the initial state.

## Restore

**A4. State survives a remount**
Given a page mounted with a fake store, when 1, 2, Add, 3 are activated and the page is mounted again with the same store, then the display shows "3" and pressing Equals shows "15".

**A5. Explicit state wins**
Given a store holding a saved entry of 9, when the page is mounted with a starting state of 4, then the display shows "4".

## History

**A6. History recorded and rendered**
Given a mounted page in a comma-grouping locale, when 1, 2, Add, 3, 0, Equals are activated, then the "History" region's list has one item reading "12 + 30 = 42"; after 4, Multiply, 2, Equals, the first item is "4 × 2 = 8" and the second "12 + 30 = 42".

**A7. Ten-entry cap and remount**
Given twelve completed calculations, then the list holds ten, newest first, and a remount with the same store shows the same ten.

**A8. Clear history**
Given a list with entries, when "Clear history" is activated, then the list is empty, a remount shows it empty, and the display value is unchanged; Clear all leaves history intact.

**A9. Enter on Clear history acts once**
Given the "Clear history" button focused, when Enter is dispatched on it, then the keyboard listener does not evaluate (default not prevented) and the display is unchanged.

## Degraded storage

**A10. Blocked or full storage**
Given a store whose every method throws, and separately a store whose writes throw a quota error, when the page is mounted and 1, 2, Add, 3, Equals are activated, then the display shows "15", the history item is rendered, and nothing throws.
