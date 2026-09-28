import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { MAX_SIGNIFICANT_DIGITS, formatValue, formatEntry, localeTokens } from "../src/js/format.js";

// Explicit locales: comma-group/point-decimal, point-group/comma-decimal, non-ASCII minus.
const COMMA_GROUP = "en-US";
const POINT_GROUP = "de-DE";
const REAL_MINUS = "sv-SE";
const LOCALES = [COMMA_GROUP, POINT_GROUP, REAL_MINUS];

const digitsOnly = (s) => s.replace(/[^0-9]/g, "");
const significant = (s) => digitsOnly(s).replace(/^0+/, "").replace(/0+$/, "");

describe("Feature 3: number formatting", () => {
  test("A1: no DOM or engine dependency", async () => {
    assert.equal(typeof globalThis.document, "undefined");
    const source = await readFile(new URL("../src/js/format.js", import.meta.url), "utf8");
    for (const banned of ["document", "window", "navigator", "localStorage"]) {
      assert.doesNotMatch(source, new RegExp(`\\b${banned}\\b`), `format must not reference ${banned}`);
    }
    assert.doesNotMatch(source, /^import\s/m, "format imports nothing");
    assert.doesNotMatch(source, /engine\.js/, "format must not import the engine module");
  });

  test("A2: pure and locale-optional", () => {
    assert.equal(formatValue(1234.5, COMMA_GROUP), formatValue(1234.5, COMMA_GROUP));
    assert.equal(formatEntry("12.", POINT_GROUP), formatEntry("12.", POINT_GROUP));
    assert.ok(formatValue(1234.5).length > 0);
    assert.ok(formatEntry("1234.5").length > 0);
  });

  test("A3: grouping per locale", () => {
    for (const locale of [COMMA_GROUP, POINT_GROUP]) {
      const { group } = localeTokens(locale);
      const out = formatValue(1234567.5, locale);
      assert.ok(out.includes(group), `${locale} groups with ${JSON.stringify(group)}`);
      assert.equal(out.split(group).length, 3);
    }
    assert.equal(formatValue(1234567.5, COMMA_GROUP), "1,234,567.5");
    assert.equal(formatValue(1234567.5, POINT_GROUP), "1.234.567,5");
  });

  test("A4: decimal mark per locale", () => {
    assert.equal(formatValue(2.5, POINT_GROUP), "2,5");
    assert.equal(formatValue(2.5, COMMA_GROUP), "2.5");
  });

  test("A5: floating-point artefacts hidden", () => {
    assert.equal(formatValue(0.1 + 0.2, COMMA_GROUP), "0.3");
    assert.equal(formatValue(0.1 + 0.2, POINT_GROUP), "0,3");
  });

  test("A6: twelve significant digits", () => {
    assert.equal(formatValue(1 / 3, COMMA_GROUP), "0." + "3".repeat(MAX_SIGNIFICANT_DIGITS));
    assert.equal(significant(formatValue(1 / 3, COMMA_GROUP)).length, MAX_SIGNIFICANT_DIGITS);
    assert.ok(significant(formatValue(123456789012345, COMMA_GROUP)).length <= MAX_SIGNIFICANT_DIGITS);
  });

  test("A7: no trailing zeros", () => {
    assert.equal(formatValue(2.5, COMMA_GROUP), "2.5");
    assert.equal(formatValue(3.0, COMMA_GROUP), "3");
  });

  test("A8: locale minus sign", () => {
    for (const locale of LOCALES) {
      const { minusSign } = localeTokens(locale);
      const out = formatValue(-42, locale);
      assert.ok(out.startsWith(minusSign), `${locale} minus is ${JSON.stringify(minusSign)}`);
    }
    assert.notEqual(formatValue(-42, REAL_MINUS)[0], "-");
    assert.equal(formatValue(-42, REAL_MINUS)[0], "−");
  });

  test("A9: negative zero", () => {
    for (const locale of LOCALES) assert.equal(formatValue(-0, locale), "0");
  });

  test("A10: non-finite rejected", () => {
    for (const bad of [Infinity, -Infinity, NaN, "1", null, undefined]) {
      assert.throws(() => formatValue(bad, COMMA_GROUP), RangeError);
    }
  });

  test("A11: entry grouping", () => {
    for (const locale of LOCALES) {
      const { group } = localeTokens(locale);
      const out = formatEntry("1234567", locale);
      assert.equal(out.split(group).length, 3, `${locale}`);
      assert.equal(digitsOnly(out), "1234567");
    }
    assert.equal(formatEntry("1234567", COMMA_GROUP), "1,234,567");
    assert.equal(formatEntry("1234567", POINT_GROUP), "1.234.567");
  });

  test("A12: entry decimal mark", () => {
    assert.equal(formatEntry("12.5", POINT_GROUP), "12,5");
    assert.equal(formatEntry("12.5", COMMA_GROUP), "12.5");
  });

  test("A13: trailing point and zeros preserved", () => {
    for (const locale of LOCALES) {
      const { decimal } = localeTokens(locale);
      assert.ok(formatEntry("12.", locale).endsWith(decimal), `${locale} trailing mark`);
      assert.ok(formatEntry("0.10", locale).endsWith("0"), `${locale} trailing zero`);
      assert.equal(digitsOnly(formatEntry("0.10", locale)), "010");
    }
    assert.equal(formatEntry("12.", COMMA_GROUP), "12.");
    assert.equal(formatEntry("0.10", POINT_GROUP), "0,10");
  });

  test("A14: zero entries", () => {
    for (const locale of LOCALES) {
      const { decimal } = localeTokens(locale);
      assert.equal(formatEntry("0", locale), "0");
      assert.equal(formatEntry("0.", locale), "0" + decimal);
    }
  });

  test("A15: tokens not hard-coded", () => {
    for (const locale of LOCALES) {
      const parts = new Intl.NumberFormat(locale, { useGrouping: true }).formatToParts(1234567.5);
      const apiGroup = parts.find((p) => p.type === "group").value;
      const apiDecimal = parts.find((p) => p.type === "decimal").value;
      const out = formatEntry("1234567.5", locale);
      const nonDigits = out.replace(/[0-9]/g, "");
      assert.equal(nonDigits, apiGroup + apiGroup + apiDecimal, `${locale}`);
    }
  });

  test("invalid entry strings throw", () => {
    for (const bad of ["", "1.2.3", "-1", "abc", 12, null]) {
      assert.throws(() => formatEntry(bad, COMMA_GROUP), RangeError);
    }
  });
});
