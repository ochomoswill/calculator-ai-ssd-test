import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { mountPage } from "./helpers/dom.js";

const COMMA_GROUP = "en-US";
const COMMA_DECIMAL = "de-DE";
const shown = (display) => display.textContent.trim();

describe("Feature 4: keypad and display", () => {
  test("A1: mount renders zero", async () => {
    const { display } = await mountPage(COMMA_GROUP);
    assert.equal(shown(display), "0");
  });

  test("A2: click listeners for keypad and history, one keydown listener", async () => {
    const source = await readFile(new URL("../src/js/app.js", import.meta.url), "utf8");
    const listeners = source.match(/addEventListener\(\s*"([a-z]+)"/g) ?? [];
    assert.deepEqual(listeners, ['addEventListener("click"', 'addEventListener("click"', 'addEventListener("keydown"']);
    assert.doesNotMatch(source, /key(up|press)/);
  });

  test("A3: imports limited to engine, formatter and storage", async () => {
    const source = await readFile(new URL("../src/js/app.js", import.meta.url), "utf8");
    const imports = [...source.matchAll(/^import .* from "(.+)";/gm)].map((m) => m[1]).sort();
    assert.deepEqual(imports, ["./format.js", "./storage.js", "@calculator/engine"]);
    assert.doesNotMatch(source, /\bdocument\b|\bwindow\b/);
  });

  test("A4: first digit replaces zero", async () => {
    const { display, click } = await mountPage(COMMA_GROUP);
    click("7");
    assert.equal(shown(display), "7");
  });

  test("A5: digits append", async () => {
    const { display, type } = await mountPage(COMMA_GROUP);
    type("789");
    assert.equal(shown(display), "789");
  });

  test("A6: grouping on screen", async () => {
    const { display, type } = await mountPage(COMMA_GROUP);
    type("1234567");
    assert.equal(shown(display), "1,234,567");
  });

  test("A7: decimal point on screen", async () => {
    const { display, type, click } = await mountPage(COMMA_GROUP);
    type("12");
    click("Decimal point");
    assert.equal(shown(display), "12.");
    click("5");
    assert.equal(shown(display), "12.5");
  });

  test("A8: locale decimal mark", async () => {
    const { display, type } = await mountPage(COMMA_DECIMAL);
    type("12.5");
    assert.equal(shown(display), "12,5");
  });

  test("A9: second decimal ignored", async () => {
    const { display, type, click } = await mountPage(COMMA_GROUP);
    type("12.5");
    click("Decimal point");
    assert.equal(shown(display), "12.5");
  });

  test("A10: twelve-digit limit on screen", async () => {
    const { display, type, click } = await mountPage(COMMA_GROUP);
    type("123456789012");
    const before = shown(display);
    assert.equal(before, "123,456,789,012");
    click("3");
    assert.equal(shown(display), before);
  });

  test("A11: clear entry", async () => {
    const { display, type, click } = await mountPage(COMMA_GROUP);
    type("12.5");
    click("Clear entry");
    assert.equal(shown(display), "0");
  });

  test("A12: clear all", async () => {
    const { display, type, click } = await mountPage(COMMA_GROUP);
    type("789");
    click("Clear all");
    assert.equal(shown(display), "0");
  });

  test("A13: operator keys (now live) never throw", async () => {
    const { display, type, click } = await mountPage(COMMA_GROUP);
    type("789");
    for (const name of ["Add", "Subtract", "Multiply", "Divide", "Equals", "Toggle sign"]) {
      assert.doesNotThrow(() => click(name), name);
    }
    assert.ok(shown(display).length > 0);
  });

  test("A14: display stays plain text", async () => {
    const { display, type, click } = await mountPage(COMMA_GROUP);
    type("1234.5");
    click("Clear entry");
    type("9");
    assert.equal(display.children.length, 0);
    assert.equal(display.childNodes.length, 1);
  });

  test("A15: entry module mounts the app", async () => {
    const source = await readFile(new URL("../src/js/main.js", import.meta.url), "utf8");
    assert.match(source, /^import \{ mount \} from "\.\/app\.js";/m);
    assert.match(source, /mount\(document\.querySelector\("\.calculator"\)\);/);
  });
});
