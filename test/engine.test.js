import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  MAX_ENTRY_DIGITS,
  initialState,
  inputDigit,
  inputDecimal,
  clearEntry,
  clearAll,
} from "@calculator/engine";

const type = (state, chars) =>
  [...chars].reduce((s, c) => (c === "." ? inputDecimal(s) : inputDigit(s, c)), state);

describe("Feature 2: calculation engine core", () => {
  test("A1: module has no browser dependency", async () => {
    assert.equal(typeof globalThis.document, "undefined");
    assert.equal(typeof globalThis.window, "undefined");
    const source = await readFile(new URL("../src/js/engine/engine.js", import.meta.url), "utf8");
    for (const banned of ["document", "window", "navigator", "localStorage", "sessionStorage", "setTimeout", "setInterval", "requestAnimationFrame"]) {
      assert.doesNotMatch(source, new RegExp(`\\b${banned}\\b`), `engine must not reference ${banned}`);
    }
  });

  test("A2: actions are pure", () => {
    const start = type(initialState(), "12");
    const snapshot = { ...start };
    const once = inputDigit(start, "3");
    const twice = inputDigit(start, "3");
    assert.notEqual(once, start);
    assert.deepEqual(start, snapshot);
    assert.deepEqual(once, twice);
    assert.notEqual(inputDecimal(start), start);
    assert.notEqual(clearEntry(start), start);
    assert.deepEqual(start, snapshot);
  });

  test("A3: initial state is frozen", () => {
    const state = initialState();
    assert.ok(Object.isFrozen(state));
    assert.throws(() => {
      "use strict";
      state.entry = "9";
    }, TypeError);
    assert.equal(state.entry, "0");
  });

  test("A4: initial state fields", () => {
    assert.deepEqual(initialState(), { entry: "0", display: "0", operator: "", operand: "", error: "", typing: true, result: null });
  });

  test("A5: display mirrors entry", () => {
    for (const seq of ["7", "789", "0.3", "12.5", "100", "0"]) {
      const state = type(initialState(), seq);
      assert.equal(state.display, state.entry);
    }
  });

  test("A6: first digit replaces zero", () => {
    assert.equal(inputDigit(initialState(), "7").entry, "7");
  });

  test("A7: digits append", () => {
    assert.equal(type(initialState(), "789").entry, "789");
  });

  test("A8: zero after zero stays zero", () => {
    assert.equal(inputDigit(initialState(), "0").entry, "0");
  });

  test("A9: digit limit", () => {
    const twelve = type(initialState(), "123456789012");
    assert.equal(twelve.entry.length, MAX_ENTRY_DIGITS);
    assert.equal(inputDigit(twelve, "3"), twelve);

    const fraction = type(initialState(), "0.123456789012");
    assert.equal(fraction.entry, "0.123456789012");
    assert.equal(inputDigit(fraction, "3"), fraction);

    const mixed = type(initialState(), "1234.5678");
    assert.equal(type(mixed, "9012").entry, "1234.56789012");
    assert.equal(type(mixed, "90123").entry, "1234.56789012");
  });

  test("A10: invalid digit throws and leaves state unchanged", () => {
    const state = type(initialState(), "12");
    const snapshot = { ...state };
    for (const bad of ["a", "10", "", 5, null, undefined, "."]) {
      assert.throws(() => inputDigit(state, bad), RangeError);
    }
    assert.deepEqual(state, snapshot);
  });

  test("A11: decimal appends once", () => {
    const withPoint = inputDecimal(type(initialState(), "12"));
    assert.equal(withPoint.entry, "12.");
    assert.equal(inputDigit(withPoint, "5").entry, "12.5");
  });

  test("A12: second decimal ignored", () => {
    const state = type(initialState(), "12.5");
    assert.equal(inputDecimal(state), state);
  });

  test("A13: decimal on initial state", () => {
    const point = inputDecimal(initialState());
    assert.equal(point.entry, "0.");
    assert.equal(inputDigit(point, "3").entry, "0.3");
  });

  test("A14: clear entry resets entry only", () => {
    const state = type(initialState(), "12.5");
    const cleared = clearEntry(state);
    assert.equal(cleared.entry, "0");
    assert.equal(cleared.display, "0");
    assert.equal(cleared.operator, state.operator);
    assert.equal(cleared.operand, state.operand);
    assert.equal(cleared.error, state.error);
  });

  test("A15: clear all returns the initial state", () => {
    const state = type(initialState(), "98.76");
    assert.deepEqual(clearAll(state), initialState());
    assert.deepEqual(clearAll(), initialState());
  });
});
