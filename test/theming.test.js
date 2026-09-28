import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (f) => readFile(new URL(`../src/${f}`, import.meta.url), "utf8");
const TOKENS = ["--bg", "--fg", "--surface", "--accent", "--error", "--border", "--focus"];
const block = (css, selectorRe) => {
  const m = css.match(selectorRe);
  if (!m) return "";
  let depth = 0, i = m.index + m[0].length - 1;
  for (; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) break;
  }
  return css.slice(m.index, i + 1);
};

describe("Feature 11: responsive layout and theming", () => {
  let base, calc, html;
  before(async () => {
    [base, calc, html] = await Promise.all([read("css/base.css"), read("css/calculator.css"), read("index.html")]);
  });

  test("A1: tokens defined for both schemes", () => {
    const root = block(base, /:root\s*\{/);
    const dark = block(base, /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{/);
    assert.ok(root && dark);
    for (const token of TOKENS) {
      assert.match(root, new RegExp(`${token}:`), `${token} in :root`);
      assert.match(dark, new RegExp(`${token}:`), `${token} in dark block`);
    }
  });

  test("A2: no literal colours outside token blocks", () => {
    const stripped = base
      .replace(block(base, /:root\s*\{/), "")
      .replace(block(base, /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{/), "");
    for (const css of [stripped, calc]) {
      assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i, "hex colour");
      assert.doesNotMatch(css, /\b(rgb|hsl)a?\(/, "colour function");
      assert.doesNotMatch(css, /\b(Canvas|CanvasText|ButtonFace|ButtonText|GrayText)\b/, "system colour");
    }
    assert.match(calc, /var\(--/);
  });

  test("A3: reduced motion honoured", () => {
    const rm = block(base, /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{/);
    assert.match(rm, /transition:\s*none/);
    assert.match(rm, /transform:\s*none/);
  });

  test("A4: container queries present", () => {
    assert.match(calc, /\.calculator\s*\{[^}]*container-type:\s*inline-size/);
    const queries = calc.match(/@container\s*\(/g) ?? [];
    assert.ok(queries.length >= 2, `found ${queries.length} container queries`);
    assert.match(calc, /@container[^{]*\{[^]*?font-size/);
  });

  test("A5: error state styled", () => {
    const rule = block(calc, /\.display\[data-error\]\s*\{/);
    assert.match(rule, /color:\s*var\(--error\)/);
    assert.match(rule, /font-size:/);
  });

  test("A6: focus visible", () => {
    const rule = block(calc, /\.key:focus-visible\s*\{/);
    assert.match(rule, /outline:[^;]*var\(--focus\)/);
    assert.match(rule, /outline-offset:/);
  });

  test("A7: logical properties only", () => {
    const physical = /(^|[\s;{])(margin|padding)-(left|right|top|bottom)\s*:|(^|[\s;{])(left|right|top|bottom)\s*:|(^|[\s;{])(min-|max-)?(width|height)\s*:|text-align:\s*(left|right)/m;
    for (const [name, css] of [["base", base], ["calculator", calc]]) {
      const m = css.match(physical);
      assert.equal(m, null, `${name}.css uses physical property: ${m && m[0]}`);
    }
  });

  test("A8: grid and viewport preserved", () => {
    assert.match(calc, /\.keypad\s*\{[^}]*grid-template-columns:\s*repeat\(4,\s*1fr\)/);
    assert.match(calc, /\.key-zero\s*\{[^}]*grid-column:\s*span 2/);
    const viewport = html.match(/<meta name="viewport" content="([^"]+)"/)[1];
    assert.match(viewport, /width=device-width/);
    assert.doesNotMatch(viewport, /user-scalable\s*=\s*no/);
  });
});
