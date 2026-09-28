import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { initialState, inputDigit, inputDecimal, clearEntry, clearAll, inputOperator, evaluate, ERRORS } from "@calculator/engine";
import { mountPage } from "./helpers/dom.js";

const MAX = String(Number.MAX_VALUE);
/** A pending addition with the largest representable number stored and on show, so Equals adds it to itself. */
const nearOverflow = () =>
  Object.freeze({ ...initialState(), entry: "0", operand: MAX, operator: "add", typing: false, result: Number.MAX_VALUE, display: MAX });
const shown = (d) => d.textContent.trim();

describe("Feature 6: range check (engine)", () => {
  test("A1: overflow enters the error state", () => {
    const s = evaluate(nearOverflow());
    assert.equal(s.error, ERRORS.overflow);
    assert.equal(s.result, null);
    assert.equal(s.operator, "");
    assert.equal(s.operand, "");
    assert.equal(s.entry, "0");
    assert.equal(s.typing, false);
    assert.equal(s.display, "overflow");
  });

  test("A2: chained operator with nothing typed keeps the pending addition", () => {
    const s = nearOverflow();
    assert.equal(inputOperator(s, "add"), s);
    assert.equal(s.error, "");
  });

  test("A3: entry, operator and equals are ignored in error", () => {
    const err = evaluate(nearOverflow());
    assert.equal(inputDigit(err, "5"), err);
    assert.equal(inputDecimal(err), err);
    assert.equal(inputOperator(err, "add"), err);
    assert.equal(evaluate(err), err);
  });

  test("A4: clears recover", () => {
    const err = evaluate(nearOverflow());
    assert.deepEqual(clearEntry(err), initialState());
    assert.deepEqual(clearAll(err), initialState());
  });

  test("A5: kinds table", () => {
    assert.ok(Object.isFrozen(ERRORS));
    assert.equal(ERRORS.overflow, "overflow");
  });
});

describe("Feature 6: range check (keypad and display)", () => {
  test("A6: overflow message on screen", async () => {
    const { display, click } = await mountPage("en-US", nearOverflow());
    click("Equals");
    assert.equal(shown(display), "Number too large");
    assert.equal(display.getAttribute("data-error"), "overflow");
  });

  test("A7: keys ignored on screen", async () => {
    const { display, click } = await mountPage("en-US", nearOverflow());
    click("Equals");
    for (const name of ["5", "Decimal point", "Add", "Equals"]) {
      click(name);
      assert.equal(shown(display), "Number too large", name);
    }
  });

  test("A8: clear recovers on screen", async () => {
    for (const clear of ["Clear entry", "Clear all"]) {
      const { display, click } = await mountPage("en-US", nearOverflow());
      click("Equals");
      click(clear);
      assert.equal(shown(display), "0", clear);
      assert.equal(display.hasAttribute("data-error"), false, clear);
    }
  });

  test("A9: starting state option", async () => {
    const withState = await mountPage("en-US", { ...initialState(), entry: "42", display: "42" });
    assert.equal(shown(withState.display), "42");
    const plain = await mountPage("en-US");
    assert.equal(shown(plain.display), "0");
  });
});
