import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

const root = (f) => new URL(`../${f}`, import.meta.url);

describe("Feature 15: engine package", () => {
  test("A1: package manifest", async () => {
    const pkg = JSON.parse(await readFile(root("src/js/engine/package.json"), "utf8"));
    assert.equal(pkg.name, "@calculator/engine");
    assert.equal(pkg.type, "module");
    assert.equal(pkg.exports, "./engine.js");
    assert.equal(pkg.dependencies, undefined);
  });

  test("A2: workspace declared", async () => {
    const pkg = JSON.parse(await readFile(root("package.json"), "utf8"));
    assert.ok(pkg.workspaces.includes("src/js/engine"));
  });

  test("A3: import map on the page", async () => {
    const html = await readFile(root("src/index.html"), "utf8");
    const mapIndex = html.indexOf('<script type="importmap">');
    const moduleIndex = html.indexOf('<script type="module"');
    assert.ok(mapIndex > -1 && mapIndex < moduleIndex, "import map precedes the module script");
    const json = JSON.parse(html.slice(mapIndex).match(/<script type="importmap">([^]*?)<\/script>/)[1]);
    assert.equal(json.imports["@calculator/engine"], "./js/engine/engine.js");
  });

  test("A4: bare specifier everywhere", async () => {
    const files = [];
    for (const f of await readdir(root("src/js"))) if (f.endsWith(".js")) files.push(`src/js/${f}`);
    for (const f of await readdir(root("test"))) if (f.endsWith(".js")) files.push(`test/${f}`);
    for (const f of files) {
      const source = await readFile(root(f), "utf8");
      assert.doesNotMatch(source, /from "[./]*\/engine\/engine\.js"/, `${f} imports the engine relatively`);
    }
    const app = await readFile(root("src/js/app.js"), "utf8");
    const imports = [...app.matchAll(/^import .* from "(.+)";/gm)].map((m) => m[1]).sort();
    assert.deepEqual(imports, ["./format.js", "./storage.js", "@calculator/engine"]);
  });

  test("A5: resolves in Node", async () => {
    const engine = await import("@calculator/engine");
    for (const name of ["initialState", "inputDigit", "inputDecimal", "inputOperator", "evaluate", "toggleSign", "deleteLast", "clearEntry", "clearAll", "ERRORS"]) {
      assert.ok(name in engine, name);
    }
    assert.equal(engine.initialState().display, "0");
    assert.equal(typeof globalThis.document, "undefined");
  });

  test("A6: offline list unchanged", async () => {
    const sw = await readFile(root("src/sw.js"), "utf8");
    assert.match(sw, /"\.\/js\/engine\/engine\.js"/);
  });
});
