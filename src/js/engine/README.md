# Calculation engine

The DOM-free calculation engine described in
[Requirement 1 of the technical design](../../../specs/tech-design-web.md#requirement-1-a-calculator-application-for-web-and-mobile).

Nothing in this folder may touch `document`, `window`, `navigator`, storage,
timers or any other browser API. The engine is plain JavaScript so it can be
reused unchanged by a mobile app.

## `engine.js`

Every exported action is a pure function: it takes a state and returns a new,
frozen state. Inputs are never mutated.

State fields:

| Field | Meaning |
|---|---|
| `entry` | Characters typed so far, such as `12.5`. Starts as `0`. |
| `display` | Text the interface shows. Equals `entry` until formatting arrives (roadmap row 3). |
| `operator` | Pending operator. Empty until operations arrive (rows 5 to 9). |
| `operand` | Stored operand. Empty until operations arrive. |
| `error` | Error kind. Empty until range and divide-by-zero checks arrive (rows 6 and 9). |

Actions: `initialState()`, `inputDigit(state, digit)`, `inputDecimal(state)`,
`clearEntry(state)`, `clearAll()`. An entry holds at most `MAX_ENTRY_DIGITS`
digits, matching the display cap in Requirement 2 of the design.
