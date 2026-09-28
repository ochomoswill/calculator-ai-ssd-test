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
| `display` | Raw text for the interface: `entry` while typing, the raw result string when a result is on show. The formatter renders it. |
| `operator` | Pending operation name (`add`), or empty. |
| `operand` | Left operand as a full-precision number string, or empty. |
| `error` | Error kind. Empty until range and divide-by-zero checks arrive (rows 6 and 9). |
| `typing` | True while `entry` reflects input since the last operator or equals. |
| `result` | Finished value on show (a number), or `null`. When set, `display` is its raw string. |

Actions: `initialState()`, `inputDigit(state, digit)`, `inputDecimal(state)`,
`clearEntry(state)`, `clearAll()`, `inputOperator(state, name)`, `evaluate(state)`.
Operations live in one table keyed by name (`add` so far); results are kept at
full precision and rounded only by the presentation-side formatter. An entry holds at most `MAX_ENTRY_DIGITS`
digits, matching the display cap in Requirement 2 of the design.
