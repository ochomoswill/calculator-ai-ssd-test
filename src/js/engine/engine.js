// Calculation engine: pure, DOM-free entry state machine.
// Every action takes a state and returns a new state; inputs are never mutated.
// See specs/tech-design-web.md, Requirement 1 (engine boundary) and Requirement 2
// (number representation and the 12 significant-digit display cap).

/** Maximum digits an entry may hold, excluding a leading "0." and the decimal point. */
export const MAX_ENTRY_DIGITS = 12;

const DIGITS = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

/**
 * @typedef {object} EngineState
 * @property {string} entry    Characters typed so far, e.g. "12.5".
 * @property {string} display  Text the interface shows; equals entry in this feature.
 * @property {string} operator Pending operator; empty until operations arrive.
 * @property {string} operand  Stored operand; empty until operations arrive.
 * @property {string} error    Error kind; empty until range/zero checks arrive.
 */

/** @returns {Readonly<EngineState>} */
export function initialState() {
  return freeze({ entry: "0", display: "0", operator: "", operand: "", error: "" });
}

/**
 * Append a digit to the entry.
 * @param {EngineState} state
 * @param {string} digit a single character "0" to "9"
 */
export function inputDigit(state, digit) {
  if (typeof digit !== "string" || !DIGITS.has(digit)) {
    throw new RangeError(`inputDigit expects a single digit character, got ${JSON.stringify(digit)}`);
  }
  if (state.entry === "0") return withEntry(state, digit);
  if (countDigits(state.entry) >= MAX_ENTRY_DIGITS) return state;
  return withEntry(state, state.entry + digit);
}

/** Append the decimal point if the entry has none. */
export function inputDecimal(state) {
  if (state.entry.includes(".")) return state;
  return withEntry(state, state.entry + ".");
}

/** Reset the current entry only, keeping every other field. */
export function clearEntry(state) {
  return withEntry(state, "0");
}

/** Return to the initial state. */
export function clearAll() {
  return initialState();
}

function withEntry(state, entry) {
  return freeze({ ...state, entry, display: entry });
}

function countDigits(entry) {
  const significant = entry.startsWith("0.") ? entry.slice(2) : entry;
  return significant.replace(".", "").length;
}

function freeze(state) {
  return Object.freeze(state);
}
