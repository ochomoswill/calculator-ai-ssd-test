// Presentation-side number formatting. Uses only Intl.NumberFormat.
// See specs/tech-design-web.md, Requirement 2 (display formatting, 12 significant
// digits) and Requirement 3 (locale minus sign). The engine never formats numbers;
// this module turns engine values and entry strings into what the display shows.

/** Significant digits shown for a finished value; below the ~15-17 digit precision of IEEE 754 doubles. */
export const MAX_SIGNIFICANT_DIGITS = 12;

const ENTRY_PATTERN = /^-?\d+(\.\d*)?$/;

const valueFormatters = new Map();
const integerFormatters = new Map();
const tokenCache = new Map();

function cached(map, locale, create) {
  const key = locale ?? "";
  if (!map.has(key)) map.set(key, create(locale));
  return map.get(key);
}

function valueFormatter(locale) {
  return cached(valueFormatters, locale, (l) =>
    new Intl.NumberFormat(l, {
      maximumSignificantDigits: MAX_SIGNIFICANT_DIGITS,
      useGrouping: true,
      signDisplay: "negative",
    }),
  );
}

function integerFormatter(locale) {
  return cached(integerFormatters, locale, (l) =>
    new Intl.NumberFormat(l, { maximumFractionDigits: 0, useGrouping: true }),
  );
}

/**
 * The locale's group separator, decimal mark and minus sign, read from the
 * formatting API's parts output rather than hard-coded.
 * @param {string} [locale]
 * @returns {{ group: string, decimal: string, minusSign: string }}
 */
export function localeTokens(locale) {
  return cached(tokenCache, locale, (l) => {
    const parts = new Intl.NumberFormat(l, { signDisplay: "always", useGrouping: true })
      .formatToParts(-1234567.5);
    const find = (type, fallback) => parts.find((p) => p.type === type)?.value ?? fallback;
    return Object.freeze({
      group: find("group", ""),
      decimal: find("decimal", "."),
      minusSign: find("minusSign", "-"),
    });
  });
}

/**
 * Format a finished numeric value for display.
 * @param {number} value a finite number
 * @param {string} [locale] defaults to the runtime locale
 */
export function formatValue(value, locale) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new RangeError(`formatValue expects a finite number, got ${String(value)}`);
  }
  return valueFormatter(locale).format(value);
}

/**
 * Format an in-progress entry string ("12.", "0.10", "-3") for display, grouping the
 * integer part and using the locale decimal mark while preserving exactly what
 * was typed after the point.
 * @param {string} entry optional leading minus, digits, optional single decimal point
 * @param {string} [locale] defaults to the runtime locale
 */
export function formatEntry(entry, locale) {
  if (typeof entry !== "string" || !ENTRY_PATTERN.test(entry)) {
    throw new RangeError(`formatEntry expects digits with an optional decimal point, got ${JSON.stringify(entry)}`);
  }
  const negative = entry.startsWith("-");
  const [integerPart, fractionPart] = (negative ? entry.slice(1) : entry).split(".");
  const tokens = localeTokens(locale);
  const grouped = (negative ? tokens.minusSign : "") + integerFormatter(locale).format(Number(integerPart));
  if (fractionPart === undefined) return grouped;
  return grouped + tokens.decimal + fractionPart;
}
