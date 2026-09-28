import { test } from "node:test";
import assert from "node:assert/strict";

test("engine unit tests run with no DOM present", () => {
  assert.equal(typeof globalThis.document, "undefined");
  assert.equal(typeof globalThis.window, "undefined");
});
