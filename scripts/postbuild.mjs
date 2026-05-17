/**
 * Post-build step — must never fail the deploy.
 * - Vercel/CI: lightweight SPA HTML fallbacks per route (no Puppeteer).
 * - Local: optional full prerender when ENABLE_PRERENDER=1.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.join(__dirname, "..", "dist");
const SPA_ROUTES = ["/about", "/contact", "/privacy", "/terms"];

function copySpaFallbacks() {
  const indexPath = path.join(staticDir, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.error("postbuild: dist/index.html not found");
    return false;
  }

  const html = fs.readFileSync(indexPath, "utf8");

  for (const route of SPA_ROUTES) {
    const dir = path.join(staticDir, route.slice(1));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), html);
    console.log(`  SPA fallback → ${route}`);
  }

  return true;
}

function runPuppeteerPrerender() {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ["scripts/prerender.mjs"], {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    });
    child.on("error", () => resolve(1));
    child.on("close", (code) => resolve(code ?? 1));
  });
}

const onVercel = process.env.VERCEL === "1";
const skipPrerender = process.env.SKIP_PRERENDER === "1" || onVercel;
const enablePrerender = process.env.ENABLE_PRERENDER === "1" && !skipPrerender;

if (enablePrerender) {
  console.log("postbuild: running Puppeteer prerender (ENABLE_PRERENDER=1)…");
  const code = await runPuppeteerPrerender();
  if (code !== 0) {
    console.warn("postbuild: prerender failed — applying SPA fallbacks");
    copySpaFallbacks();
  }
} else {
  if (onVercel) {
    console.log("postbuild: Vercel build — SPA route fallbacks only");
  } else {
    console.log("postbuild: SPA route fallbacks (set ENABLE_PRERENDER=1 for full prerender)");
  }
  copySpaFallbacks();
}

console.log("postbuild: done");
process.exit(0);
