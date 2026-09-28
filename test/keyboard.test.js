import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { initialState, inputDigit, inputDecimal, inputOperator, evaluate, deleteLast, ERRORS } from "../src/js/engine/engine.js";
import { mountPage } from "./helpers/dom.js";

const type = (s, chars) => [...chars].reduce((st, c) => (c === "." ? inputDecimal(st) : inputDigit(st, c)), s);
const shown = (d) => d.textContent.trim();

describe("Feature 10: keyboard (engine)", () => {
  test("A1: delete last", () => {
    let s = type(initialState(), "12.5");
    s = deleteLast(s); assert.equal(s.entry, "12.");
    s = deleteLast(s); assert.equal(s.entry, "12");
    s = deleteLast(s); assert.equal(s.entry, "1");
    s = deleteLast(s); assert.equal(s.entry, "0");
    assert.equal(deleteLast(inputDigit(inputOperator(initialState(), "subtract"), "5")).entry, "0");
    const result = evaluate(type(inputOperator(type(initialState(), "1"), "add"), "2"));
    assert.equal(deleteLast(result), result);
    const err = Object.freeze({ ...initialState(), error: ERRORS.overflow, display: "overflow", typing: false });
    assert.equal(deleteLast(err), err);
  });
});

describe("Feature 10: keyboard (DOM)", () => {
  test("A2: digits and decimal", async () => {
    const { display, key } = await mountPage("en-US");
    for (const k of ["1", "2", ".", "5"]) key(k);
    assert.equal(shown(display), "12.5");
    const page = await mountPage("en-US");
    for (const k of ["3", ",", "7"]) page.key(k);
    assert.equal(shown(page.display), "3.7");
  });

  test("A3: operators and Enter", async () => {
    const cases = [
      [["1", "2", "+", "3", "Enter"], "15"],
      [["1", "2", "-", "3", "="], "9"],
      [["1", "2", "*", "3", "Enter"], "36"],
      [["1", "2", "x", "3", "Enter"], "36"],
      [["1", "2", "X", "3", "Enter"], "36"],
      [["1", "2", "/", "3", "Enter"], "4"],
    ];
    for (const [keys, expected] of cases) {
      const { display, key } = await mountPage("en-US");
      for (const k of keys) key(k);
      assert.equal(shown(display), expected, keys.join(" "));
    }
  });

  test("A4: Escape, Delete and Backspace", async () => {
    const { display, key } = await mountPage("en-US");
    for (const k of ["1", "2", ".", "5"]) key(k);
    key("Backspace");
    assert.equal(shown(display), "12.");
    key("+"); key("4"); key("Delete");
    assert.equal(shown(display), "0");
    key("6"); key("Enter");
    assert.equal(shown(display), "18");
    const page = await mountPage("en-US");
    for (const k of ["5", "+", "3", "Escape"]) page.key(k);
    assert.equal(shown(page.display), "0");
    page.key("Enter");
    assert.equal(shown(page.display), "0");
  });

  test("A5: default prevented for handled keys only", async () => {
    const { key } = await mountPage("en-US");
    assert.equal(key("/"), true);
    assert.equal(key("Enter"), true);
    assert.equal(key("5"), true);
    assert.equal(key("q"), false);
  });

  test("A6: modifier keys ignored", async () => {
    const { display, key } = await mountPage("en-US");
    assert.equal(key("5", { ctrlKey: true }), false);
    assert.equal(key("5", { metaKey: true }), false);
    assert.equal(key("5", { altKey: true }), false);
    assert.equal(shown(display), "0");
  });

  test("A7: unhandled keys ignored", async () => {
    const { display, key } = await mountPage("en-US");
    key("4");
    for (const k of ["q", "Tab", "ArrowUp", "F5"]) key(k);
    assert.equal(shown(display), "4");
  });

  test("A8: Enter on a focused key acts once", async () => {
    const { display, document, key, click } = await mountPage("en-US");
    const seven = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "7");
    seven.focus();
    assert.equal(key("Enter", {}, seven), false);
    click("7"); // the native activation the browser would perform
    assert.equal(shown(display), "7");
    assert.equal(key(" ", {}, seven), false);
  });

  test("A9: listener count", async () => {
    const source = await readFile(new URL("../src/js/app.js", import.meta.url), "utf8");
    const listeners = source.match(/addEventListener\(\s*"([a-z]+)"/g) ?? [];
    assert.deepEqual(listeners.filter((l) => l.includes("keydown")), ['addEventListener("keydown"']);
  });
});
