import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the ERP product shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Vyapar Setu ERP \| Kirana, Mandi and Trader Business Software<\/title>/i);
  assert.match(html, /Test billing, stock, payments, purchases, and mandi settlement end to end/);
  assert.match(html, /Sales billing/);
  assert.match(html, /Mandi trade/);
  assert.match(html, /Desktop-first ERP with local test workflows/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton|codex-preview/i);
});

test("ships PWA assets and removes starter preview", async () => {
  const [manifest, serviceWorker, packageJson, page, layout] = await Promise.all([
    readFile(new URL("../public/manifest.webmanifest", import.meta.url), "utf8"),
    readFile(new URL("../public/service-worker.js", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(manifest, /"display": "standalone"/);
  assert.match(manifest, /Vyapar Setu ERP/);
  assert.match(serviceWorker, /CACHE_NAME = "vyapar-setu-v1"/);
  assert.match(packageJson, /"name": "vyapar-setu-erp"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview|codex-preview/);
  assert.match(layout, /manifest: "\/manifest\.webmanifest"/);

  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
  await access(new URL("../public/service-worker.js", import.meta.url));
});
