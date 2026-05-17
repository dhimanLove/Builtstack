import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import http from "http";
import sirv from "sirv";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.join(__dirname, "..", "dist");
const PORT = 4173;
const ROUTES = ["/", "/about", "/contact", "/privacy", "/terms"];

/** Vite-built SPA shell - never serve partially prerendered HTML during this pass */
const spaShell = fs.readFileSync(path.join(staticDir, "index.html"), "utf8");

function routeOutputPath(route) {
  if (route === "/") return path.join(staticDir, "index.html");
  return path.join(staticDir, route.slice(1), "index.html");
}

const serveAssets = sirv(staticDir, { dev: false });

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

  if (url.pathname.startsWith("/assets/") || url.pathname.includes(".")) {
    serveAssets(req, res, () => {
      res.statusCode = 404;
      res.end("Not found");
    });
    return;
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(spaShell);
});

await new Promise((resolve) => server.listen(PORT, resolve));
console.log(`Prerender server on http://localhost:${PORT}`);

const browser = await puppeteer.launch({ headless: true });

for (const route of ROUTES) {
  const page = await browser.newPage();
  const url = `http://localhost:${PORT}${route}`;
  console.log(`  → ${route}`);

  page.on("pageerror", (err) => console.warn(`  [pageerror] ${err.message}`));

  await page.goto(url, { waitUntil: "networkidle0", timeout: 90000 });
  await page.waitForSelector("#root *", { timeout: 45000 });
  await page.evaluate(() => document.dispatchEvent(new Event("render-event")));
  await new Promise((r) => setTimeout(r, route === "/about" ? 8000 : 3000));

  const rootChildCount = await page.evaluate(
    () => document.getElementById("root")?.childElementCount ?? 0,
  );

  const html = await page.content();
  const out = routeOutputPath(route);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log(`  ✓ ${out} (${rootChildCount} root children)`);

  await page.close();
}

await browser.close();
server.close();
console.log("Prerender complete.");
