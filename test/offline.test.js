import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const SRC = fileURLToPath(new URL("../src/", import.meta.url));
const ORIGIN = "https://calc.example";

/** Build a worker sandbox with fake caches, fetch and self. */
async function loadWorker({ network = {}, existing = {} } = {}) {
  const stores = new Map(Object.entries(existing).map(([n, m]) => [n, new Map(Object.entries(m))]));
  const fetched = [];
  const fakeResponse = (body) => ({ ok: true, body, clone() { return { ...this }; } });
  const key = (req) => (typeof req === "string" ? new URL(req, ORIGIN + "/").href : req.url);
  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const map = stores.get(name);
      return {
        async addAll(list) { for (const u of list) map.set(key(u), fakeResponse(`precached:${u}`)); },
        async put(req, res) { map.set(key(req), res); },
      };
    },
    async match(req) { for (const map of stores.values()) { const hit = map.get(key(req)); if (hit) return hit; } return undefined; },
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); },
  };
  const handlers = {};
  let skipped = false, claimed = false;
  const context = {
    caches,
    URL,
    fetch: async (req) => {
      fetched.push(req.url);
      const body = network[req.url];
      if (body === undefined) throw new TypeError("network failure");
      return fakeResponse(body);
    },
  };
  context.self = {
    addEventListener: (type, fn) => (handlers[type] = fn),
    skipWaiting: async () => { skipped = true; },
    clients: { claim: async () => { claimed = true; } },
    location: { origin: ORIGIN },
  };
  vm.createContext(context);
  vm.runInContext(await readFile(join(SRC, "sw.js"), "utf8"), context, { filename: "sw.js" });
  const run = async (type, extra = {}) => { let p; handlers[type]({ waitUntil: (x) => (p = x), ...extra }); await p; };
  const fetchVia = (request) => new Promise((resolve) => {
    let responded = false;
    handlers.fetch({ request, respondWith: (r) => { responded = true; resolve(Promise.resolve(r)); } });
    if (!responded) resolve(undefined);
  });
  const req = (path, init = {}) => ({ url: new URL(path, ORIGIN + "/").href, method: "GET", mode: "cors", ...init });
  return { stores, fetched, run, fetchVia, req, get skipped() { return skipped; }, get claimed() { return claimed; } };
}

async function listSourceFiles(dir = SRC, prefix = "./") {
  const out = [];
  for (const name of await readdir(dir)) {
    const full = join(dir, name);
    if ((await stat(full)).isDirectory()) out.push(...(await listSourceFiles(full, `${prefix}${name}/`)));
    else if (name !== "sw.js" && !name.endsWith(".md")) out.push(`${prefix}${name}`);
  }
  return out.sort();
}

const precacheList = async () => {
  const source = await readFile(join(SRC, "sw.js"), "utf8");
  return JSON.parse(source.match(/const PRECACHE = (\[[^\]]*\])/)[1].replace(/,\s*\]/, "]"));
};

describe("Feature 14: offline support", () => {
  test("A1: precache list complete and valid", async () => {
    const list = await precacheList();
    const files = await listSourceFiles();
    for (const entry of list) {
      if (entry === "./") continue;
      await stat(join(SRC, entry));
    }
    assert.deepEqual(list.filter((e) => e !== "./").sort(), files);
    assert.ok(list.includes("./"));
  });

  test("A2: install precaches into the versioned cache", async () => {
    const w = await loadWorker();
    await w.run("install");
    const [name] = [...w.stores.keys()];
    assert.match(name, /^calculator-v\d+$/);
    const list = await precacheList();
    assert.equal(w.stores.get(name).size, list.length);
    assert.equal(w.skipped, true);
  });

  test("A3: activate deletes old caches", async () => {
    const w = await loadWorker({ existing: { "calculator-v0": {}, "other-v3": {}, "calculator-v1": {} } });
    await w.run("activate");
    assert.deepEqual([...w.stores.keys()], ["calculator-v1"]);
    assert.equal(w.claimed, true);
  });

  test("A4: cache-first hit", async () => {
    const w = await loadWorker();
    await w.run("install");
    const res = await w.fetchVia(w.req("./index.html"));
    assert.equal(res.body, "precached:./index.html");
    assert.deepEqual(w.fetched, []);
  });

  test("A5: miss fetches and stores", async () => {
    const extra = `${ORIGIN}/extra.json`;
    const w = await loadWorker({ network: { [extra]: "from-network" } });
    await w.run("install");
    const res = await w.fetchVia(w.req("./extra.json"));
    assert.equal(res.body, "from-network");
    assert.deepEqual(w.fetched, [extra]);
    assert.equal((await w.fetchVia(w.req("./extra.json"))).body, "from-network");
    assert.deepEqual(w.fetched, [extra], "second request served from cache");
  });

  test("A6: non-GET and cross-origin pass through", async () => {
    const w = await loadWorker();
    await w.run("install");
    assert.equal(await w.fetchVia(w.req("./index.html", { method: "POST" })), undefined);
    assert.equal(await w.fetchVia({ url: "https://other.example/x.js", method: "GET" }), undefined);
    assert.deepEqual(w.fetched, []);
  });

  test("A7: navigation fallback and registration", async () => {
    const w = await loadWorker();
    await w.run("install");
    const res = await w.fetchVia(w.req("./some/deep/route", { mode: "navigate" }));
    assert.equal(res.body, "precached:./index.html");
    const main = await readFile(join(SRC, "js/main.js"), "utf8");
    assert.match(main, /if \("serviceWorker" in navigator\)/);
    assert.match(main, /navigator\.serviceWorker\.register\("\.\/sw\.js"\)\.catch\(/);
  });
});
