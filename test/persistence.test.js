import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { storageAvailable, load, save, STORAGE_KEY, MAX_HISTORY } from "../src/js/storage.js";
import { initialState } from "@calculator/engine";
import { mountPage } from "./helpers/dom.js";

class FakeStorage {
  constructor() { this.map = new Map(); }
  get length() { return this.map.size; }
  getItem(k) { return this.map.has(k) ? this.map.get(k) : null; }
  setItem(k, v) { this.map.set(k, String(v)); }
  removeItem(k) { this.map.delete(k); }
}
const quotaError = () => { const e = new Error("full"); e.name = "QuotaExceededError"; return e; };
const shown = (d) => d.textContent.trim();

describe("Feature 12: persistence (storage module)", () => {
  test("A1: availability check", () => {
    const throwing = { setItem() { const e = new Error("blocked"); e.name = "SecurityError"; throw e; }, removeItem() {}, length: 0 };
    assert.equal(storageAvailable(throwing), false);
    const emptyFull = { setItem() { throw quotaError(); }, removeItem() {}, length: 0 };
    assert.equal(storageAvailable(emptyFull), false);
    const populatedFull = { setItem() { throw quotaError(); }, removeItem() {}, length: 3 };
    assert.equal(storageAvailable(populatedFull), true);
    const working = new FakeStorage();
    assert.equal(storageAvailable(working), true);
    assert.equal(working.length, 0);
    assert.equal(storageAvailable(null), false);
  });

  test("A2: load validation", () => {
    const good = { state: { ...initialState(), entry: "12", display: "12" }, history: [{ left: 1, operator: "add", right: 2, result: 3 }] };
    const cases = [
      "not json",
      JSON.stringify({}),
      JSON.stringify({ state: { ...good.state, entry: "1e5" }, history: [] }),
      JSON.stringify({ state: { ...good.state, operator: "modulo" }, history: [] }),
      JSON.stringify({ state: { ...good.state, result: "Infinity" }, history: [] }),
      JSON.stringify({ state: good.state, history: [{ left: "1" }] }),
      JSON.stringify({ state: good.state, history: "nope" }),
    ];
    for (const raw of cases) {
      const s = new FakeStorage(); s.setItem(STORAGE_KEY, raw);
      assert.equal(load(s), null, raw.slice(0, 40));
    }
    const s = new FakeStorage(); s.setItem(STORAGE_KEY, JSON.stringify(good));
    const loaded = load(s);
    assert.deepEqual(loaded.state, good.state);
    assert.deepEqual(loaded.history, good.history);
    assert.equal(load({ getItem() { throw new Error("blocked"); } }), null);
  });

  test("A3: error state not persisted", () => {
    const s = new FakeStorage();
    const err = { ...initialState(), error: "divide-by-zero", display: "divide-by-zero", typing: false };
    save(s, err, [], initialState());
    assert.deepEqual(load(s).state, initialState());
  });
});

describe("Feature 12: persistence (DOM)", () => {
  test("A4: state survives a remount", async () => {
    const store = new FakeStorage();
    const first = await mountPage("en-US", undefined, store);
    first.type("12"); first.click("Add"); first.type("3");
    const second = await mountPage("en-US", undefined, store);
    assert.equal(shown(second.display), "3");
    second.click("Equals");
    assert.equal(shown(second.display), "15");
  });

  test("A5: explicit state wins", async () => {
    const store = new FakeStorage();
    const first = await mountPage("en-US", undefined, store);
    first.type("9");
    const second = await mountPage("en-US", { ...initialState(), entry: "4", display: "4" }, store);
    assert.equal(shown(second.display), "4");
  });

  test("A6: history recorded and rendered", async () => {
    const page = await mountPage("en-US", undefined, new FakeStorage());
    page.type("12"); page.click("Add"); page.type("30"); page.click("Equals");
    assert.deepEqual(page.historyItems(), ["12 + 30 = 42"]);
    page.type("4"); page.click("Multiply"); page.type("2"); page.click("Equals");
    assert.deepEqual(page.historyItems(), ["4 × 2 = 8", "12 + 30 = 42"]);
  });

  test("A7: ten-entry cap and remount", async () => {
    const store = new FakeStorage();
    const page = await mountPage("en-US", undefined, store);
    for (let i = 1; i <= 12; i++) {
      page.click("Clear all"); page.type(String(i)); page.click("Add"); page.type("1"); page.click("Equals");
    }
    const items = page.historyItems();
    assert.equal(items.length, MAX_HISTORY);
    assert.equal(items[0], "12 + 1 = 13");
    assert.equal(items[9], "3 + 1 = 4");
    const again = await mountPage("en-US", undefined, store);
    assert.deepEqual(again.historyItems(), items);
  });

  test("A8: clear history", async () => {
    const store = new FakeStorage();
    const page = await mountPage("en-US", undefined, store);
    page.type("1"); page.click("Add"); page.type("2"); page.click("Equals");
    page.type("5"); page.click("Add"); page.type("5"); page.click("Equals");
    assert.equal(page.historyItems().length, 2);
    page.click("Clear all");
    assert.equal(page.historyItems().length, 2, "Clear all keeps history");
    page.type("7");
    page.click("Clear history");
    assert.deepEqual(page.historyItems(), []);
    assert.equal(shown(page.display), "7");
    const again = await mountPage("en-US", undefined, store);
    assert.deepEqual(again.historyItems(), []);
  });

  test("A9: Enter on Clear history acts once", async () => {
    const page = await mountPage("en-US", undefined, new FakeStorage());
    page.type("1"); page.click("Add"); page.type("2");
    const [button] = Array.from(page.historyRegion.querySelectorAll("button"));
    button.focus();
    assert.equal(page.key("Enter", {}, button), false);
    assert.equal(shown(page.display), "2");
  });

  test("A10: blocked or full storage", async () => {
    const blocked = new Proxy({}, { get() { return () => { throw new Error("blocked"); }; } });
    const full = new FakeStorage(); full.setItem = () => { throw quotaError(); };
    for (const store of [blocked, full]) {
      const page = await mountPage("en-US", undefined, store);
      page.type("12"); page.click("Add"); page.type("3"); page.click("Equals");
      assert.equal(shown(page.display), "15");
      assert.deepEqual(page.historyItems(), ["12 + 3 = 15"]);
    }
  });
});
