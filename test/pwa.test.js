import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { encodeIcon, ICON_SIZES } from "../tools/make-icons.js";

const src = (f) => new URL(`../src/${f}`, import.meta.url);
const pngSize = (buf) => ({ width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) });

describe("Feature 13: installable PWA", () => {
  let manifest, html, base;
  before(async () => {
    manifest = JSON.parse(await readFile(src("manifest.webmanifest"), "utf8"));
    html = await readFile(src("index.html"), "utf8");
    base = await readFile(src("css/base.css"), "utf8");
  });

  test("A1: manifest members", () => {
    assert.ok(manifest.name && manifest.short_name);
    assert.equal(manifest.start_url, "./");
    assert.equal(manifest.display, "standalone");
    assert.match(manifest.background_color, /^#[0-9a-f]{6}$/i);
    assert.match(manifest.theme_color, /^#[0-9a-f]{6}$/i);
    assert.ok(Array.isArray(manifest.icons));
    assert.ok(manifest.prefer_related_applications === undefined || manifest.prefer_related_applications === false);
  });

  test("A2: icon entries and files", async () => {
    for (const size of ICON_SIZES) {
      const entry = manifest.icons.find((i) => i.sizes === `${size}x${size}`);
      assert.ok(entry, `icon ${size}`);
      assert.equal(entry.type, "image/png");
      const bytes = await readFile(src(entry.src));
      assert.deepEqual(Array.from(bytes.subarray(0, 8)), [137, 80, 78, 71, 13, 10, 26, 10]);
      assert.deepEqual(pngSize(bytes), { width: size, height: size });
    }
  });

  test("A3: page links", () => {
    assert.match(html, /<link rel="manifest" href="manifest\.webmanifest" \/>/);
    const theme = html.match(/<meta name="theme-color" content="([^"]+)" \/>/)[1];
    assert.equal(theme, manifest.theme_color);
  });

  test("A4: server media types", async () => {
    const serve = await readFile(new URL("../tools/serve.js", import.meta.url), "utf8");
    assert.match(serve, /"\.webmanifest":\s*"application\/manifest\+json"/);
    assert.match(serve, /"\.png":\s*"image\/png"/);
  });

  test("A5: deterministic generator", async () => {
    for (const size of ICON_SIZES) {
      const committed = await readFile(src(`icons/icon-${size}.png`));
      assert.ok(encodeIcon(size).equals(committed), `icon ${size} matches generator`);
    }
  });

  test("A6: theme colour from tokens", () => {
    const root = base.match(/:root\s*\{[^}]*\}/)[0];
    assert.equal(manifest.theme_color, root.match(/--accent:\s*(#[0-9a-f]{6})/i)[1]);
    assert.equal(manifest.background_color, root.match(/--bg:\s*(#[0-9a-f]{6})/i)[1]);
  });
});
