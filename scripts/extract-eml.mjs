/**
 * Extracts the HTML part from a .eml file, decoding quoted-printable encoding
 * so the result is clean HTML ready for Email on Acid or other testing tools.
 *
 * Usage: node scripts/extract-eml.mjs path/to/file.eml
 * Output: writes a .html file next to the .eml (e.g. file.html)
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname, basename, extname, join } from "path";

const emlPath = process.argv[2];
if (!emlPath) {
  console.error("Usage: node scripts/extract-eml.mjs <path-to-eml>");
  process.exit(1);
}

const resolvedPath = resolve(emlPath);
const raw = readFileSync(resolvedPath, "utf-8");

// Find the HTML MIME part boundary
// Look for Content-Type: text/html followed by quoted-printable content
// Handle both \n and \r\n line endings
const htmlPartMatch = raw.match(
  /Content-Type:\s*text\/html;\s*charset=utf-8\s*\r?\nContent-Transfer-Encoding:\s*quoted-printable\s*\r?\n\r?\n([\s\S]+?)(?:\r?\n------=_Part|\r?\n$)/
);

if (!htmlPartMatch) {
  console.error("Could not find text/html quoted-printable part in", emlPath);
  process.exit(1);
}

const qpEncoded = htmlPartMatch[1];

// Decode quoted-printable:
// 1. Join soft line breaks (=\n at end of line means continuation)
// 2. Decode =XX hex sequences to bytes
const joined = qpEncoded.replace(/=\r?\n/g, "");
const bytes = [];
let i = 0;
while (i < joined.length) {
  if (joined[i] === "=" && i + 2 < joined.length) {
    const hex = joined.substring(i + 1, i + 3);
    if (/^[0-9A-Fa-f]{2}$/.test(hex)) {
      bytes.push(parseInt(hex, 16));
      i += 3;
      continue;
    }
  }
  bytes.push(joined.charCodeAt(i));
  i++;
}

// Convert bytes to UTF-8 string
const decoded = new TextDecoder("utf-8").decode(new Uint8Array(bytes));

// Wrap in a proper HTML document if it doesn't have one
let html = decoded;
if (!/<html[\s>]/i.test(html)) {
  html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n</head>\n${html}\n</html>`;
}

// Write output
const outputName =
  basename(resolvedPath, extname(resolvedPath)) + ".html";
const outputPath = join(dirname(resolvedPath), outputName);
writeFileSync(outputPath, html, "utf-8");

const size = Buffer.byteLength(html, "utf-8");
console.log(`Extracted: ${outputPath}`);
console.log(`  Size: ${(size / 1024).toFixed(1)} KB`);
