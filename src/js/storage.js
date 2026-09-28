// Presentation-side persistence over Web Storage. Never throws: every read and
// write is guarded, and the calculator behaves identically when storage is
// unavailable. Availability follows MDN's feature-detection pattern.
// See specs/tech-design-web.md, Requirement 1 (Persistence).

export const STORAGE_KEY = "calculator.v1";
export const MAX_HISTORY = 10;

const OPERATORS = new Set(["", "add", "subtract", "multiply", "divide"]);
const ENTRY = /^-?\d+(\.\d*)?$/;

/**
 * MDN's storageAvailable check: a test write must succeed, or fail with a
 * quota error while the store already holds data.
 * @param {Storage|undefined|null} storage
 */
export function storageAvailable(storage) {
  if (!storage) return false;
  const probe = "__calculator_probe__";
  try {
    storage.setItem(probe, probe);
    storage.removeItem(probe);
    return true;
  } catch (e) {
    return (
      e instanceof Error &&
      e.name === "QuotaExceededError" &&
      typeof storage.length === "number" &&
      storage.length !== 0
    );
  }
}

/**
 * Load the saved state and history, or null when nothing valid is stored.
 * @returns {{ state: object, history: object[] } | null}
 */
export function load(storage) {
  let raw;
  try {
    raw = storage?.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (typeof raw !== "string") return null;
  let doc;
  try {
    doc = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!doc || typeof doc !== "object") return null;
  const state = validState(doc.state);
  const history = validHistory(doc.history);
  if (!state || !history) return null;
  return { state: Object.freeze(state), history };
}

/**
 * Save the state and history. Error states are replaced by the initial state
 * supplied by the caller. Failures are ignored.
 */
export function save(storage, state, history, initial) {
  const toSave = state.error ? initial : state;
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify({ state: toSave, history: history.slice(0, MAX_HISTORY) }));
  } catch {
    // Storage full, blocked or missing: persistence is best effort.
  }
}

function validState(s) {
  if (!s || typeof s !== "object") return null;
  const ok =
    typeof s.entry === "string" && ENTRY.test(s.entry) &&
    typeof s.display === "string" &&
    typeof s.operator === "string" && OPERATORS.has(s.operator) &&
    typeof s.operand === "string" && (s.operand === "" || Number.isFinite(Number(s.operand))) &&
    typeof s.error === "string" && s.error === "" &&
    typeof s.typing === "boolean" &&
    (s.result === null || (typeof s.result === "number" && Number.isFinite(s.result)));
  if (!ok) return null;
  const { entry, display, operator, operand, error, typing, result } = s;
  return { entry, display, operator, operand, error, typing, result };
}

function validHistory(h) {
  if (!Array.isArray(h)) return null;
  const items = [];
  for (const item of h.slice(0, MAX_HISTORY)) {
    if (!item || typeof item !== "object") return null;
    const { left, operator, right, result } = item;
    if (![left, right, result].every((n) => typeof n === "number" && Number.isFinite(n))) return null;
    if (typeof operator !== "string" || !OPERATORS.has(operator) || operator === "") return null;
    items.push({ left, operator, right, result });
  }
  return items;
}
