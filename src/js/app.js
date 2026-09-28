// Presentation wiring: forwards keypad activations to the engine and renders
// the engine's entry through the formatter into the result display.
// See specs/tech-design-web.md, Requirement 1 (presentation layer) and
// Requirement 2 (entry formatting). Touches the DOM only through the root it is given.
import { initialState, inputDigit, inputDecimal, clearEntry, clearAll, inputOperator, evaluate, toggleSign, deleteLast, ERRORS } from "@calculator/engine";
import { formatEntry, formatValue } from "./format.js";
import { storageAvailable, load, save, MAX_HISTORY } from "./storage.js";

/** User-facing text for each engine error kind. */
const ERROR_MESSAGES = Object.freeze({
  [ERRORS.overflow]: "Number too large",
  [ERRORS.divideByZero]: "Cannot divide by zero",
});

/** Glyphs for history lines. */
const OPERATOR_GLYPHS = Object.freeze({ add: "+", subtract: "\u2212", multiply: "\u00D7", divide: "\u00F7" });

const DIGIT_KEYS = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

/** Non-digit keys that have an engine action in this feature. Others are inert. */
const KEY_ACTIONS = Object.freeze({
  decimal: inputDecimal,
  "clear-entry": clearEntry,
  "clear-all": clearAll,
  add: (state) => inputOperator(state, "add"),
  subtract: (state) => inputOperator(state, "subtract"),
  multiply: (state) => inputOperator(state, "multiply"),
  divide: (state) => inputOperator(state, "divide"),
  "toggle-sign": toggleSign,
  equals: evaluate,
  "delete-last": deleteLast,
});

/** Physical keyboard keys (KeyboardEvent.key) to key identifiers. Digits map to themselves. */
const KEYBOARD_KEYS = Object.freeze({
  ".": "decimal",
  ",": "decimal",
  "+": "add",
  "-": "subtract",
  "*": "multiply",
  x: "multiply",
  X: "multiply",
  "/": "divide",
  Enter: "equals",
  "=": "equals",
  Escape: "clear-all",
  Delete: "clear-entry",
  Backspace: "delete-last",
});

/**
 * Wire the keypad and display found inside `root`.
 * @param {Element} root the calculator root element
 * @param {{ locale?: string, state?: object, storage?: Storage|null }} [options] locale for
 *   formatting (defaults to the runtime locale); an engine state to start from (defaults to the
 *   saved state, else the initial state); a Web Storage object (defaults to the page's local
 *   storage when available, else no persistence)
 */
export function mount(root, { locale, state: startingState, storage: givenStorage } = {}) {
  const keypad = root.querySelector('[aria-label="Keypad"]');
  const display = root.querySelector('output[aria-label="Result"]');
  const historyList = root.querySelector(".history-list");
  const clearHistoryButton = root.querySelector('[data-action="clear-history"]');
  if (!keypad || !display) throw new Error("mount: root must contain the Keypad region and the Result output");

  const storage = givenStorage !== undefined ? givenStorage : defaultStorage(root);
  const saved = storageAvailable(storage) ? load(storage) : null;
  let state = startingState ?? saved?.state ?? initialState();
  let history = saved?.history ?? [];

  const renderHistory = () => {
    if (!historyList) return;
    historyList.replaceChildren(
      ...history.map((item) => {
        const li = root.ownerDocument.createElement("li");
        li.textContent = `${formatValue(item.left, locale)} ${OPERATOR_GLYPHS[item.operator]} ${formatValue(item.right, locale)} = ${formatValue(item.result, locale)}`;
        return li;
      }),
    );
  };

  const render = () => {
    if (state.error) {
      display.textContent = ERROR_MESSAGES[state.error] ?? state.error;
      display.setAttribute("data-error", state.error);
    } else {
      display.removeAttribute("data-error");
      display.textContent =
        state.result !== null ? formatValue(state.result, locale) : formatEntry(state.entry, locale);
    }
    renderHistory();
    save(storage, state, history, initialState());
  };

  /** Record a completed calculation when Equals produces a result. */
  const recordIfEvaluated = (before, after) => {
    if (!before.operator || after.error || after.result === null || after.operator) return;
    const right = before.typing ? Number(before.entry) : before.result ?? Number(before.entry);
    history = [{ left: Number(before.operand), operator: before.operator, right, result: after.result }, ...history].slice(0, MAX_HISTORY);
  };

  /** Apply the action for a key identifier and re-render. Returns false for unknown identifiers. */
  const press = (key) => {
    const before = state;
    if (DIGIT_KEYS.has(key)) {
      state = inputDigit(state, key);
    } else if (key in KEY_ACTIONS) {
      state = KEY_ACTIONS[key](state);
    } else {
      return false;
    }
    if (key === "equals") recordIfEvaluated(before, state);
    render();
    return true;
  };

  clearHistoryButton?.addEventListener("click", () => {
    history = [];
    render();
  });

  keypad.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-key]");
    if (!button || !keypad.contains(button)) return;
    press(button.dataset.key);
  });

  root.ownerDocument.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const onButton = event.target instanceof root.ownerDocument.defaultView.HTMLButtonElement;
    if (onButton && (event.key === "Enter" || event.key === " ")) return; // native activation handles it
    const key = DIGIT_KEYS.has(event.key) ? event.key : KEYBOARD_KEYS[event.key];
    if (key === undefined) return;
    event.preventDefault();
    press(key);
  });

  render();
}

/** The page's local storage, or null when access throws (blocked origin, policy). */
function defaultStorage(root) {
  try {
    return root.ownerDocument.defaultView.localStorage ?? null;
  } catch {
    return null;
  }
}
