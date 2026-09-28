// Calculation engine: pure, DOM-free state machine for entry and operations.
// Every action takes a state and returns a new frozen state; inputs are never mutated.
// See specs/tech-design-web.md, Requirement 1 (engine boundary) and Requirement 2
// (number representation, full precision internally, rounding only at display).

/** Maximum digits an entry may hold, excluding a leading "0." and the decimal point. */
export const MAX_ENTRY_DIGITS = 12;

const DIGITS = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

/** Operations by name. Later features add entries here. */
const OPERATIONS = Object.freeze({
  add: (a, b) => a + b,
});

/**
 * @typedef {object} EngineState
 * @property {string} entry    Characters typed so far, e.g. "12.5".
 * @property {string} display  Raw text for the interface: entry while typing, String(result) when a result is shown.
 * @property {string} operator Pending operation name ("add") or "".
 * @property {string} operand  Left operand as a full-precision number string, or "".
 * @property {string} error    Error kind; empty until range/zero checks arrive.
 * @property {boolean} typing  True when entry reflects input since the last operator/equals.
 * @property {number|null} result Finished value on show, or null.
 */

/** @returns {Readonly<EngineState>} */
export function initialState() {
  return freeze({ entry: "0", display: "0", operator: "", operand: "", error: "", typing: true, result: null });
}

/** Append a digit to the entry, starting a new entry if a result is on show. */
export function inputDigit(state, digit) {
  if (typeof digit !== "string" || !DIGITS.has(digit)) {
    throw new RangeError(`inputDigit expects a single digit character, got ${JSON.stringify(digit)}`);
  }
  const base = state.typing ? state : startEntry(state);
  if (base.entry === "0") return withEntry(base, digit);
  if (countDigits(base.entry) >= MAX_ENTRY_DIGITS) return base === state ? state : base;
  return withEntry(base, base.entry + digit);
}

/** Append the decimal point if the entry has none, starting a new entry if a result is on show. */
export function inputDecimal(state) {
  const base = state.typing ? state : startEntry(state);
  if (base.entry.includes(".")) return base === state ? state : base;
  return withEntry(base, base.entry + ".");
}

/** Reset the current entry only, keeping any pending operator and operand. */
export function clearEntry(state) {
  return freeze({ ...state, entry: "0", display: "0", typing: true, result: null });
}

/** Return to the initial state. */
export function clearAll() {
  return initialState();
}

/**
 * Record a pending operation, computing any previous pending one first.
 * @param {EngineState} state
 * @param {string} operation a key of OPERATIONS
 */
export function inputOperator(state, operation) {
  if (!Object.hasOwn(OPERATIONS, operation)) {
    throw new RangeError(`inputOperator expects one of ${Object.keys(OPERATIONS).join(", ")}, got ${JSON.stringify(operation)}`);
  }
  if (state.operator && !state.typing) {
    return state.operator === operation ? state : freeze({ ...state, operator: operation });
  }
  const value = state.operator ? compute(state) : currentValue(state);
  return showResult(state, value, { operator: operation, operand: String(value) });
}

/** Compute the pending operation and show its result. */
export function evaluate(state) {
  if (!state.operator) return state;
  const value = compute(state);
  return showResult(state, value, { operator: "", operand: "" });
}

function compute(state) {
  const left = Number(state.operand);
  const right = state.typing ? Number(state.entry) : currentValue(state);
  return OPERATIONS[state.operator](left, right);
}

function currentValue(state) {
  return state.result ?? Number(state.entry);
}

function showResult(state, value, fields) {
  return freeze({ ...state, ...fields, entry: "0", display: String(value), typing: false, result: value });
}

function startEntry(state) {
  return freeze({ ...state, entry: "0", display: "0", typing: true, result: null });
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
