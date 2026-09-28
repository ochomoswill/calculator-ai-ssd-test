// Loads src/index.html into jsdom and offers small role / accessible-name helpers.
// Scripts are not executed because jsdom does not run ES module scripts;
// mountPage() imports the wiring module and mounts it directly instead.
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

/**
 * Load the page and mount the calculator wiring on it with an explicit locale.
 * Returns the document, the "Result" display element, and a click helper that
 * activates a key by its accessible name.
 */
export async function mountPage(locale, state, storage = null) {
  const document = await loadPage();
  const { mount } = await import("../../src/js/app.js");
  mount(document.querySelector("main"), { locale, state, storage });
  const [display] = byRole(document, "status", "Result");
  const [historyRegion] = byRole(document, "region", "History");
  const historyItems = () => Array.from(historyRegion.querySelectorAll("li")).map((li) => li.textContent);
  const click = (name) => {
    const [button] = byRole(document, "button", name);
    if (!button) throw new Error(`no key named ${name}`);
    button.click();
  };
  const type = (chars) => {
    for (const c of chars) click(c === "." ? "Decimal point" : c);
  };
  const key = (value, init = {}, target = document) => {
    const event = new document.defaultView.KeyboardEvent("keydown", { key: value, bubbles: true, cancelable: true, ...init });
    target.dispatchEvent(event);
    return event.defaultPrevented;
  };
  return { document, display, click, type, key, historyRegion, historyItems };
}
