// Loads src/index.html into jsdom and offers small role / accessible-name helpers.
// Scripts are not executed: feature 1's entry module attaches no behaviour,
// and jsdom does not run ES module scripts.
import { readFile } from "node:fs/promises";
import { JSDOM } from "jsdom";

export async function loadPage() {
  const html = await readFile(new URL("../../src/index.html", import.meta.url), "utf8");
  const dom = new JSDOM(html, { pretendToBeVisual: true });
  return dom.window.document;
}

const implicitRoles = {
  BUTTON: "button",
  OUTPUT: "status",
  A: "link",
  MAIN: "main",
};

export function roleOf(element) {
  const explicit = element.getAttribute("role");
  if (explicit) return explicit;
  const tag = element.tagName;
  if (tag === "SECTION") return element.hasAttribute("aria-label") ? "region" : null;
  return implicitRoles[tag] ?? null;
}

export function accessibleName(element) {
  const label = element.getAttribute("aria-label");
  if (label) return label.trim();
  return textWithoutHidden(element).replace(/\s+/g, " ").trim();
}

function textWithoutHidden(node) {
  if (node.nodeType === node.TEXT_NODE) return node.textContent;
  if (node.nodeType !== node.ELEMENT_NODE) return "";
  if (node.getAttribute("aria-hidden") === "true") return "";
  return Array.from(node.childNodes).map(textWithoutHidden).join("");
}

export function visibleText(element) {
  return Array.from(element.childNodes)
    .filter((n) => !(n.nodeType === n.ELEMENT_NODE && n.classList.contains("visually-hidden")))
    .map((n) => n.textContent)
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

export function byRole(scope, role, name) {
  return Array.from(scope.querySelectorAll("*")).filter(
    (el) => roleOf(el) === role && (name === undefined || accessibleName(el) === name),
  );
}
