// Presentation wiring: forwards keypad activations to the engine and renders
// the engine's entry through the formatter into the result display.
// See specs/tech-design-web.md, Requirement 1 (presentation layer) and
// Requirement 2 (entry formatting). Touches the DOM only through the root it is given.
import { initialState, inputDigit, inputDecimal, clearEntry, clearAll } from "./engine/engine.js";
import { formatEntry } from "./format.js";

const DIGIT_KEYS = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

/** Non-digit keys that have an engine action in this feature. Others are inert. */
const KEY_ACTIONS = Object.freeze({
  decimal: inputDecimal,
  "clear-entry": clearEntry,
  "clear-all": clearAll,
});

/**
 * Wire the keypad and display found inside `root`.
 * @param {Element} root the calculator root element
 * @param {{ locale?: string }} [options] locale for formatting; defaults to the runtime locale
 */
export function mount(root, { locale } = {}) {
  const keypad = root.querySelector('[aria-label="Keypad"]');
  const display = root.querySelector('output[aria-label="Result"]');
  if (!keypad || !display) throw new Error("mount: root must contain the Keypad region and the Result output");

  let state = initialState();

  const render = () => {
    display.textContent = formatEntry(state.entry, locale);
  };

  keypad.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-key]");
    if (!button || !keypad.contains(button)) return;
    const key = button.dataset.key;
    if (DIGIT_KEYS.has(key)) {
      state = inputDigit(state, key);
    } else if (key in KEY_ACTIONS) {
      state = KEY_ACTIONS[key](state);
    } else {
      return; // operator, equals and sign keys arrive in later features
    }
    render();
  });

  render();
}
