/**
 * Post-export script that strips the HTML/Head/Body shell from the exported
 * email template, producing a CC-ready file that won't double-nest when
 * Constant Contact wraps it in its own <html><body>.
 *
 * Usage: node scripts/cc-export.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { toCcHtml } from "../emails/cc-transform.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputPath = resolve(__dirname, "../out/aei-connect.html");
const outputPath = resolve(__dirname, "../out/aei-connect-cc.html");

const html = readFileSync(inputPath, "utf-8");

let ccHtml;
try {
  ccHtml = toCcHtml(html);
} catch (err) {
  console.error(err.message, "-", inputPath);
  process.exit(1);
}

writeFileSync(outputPath, ccHtml, "utf-8");

const inputSize = Buffer.byteLength(html, "utf-8");
const outputSize = Buffer.byteLength(ccHtml, "utf-8");
console.log(`CC export: ${outputPath}`);
console.log(`  Full HTML: ${(inputSize / 1024).toFixed(1)} KB`);
console.log(`  CC-ready:  ${(outputSize / 1024).toFixed(1)} KB`);
