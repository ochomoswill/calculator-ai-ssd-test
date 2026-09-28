import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { initialState, inputDigit, inputDecimal, clearEntry, clearAll, inputOperator, evaluate } from "../src/js/engine/engine.js";
import { formatValue } from "../src/js/format.js";
import { mountPage } from "./helpers/dom.js";

const type = (state, chars) =>
  [...chars].reduce((s, c) => (c === "." ? inputDecimal(s) : inputDigit(s, c)), state);
const add = (s) => inputOperator(s, "add");
const shown = (d) => d.textContent.trim();

describe("Feature 5: addition (engine)", () => {
  test("A1: new fields", () => {
    const s = initialState();
    assert.equal(s.typing, true);
    assert.equal(s.result, null);
    assert.deepEqual(Object.keys(s).sort(), ["display", "entry", "error", "operand", "operator", "result", "typing"]);
  });

  test("A2: operator accepts only add", () => {
    const s = type(initialState(), "1");
    assert.throws(() => inputOperator(s, "divide"), RangeError);
    assert.throws(() => inputOperator(s, "x"), RangeError);
    assert.doesNotThrow(() => inputOperator(s, "add"));
  });

  test("A3: add stores the operand", () => {
    const s = add(type(initialState(), "12"));
    assert.equal(s.operand, "12");
    assert.equal(s.operator, "add");
    assert.equal(s.display, "12");
    assert.equal(s.result, 12);
    assert.equal(s.entry, "0");
    assert.equal(s.typing, false);
  });

  test("A4: simple sum", () => {
    const s = evaluate(type(add(type(initialState(), "12")), "30"));
    assert.equal(s.result, 42);
    assert.equal(s.display, "42");
    assert.equal(s.operator, "");
    assert.equal(s.operand, "");
    assert.equal(s.typing, false);
  });

  test("A5: chained additions", () => {
    let s = add(type(add(type(initialState(), "1")), "2"));
    assert.equal(s.display, "3");
    assert.equal(s.operator, "add");
    assert.equal(s.operand, "3");
    s = evaluate(type(s, "4"));
    assert.equal(s.result, 7);
  });

  test("A6: repeated add without typing", () => {
    const once = add(type(initialState(), "5"));
    assert.deepEqual(add(once), once);
  });

  test("A7: equals without pending operation", () => {
    const s = type(initialState(), "7");
    assert.equal(evaluate(s), s);
  });

  test("A8: equals without a second number", () => {
    assert.equal(evaluate(add(type(initialState(), "5"))).result, 10);
  });

  test("A9: full precision internally, rounding on display", () => {
    const s = evaluate(type(add(type(initialState(), "0.1")), "0.2"));
    assert.equal(s.result, 0.1 + 0.2);
    assert.notEqual(s.result, 0.3);
    assert.equal(s.display, String(0.1 + 0.2));
    assert.equal(formatValue(s.result, "en-US"), "0.3");
  });

  test("A10: continuing after a result", () => {
    const shownResult = evaluate(type(add(type(initialState(), "12")), "30"));
    const typed = inputDigit(shownResult, "7");
    assert.equal(typed.entry, "7");
    assert.equal(typed.result, null);
    assert.equal(inputDecimal(shownResult).entry, "0.");
    const chained = add(shownResult);
    assert.equal(chained.operand, "42");
    const pending = type(add(type(initialState(), "1")), "2");
    const cleared = clearEntry(add(pending));
    assert.equal(cleared.entry, "0");
    assert.equal(cleared.result, null);
    assert.equal(cleared.operator, "add");
    assert.deepEqual(clearAll(shownResult), initialState());
  });
});

describe("Feature 5: addition (keypad and display)", () => {
  test("A11: add and equals on screen", async () => {
    const { display, type: t, click } = await mountPage("en-US");
    t("12"); click("Add"); t("30"); click("Equals");
    assert.equal(shown(display), "42");
  });

  test("A12: chained on screen", async () => {
    const { display, type: t, click } = await mountPage("en-US");
    t("1"); click("Add"); t("2"); click("Add");
    assert.equal(shown(display), "3");
    t("4"); click("Equals");
    assert.equal(shown(display), "7");
  });

  test("A13: decimal sum on screen", async () => {
    for (const [locale, expected] of [["en-US", "0.3"], ["de-DE", "0,3"]]) {
      const { display, type: t, click } = await mountPage(locale);
      t(".1"); click("Add"); t(".2"); click("Equals");
      assert.equal(shown(display), expected, locale);
    }
  });

  test("A14: remaining keys inert", async () => {
    const { display, type: t, click } = await mountPage("en-US");
    t("12"); click("Add"); t("30"); click("Equals");
    for (const name of ["Divide"]) {
      assert.doesNotThrow(() => click(name));
      assert.equal(shown(display), "42", name);
    }
  });
});
