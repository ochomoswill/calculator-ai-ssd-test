import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { initialState, inputDigit, inputDecimal, inputOperator, evaluate, clearEntry, clearAll, ERRORS } from "@calculator/engine";
import { formatValue } from "../src/js/format.js";
import { mountPage } from "./helpers/dom.js";

const type = (s, chars) => [...chars].reduce((st, c) => (c === "." ? inputDecimal(st) : inputDigit(st, c)), s);
const op = (name) => (s) => inputOperator(s, name);
const shown = (d) => d.textContent.trim();

describe("Feature 9: division (engine)", () => {
  test("A1: simple quotient", () => {
    assert.equal(evaluate(type(op("divide")(type(initialState(), "12")), "3")).result, 4);
  });

  test("A2: non-terminating quotient rounded on display", () => {
    const s = evaluate(type(op("divide")(type(initialState(), "1")), "3"));
    assert.equal(s.result, 1 / 3);
    assert.equal(formatValue(s.result, "en-US"), "0." + "3".repeat(12));
  });

  test("A3: chained division", () => {
    let s = op("divide")(type(op("divide")(type(initialState(), "100")), "4"));
    assert.equal(s.display, "25");
    s = evaluate(type(s, "5"));
    assert.equal(s.result, 5);
  });

  test("A4: divide by zero via equals", () => {
    const s = evaluate(type(op("divide")(type(initialState(), "5")), "0"));
    assert.equal(s.error, ERRORS.divideByZero);
    assert.equal(s.result, null);
    assert.equal(s.display, "divide-by-zero");
  });

  test("A5: divide by zero via chained operator", () => {
    const s = op("add")(type(op("divide")(type(initialState(), "5")), "0"));
    assert.equal(s.error, ERRORS.divideByZero);
  });

  test("A6: zero divided by zero", () => {
    const s = evaluate(type(op("divide")(initialState()), "0"));
    assert.equal(s.error, ERRORS.divideByZero);
    assert.equal(s.result, null);
  });

  test("A7: recovery and kinds table", () => {
    const err = evaluate(type(op("divide")(type(initialState(), "5")), "0"));
    assert.equal(inputDigit(err, "1"), err);
    assert.equal(op("add")(err), err);
    assert.equal(evaluate(err), err);
    assert.deepEqual(clearEntry(err), initialState());
    assert.deepEqual(clearAll(err), initialState());
    assert.equal(ERRORS.divideByZero, "divide-by-zero");
  });
});

describe("Feature 9: division (keypad and display)", () => {
  test("A8: quotient on screen", async () => {
    let page = await mountPage("en-US");
    page.type("12"); page.click("Divide"); page.type("3"); page.click("Equals");
    assert.equal(shown(page.display), "4");
    page = await mountPage("en-US");
    page.type("1"); page.click("Divide"); page.type("3"); page.click("Equals");
    assert.equal(shown(page.display), "0.333333333333");
  });

  test("A9: divide by zero on screen", async () => {
    const { display, type: t, click } = await mountPage("en-US");
    t("5"); click("Divide"); t("0"); click("Equals");
    assert.equal(shown(display), "Cannot divide by zero");
    assert.equal(display.getAttribute("data-error"), "divide-by-zero");
    click("7");
    assert.equal(shown(display), "Cannot divide by zero");
    click("Clear all");
    assert.equal(shown(display), "0");
    assert.equal(display.hasAttribute("data-error"), false);
  });

  test("A10: all operation keys live", async () => {
    const { display, type: t, click } = await mountPage("en-US");
    t("8"); click("Add"); t("2"); click("Subtract"); t("1"); click("Multiply"); t("3"); click("Divide"); t("9"); click("Equals");
    assert.equal(shown(display), "3");
  });
});
