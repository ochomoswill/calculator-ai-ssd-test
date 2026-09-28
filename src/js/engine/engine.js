// Calculation engine: pure, DOM-free state machine for entry and operations.
// Every action takes a state and returns a new frozen state; inputs are never mutated.
// See specs/tech-design-web.md, Requirement 1 (engine boundary) and Requirement 2
// (number representation, full precision internally, rounding only at display).

/** Maximum digits an entry may hold, excluding a leading "0." and the decimal point. */
export const MAX_ENTRY_DIGITS = 12;

const DIGITS = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

/** Error kinds the engine can enter. The presentation layer maps them to messages. */
export const ERRORS = Object.freeze({
  overflow: "overflow",
  divideByZero: "divide-by-zero",
});

/** Operations by name. Later features add entries here. */
const OPERATIONS = Object.freeze({
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
});

/** Entry that shows a minus sign but no digits yet: the user pressed minus or toggled sign on zero. */
const NEGATIVE_ZERO = "-0";

/**
 * @typedef {object} EngineState
 * @property {string} entry    Characters typed so far, e.g. "12.5" or "-3"; "-0" is a negative placeholder.
 * @property {string} display  Raw text for the interface: entry while typing, String(result) when a result is shown.
 * @property {string} operator Pending operation name ("add") or "".
 * @property {string} operand  Left operand as a full-precision number string, or "".
 * @property {string} error    Error kind from ERRORS, or "" when no error.
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
  if (state.error) return state;
  const base = state.typing ? state : startEntry(state);
  if (base.entry === "0") return withEntry(base, digit);
  if (base.entry === NEGATIVE_ZERO) return withEntry(base, "-" + digit);
  if (countDigits(base.entry) >= MAX_ENTRY_DIGITS) return base === state ? state : base;
  return withEntry(base, base.entry + digit);
}

/** Append the decimal point if the entry has none, starting a new entry if a result is on show. */
export function inputDecimal(state) {
  if (state.error) return state;
  const base = state.typing ? state : startEntry(state);
  if (base.entry.includes(".")) return base === state ? state : base;
  return withEntry(base, base.entry + ".");
}

/** Reset the current entry only, keeping any pending operator and operand. */
export function clearEntry(state) {
  if (state.error) return initialState();
  return freeze({ ...state, entry: "0", display: "0", typing: true, result: null });
}

/** Remove the last typed character while typing; an emptied entry becomes zero. */
export function deleteLast(state) {
  if (state.error || !state.typing) return state;
  const shorter = state.entry.slice(0, -1);
  return withEntry(state, shorter === "" || shorter === "-" ? "0" : shorter);
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
  if (state.error) return state;
  if (operation === "subtract" && isUntouched(state)) return withEntry(state, NEGATIVE_ZERO);
  if (state.operator && !state.typing) {
    return state.operator === operation ? state : freeze({ ...state, operator: operation });
  }
  if (!state.operator) {
    const value = currentValue(state);
    return showResult(state, value, { operator: operation, operand: String(value) });
  }
  const outcome = compute(state);
  if (outcome.error) return errorState(outcome.error);
  return showResult(state, outcome.value, { operator: operation, operand: String(outcome.value) });
}

/**
 * Flip the sign of the entry while typing, of a finished result when nothing is
 * pending, or start a negative entry when an operation is pending and nothing is typed.
 */
export function toggleSign(state) {
  if (state.error) return state;
  if (state.typing) {
    const entry = state.entry.startsWith("-") ? state.entry.slice(1) : "-" + state.entry;
    return withEntry(state, entry);
  }
  if (state.operator) return withEntry(startEntry(state), NEGATIVE_ZERO);
  const value = state.result === 0 ? 0 : -state.result;
  return showResult(state, value, {});
}

/** Compute the pending operation and show its result. */
export function evaluate(state) {
  if (state.error || !state.operator) return state;
  const outcome = compute(state);
  if (outcome.error) return errorState(outcome.error);
  return showResult(state, outcome.value, { operator: "", operand: "" });
}

/** Run the pending operation. Returns { value } or { error } without ever producing a non-finite value in state. */
function compute(state) {
  const left = Number(state.operand);
  const right = state.typing ? Number(state.entry) : currentValue(state);
  if (state.operator === "divide" && right === 0) return { error: ERRORS.divideByZero };
  return { value: OPERATIONS[state.operator](left, right) };
}

function currentValue(state) {
  return state.result ?? Number(state.entry);
}

function showResult(state, value, fields) {
  if (!Number.isFinite(value)) return errorState(ERRORS.overflow);
  return freeze({ ...state, ...fields, entry: "0", display: String(value), typing: false, result: value });
}

function errorState(kind) {
  return freeze({ ...initialState(), error: kind, display: kind, typing: false });
}

function startEntry(state) {
  return freeze({ ...state, entry: "0", display: "0", typing: true, result: null });
}

function withEntry(state, entry) {
  return freeze({ ...state, entry, display: entry });
}

function isUntouched(state) {
  return !state.operator && state.result === null && state.typing && state.entry === "0";
}

function countDigits(rawEntry) {
  const entry = rawEntry.startsWith("-") ? rawEntry.slice(1) : rawEntry;
  const significant = entry.startsWith("0.") ? entry.slice(2) : entry;
  return significant.replace(".", "").length;
}

function freeze(state) {
  return Object.freeze(state);
}
