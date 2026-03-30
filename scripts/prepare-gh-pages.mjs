import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const rootDir = resolve(process.cwd());
const srcDir = resolve(rootDir, "src");

const copyTargets = [
  [resolve(srcDir, "index.html"), resolve(rootDir, "index.html")],
  [resolve(srcDir, "output.css"), resolve(rootDir, "output.css")],
  [resolve(srcDir, "img"), resolve(rootDir, "img")],
  [resolve(srcDir, "favicon"), resolve(rootDir, "favicon")],
];

async function copyToRoot() {
  await mkdir(rootDir, { recursive: true });

  // Recreate asset folders to avoid stale files from older builds.
  await rm(resolve(rootDir, "img"), { recursive: true, force: true });
  await rm(resolve(rootDir, "favicon"), { recursive: true, force: true });

  for (const [from, to] of copyTargets) {
    await cp(from, to, { recursive: true, force: true });
  }
}

copyToRoot()
  .then(() => {
    console.log("Prepared GitHub Pages files at repository root.");
  })
  .catch((error) => {
    console.error("Failed to prepare GitHub Pages files:", error);
    process.exitCode = 1;
  });
