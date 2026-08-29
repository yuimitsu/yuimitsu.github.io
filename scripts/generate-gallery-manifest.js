#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..", "images", "Gallery");
const OUTPUT_FILE = path.join(ROOT, "albums.json");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function isImageFile(fileName) {
  return IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase());
}

function readAlbumFiles(albumName) {
  const albumPath = path.join(ROOT, albumName);
  const entries = fs.readdirSync(albumPath, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && isImageFile(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function getAlbumFolders() {
  const entries = fs.readdirSync(ROOT, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "ja", { numeric: true }));
}

function buildManifest() {
  const albums = {};
  const albumFolders = getAlbumFolders();

  for (const album of albumFolders) {
    albums[album] = readAlbumFiles(album);
  }

  return {
    generatedAt: new Date().toISOString(),
    albums,
  };
}

function main() {
  const manifest = buildManifest();
  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(`Wrote ${path.relative(path.join(__dirname, ".."), OUTPUT_FILE)}`);
  for (const album of Object.keys(manifest.albums)) {
    console.log(`${album}: ${manifest.albums[album].length}`);
  }
}

main();
