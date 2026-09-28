import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { initialState, inputDigit, inputDecimal, inputOperator, evaluate, toggleSign, MAX_ENTRY_DIGITS, ERRORS } from "@calculator/engine";
import { formatEntry, localeTokens } from "../src/js/format.js";
import { mountPage } from "./helpers/dom.js";

const type = (s, chars) => [...chars].reduce((st, c) => (c === "." ? inputDecimal(st) : inputDigit(st, c)), s);
const op = (name) => (s) => inputOperator(s, name);
const shown = (d) => d.textContent.trim();

describe("Feature 7: subtraction (engine)", () => {
  test("A1: simple subtraction", () => {
    const s = evaluate(type(op("subtract")(type(initialState(), "12")), "30"));
    assert.equal(s.result, -18);
    assert.equal(s.display, "-18");
  });

  test("A2: mixed chain", () => {
    let s = op("subtract")(type(op("add")(type(initialState(), "10")), "5"));
    assert.equal(s.display, "15");
    assert.equal(s.operator, "subtract");
    s = evaluate(type(s, "20"));
    assert.equal(s.result, -5);
  });

  test("A3: negate before operand", () => {
    let s = op("subtract")(initialState());
    assert.equal(s.entry, "-0");
    assert.equal(s.operator, "");
    s = inputDigit(s, "5");
    assert.equal(s.entry, "-5");
    s = evaluate(type(op("add")(s), "3"));
    assert.equal(s.result, -2);
  });

  test("A4: sign toggle while typing", () => {
    const s = type(initialState(), "42");
    assert.equal(toggleSign(s).entry, "-42");
    assert.equal(toggleSign(toggleSign(s)).entry, "42");
    assert.equal(toggleSign(initialState()).entry, "-0");
    assert.equal(toggleSign(toggleSign(initialState())).entry, "0");
    assert.equal(inputDecimal(toggleSign(initialState())).entry, "-0.");
  });

  test("A5: sign toggle on a result", () => {
    const s = evaluate(type(op("add")(type(initialState(), "12")), "30"));
    const t = toggleSign(s);
    assert.equal(t.result, -42);
    assert.equal(t.display, "-42");
    assert.equal(toggleSign(t).result, 42);
  });

  test("A6: sign toggle after an operator", () => {
    let s = toggleSign(op("add")(type(initialState(), "5")));
    assert.equal(s.entry, "-0");
    assert.equal(s.typing, true);
    assert.equal(s.operator, "add");
    s = evaluate(type(s, "3"));
    assert.equal(s.result, 2);
  });

  test("A7: sign and digit limit; error state", () => {
    const s = type(toggleSign(initialState()), "123456789012");
    assert.equal(s.entry, "-123456789012");
    assert.equal(s.entry.length, MAX_ENTRY_DIGITS + 1);
    assert.equal(inputDigit(s, "3"), s);
    const err = Object.freeze({ ...initialState(), error: ERRORS.overflow, display: "overflow", typing: false });
    assert.equal(toggleSign(err), err);
  });
});

describe("Feature 7: subtraction (formatter)", () => {
  test("A8: negative entries use the locale minus", () => {
    const { minusSign, decimal } = localeTokens("sv-SE");
    assert.notEqual(minusSign, "-");
    const out = formatEntry("-12.5", "sv-SE");
    assert.ok(out.startsWith(minusSign));
    assert.doesNotMatch(out, /-/);
    assert.equal(out, `${minusSign}12${decimal}5`);
    assert.equal(formatEntry("-12.5", "en-US"), "-12.5");
    assert.equal(formatEntry("-0", "sv-SE"), `${minusSign}0`);
    assert.equal(formatEntry("-1234567", "en-US"), "-1,234,567");
  });
});

describe("Feature 7: subtraction (keypad and display)", () => {
  test("A9: subtraction on screen", async () => {
    const { display, type: t, click } = await mountPage("en-US");
    t("12"); click("Subtract"); t("30"); click("Equals");
    assert.equal(shown(display), "-18");
  });

  test("A10: negative entry on screen with locale minus", async () => {
    const { minusSign } = localeTokens("sv-SE");
    const { display, click } = await mountPage("sv-SE");
    click("Subtract"); click("5");
    assert.equal(shown(display), `${minusSign}5`);
  });

  test("A11: toggle sign on screen", async () => {
    const { display, type: t, click } = await mountPage("en-US");
    t("42"); click("Toggle sign");
    assert.equal(shown(display), "-42");
    click("Toggle sign");
    assert.equal(shown(display), "42");
  });

  test("A12: result survives pressing another operator", async () => {
    const { display, type: t, click } = await mountPage("en-US");
    t("12"); click("Subtract"); t("30"); click("Equals");
    click("Divide");
    assert.equal(shown(display), "-18");
  });
});
