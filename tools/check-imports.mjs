#!/usr/bin/env node

/**
 * Verifies that every relative import specifier under js/ resolves to a real
 * file on disk.
 *
 * Why this exists: there is no build step, so nothing rewrites import paths
 * when a module moves. ESLint does not resolve specifiers either, and the dev
 * server's SPA fallback answers 200 with index.htm for any missing file — so a
 * stale path surfaces in the browser as an opaque MIME-type error rather than
 * a 404. The js/utils/ reorganisation of 2026-06-12 left 42 such paths behind
 * and the engine failed to boot for two months (ENG-17).
 *
 * Exits non-zero if anything fails to resolve.
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, resolve, relative, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SCAN_DIR = join(ROOT, "js");
const SKIP_DIRS = new Set(["libs", "node_modules"]);

// from "x" | import "x" | export ... from "x" | import("x")
const SPECIFIER_PATTERN = /(?:\bfrom\s*|\bimport\s*\(?\s*)["']([^"']+)["']/g;


function collectFiles(dir) {
    const found = [];
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
            if (!SKIP_DIRS.has(entry)) {
                found.push(...collectFiles(full));
            }
        } else if (entry.endsWith(".js")) {
            found.push(full);
        }
    }
    return found;
}


function lineOf(source, index) {
    return source.slice(0, index).split("\n").length;
}


const problems = [];
let checked = 0;

for (const file of collectFiles(SCAN_DIR)) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(SPECIFIER_PATTERN)) {
        const spec = match[1];
        if (!spec.startsWith(".")) {
            continue;  // bare specifier — third-party global, not our concern
        }
        checked++;
        const where = `${relative(ROOT, file).split(sep).join("/")}:${lineOf(source, match.index)}`;
        if (extname(spec) === "") {
            problems.push(`${where}  ${spec}  — missing file extension (ES modules require it)`);
        } else if (!existsSync(resolve(dirname(file), spec))) {
            problems.push(`${where}  ${spec}  — does not resolve`);
        }
    }
}

if (problems.length > 0) {
    console.error(`\nBroken import paths (${problems.length} of ${checked} checked):\n`);
    for (const problem of problems) {
        console.error(`  ${problem}`);
    }
    console.error("");
    process.exit(1);
}

console.log(`check-imports: ${checked} relative imports OK`);
