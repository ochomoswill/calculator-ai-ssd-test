// Presentation wiring: forwards keypad activations to the engine and renders
// the engine's entry through the formatter into the result display.
// See specs/tech-design-web.md, Requirement 1 (presentation layer) and
// Requirement 2 (entry formatting). Touches the DOM only through the root it is given.
import { initialState, inputDigit, inputDecimal, clearEntry, clearAll, inputOperator, evaluate, toggleSign, deleteLast, ERRORS } from "./engine/engine.js";
import { formatEntry, formatValue } from "./format.js";

/** User-facing text for each engine error kind. */
const ERROR_MESSAGES = Object.freeze({
  [ERRORS.overflow]: "Number too large",
  [ERRORS.divideByZero]: "Cannot divide by zero",
});

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
 * @param {{ locale?: string, state?: object }} [options] locale for formatting (defaults to the
 *   runtime locale) and an optional engine state to start from (defaults to the initial state)
 */
export function mount(root, { locale, state: startingState } = {}) {
  const keypad = root.querySelector('[aria-label="Keypad"]');
  const display = root.querySelector('output[aria-label="Result"]');
  if (!keypad || !display) throw new Error("mount: root must contain the Keypad region and the Result output");

  let state = startingState ?? initialState();

  const render = () => {
    if (state.error) {
      display.textContent = ERROR_MESSAGES[state.error] ?? state.error;
      display.setAttribute("data-error", state.error);
      return;
    }
    display.removeAttribute("data-error");
    display.textContent =
      state.result !== null ? formatValue(state.result, locale) : formatEntry(state.entry, locale);
  };

  /** Apply the action for a key identifier and re-render. Returns false for unknown identifiers. */
  const press = (key) => {
    if (DIGIT_KEYS.has(key)) {
      state = inputDigit(state, key);
    } else if (key in KEY_ACTIONS) {
      state = KEY_ACTIONS[key](state);
    } else {
      return false;
    }
    render();
    return true;
  };

  keypad.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-key]");
    if (!button || !keypad.contains(button)) return;
    press(button.dataset.key);
  });

  root.ownerDocument.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const onKeypadButton = event.target instanceof root.ownerDocument.defaultView.HTMLButtonElement && keypad.contains(event.target);
    if (onKeypadButton && (event.key === "Enter" || event.key === " ")) return; // native activation handles it
    const key = DIGIT_KEYS.has(event.key) ? event.key : KEYBOARD_KEYS[event.key];
    if (key === undefined) return;
    event.preventDefault();
    press(key);
  });

  render();
}
