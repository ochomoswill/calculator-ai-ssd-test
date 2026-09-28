import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { loadPage, byRole, accessibleName, visibleText } from "./helpers/dom.js";

const keyNames = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "Decimal point", "Add", "Subtract", "Multiply", "Divide", "Equals",
  "Toggle sign", "Clear entry", "Clear all",
];

describe("Feature 1: calculator interface", () => {
  let document;
  before(async () => {
    document = await loadPage();
  });

  test("A3: result display is an output element with status role", () => {
    const statuses = byRole(document, "status", "Result");
    assert.equal(statuses.length, 1);
    assert.equal(statuses[0].tagName, "OUTPUT");
  });

  test("A4: display shows 0 and contains no controls", () => {
    const [display] = byRole(document, "status", "Result");
    assert.equal(display.textContent.trim(), "0");
    assert.equal(byRole(display, "button").length, 0);
    assert.equal(byRole(display, "link").length, 0);
  });

  test("A5: exactly one Keypad region containing every key", () => {
    const regions = byRole(document, "region", "Keypad");
    assert.equal(regions.length, 1);
    const all = byRole(document, "button");
    const inside = byRole(regions[0], "button");
    assert.equal(inside.length, all.length);
  });

  test("A6: every key exists exactly once by accessible name", () => {
    for (const name of keyNames) {
      assert.equal(byRole(document, "button", name).length, 1, `key "${name}"`);
    }
    assert.equal(byRole(document, "button").length, keyNames.length);
  });

  test("A7: every key is a native button with type button", () => {
    const [keypad] = byRole(document, "region", "Keypad");
    for (const button of byRole(keypad, "button")) {
      assert.equal(button.tagName, "BUTTON");
      assert.equal(button.getAttribute("type"), "button");
    }
  });

  test("A8: operator keys show symbol glyphs while keeping word names", () => {
    const glyphs = { Multiply: "×", Divide: "÷", Add: "+", Subtract: "−" };
    for (const [name, glyph] of Object.entries(glyphs)) {
      const [button] = byRole(document, "button", name);
      assert.equal(visibleText(button), glyph, `glyph for ${name}`);
      assert.equal(accessibleName(button), name);
    }
  });

  test("A9: keys are focusable in document order with no positive tabindex", () => {
    const buttons = byRole(document, "button");
    const order = [];
    for (const button of buttons) {
      const tabindex = button.getAttribute("tabindex");
      assert.ok(tabindex === null || Number(tabindex) <= 0, "no positive tabindex");
      button.focus();
      assert.equal(document.activeElement, button);
      order.push(accessibleName(button));
    }
    assert.deepEqual(order, [
      "Clear all", "Clear entry", "Toggle sign", "Divide",
      "7", "8", "9", "Multiply",
      "4", "5", "6", "Subtract",
      "1", "2", "3", "Add",
      "0", "Decimal point", "Equals",
    ]);
  });

  test("A10: activating any key leaves the display unchanged", () => {
    const [display] = byRole(document, "status", "Result");
    const { MouseEvent, KeyboardEvent } = document.defaultView;
    for (const button of byRole(document, "button")) {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      button.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      assert.equal(display.textContent.trim(), "0");
    }
  });

  test("A11: document metadata", () => {
    assert.ok(document.title.length > 0);
    assert.equal(document.documentElement.getAttribute("lang"), "en");
    const viewport = document.querySelector('meta[name="viewport"]').getAttribute("content");
    assert.match(viewport, /width=device-width/);
    assert.doesNotMatch(viewport, /user-scalable\s*=\s*no/);
  });

  test("A12: style declarations for container, colour scheme and key gap", async () => {
    const { readFile } = await import("node:fs/promises");
    const base = await readFile(new URL("../css/base.css", import.meta.url), "utf8");
    const calc = await readFile(new URL("../css/calculator.css", import.meta.url), "utf8");
    assert.match(base, /:root\s*\{[^}]*color-scheme:\s*light dark/);
    assert.match(calc, /\.calculator\s*\{[^}]*container-type:\s*inline-size/);
    assert.match(calc, /\.keypad\s*\{[^}]*gap:\s*(?!0[;\s])/);
  });
});
