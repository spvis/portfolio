import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const folders = ["gallery", "gallerywide", "gallerydrawings"];

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

async function main() {
  for (const folder of folders) {
    const galleryDir = path.resolve("src", "img", folder);
    const outputPath = path.resolve(galleryDir, "manifest.json");

    const entries = await readdir(galleryDir, { withFileTypes: true });

    const images = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => imageExtensions.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b));

    const manifest = {
      images,
      generatedAt: new Date().toISOString()
    };

    await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    console.log(`[${folder}] manifest generated with ${images.length} image(s): ${outputPath}`);
  }
}

main().catch((error) => {
  console.error("Failed to generate gallery manifest:", error);
  process.exit(1);
});
