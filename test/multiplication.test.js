import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { initialState, inputDigit, inputDecimal, inputOperator, evaluate, ERRORS } from "@calculator/engine";
import { formatValue } from "../src/js/format.js";
import { mountPage } from "./helpers/dom.js";

const type = (s, chars) => [...chars].reduce((st, c) => (c === "." ? inputDecimal(st) : inputDigit(st, c)), s);
const op = (name) => (s) => inputOperator(s, name);
const shown = (d) => d.textContent.trim();
const MAX = String(Number.MAX_VALUE);
const hugePending = () =>
  Object.freeze({ ...initialState(), entry: "0", operand: MAX, operator: "multiply", typing: false, result: Number.MAX_VALUE, display: MAX });

describe("Feature 8: multiplication (engine)", () => {
  test("A1: simple product", () => {
    assert.equal(evaluate(type(op("multiply")(type(initialState(), "12")), "3")).result, 36);
  });

  test("A2: decimal product with display rounding", () => {
    const s = evaluate(type(op("multiply")(type(initialState(), "1.1")), "1.1"));
    assert.equal(s.result, 1.1 * 1.1);
    assert.notEqual(s.result, 1.21);
    assert.equal(formatValue(s.result, "en-US"), "1.21");
  });

  test("A3: left-to-right chain", () => {
    const s = evaluate(type(op("multiply")(type(op("add")(type(initialState(), "2")), "3")), "4"));
    assert.equal(s.result, 20);
  });

  test("A4: overflow via equals", () => {
    const s = evaluate(inputDigit(hugePending(), "9"));
    assert.equal(s.error, ERRORS.overflow);
  });

  test("A5: overflow via chained operator", () => {
    const s = inputOperator(inputDigit(hugePending(), "9"), "add");
    assert.equal(s.error, ERRORS.overflow);
    assert.equal(s.operator, "");
  });
});

describe("Feature 8: multiplication (keypad and display)", () => {
  test("A6: product on screen", async () => {
    const { display, type: t, click } = await mountPage("en-US");
    t("12"); click("Multiply"); t("3"); click("Equals");
    assert.equal(shown(display), "36");
  });

  test("A7: overflow on screen", async () => {
    const { display, click } = await mountPage("en-US", hugePending());
    click("9"); click("Equals");
    assert.equal(shown(display), "Number too large");
  });

  test("A8: result survives pressing another operator", async () => {
    const { display, type: t, click } = await mountPage("en-US");
    t("12"); click("Multiply"); t("3"); click("Equals");
    click("Divide");
    assert.equal(shown(display), "36");
  });
});
