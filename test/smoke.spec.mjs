import { test, expect } from "@playwright/test";

/**
 * Boot smoke test for the engine.
 *
 * This covers the gap that `npm run check-imports` cannot: that guard proves
 * every module *resolves*, this proves they *execute*. The 2026-06-12 utils
 * reorganisation left the engine unable to boot for two months without any
 * check noticing (ENG-17) — this is the check that would have noticed.
 *
 * Deliberately NOT a visual regression suite: particles, Math.random, and
 * delta-time animation make pixel snapshots flaky. It asserts the engine boots,
 * renders something, and keeps running.
 */

// Headless Chromium blocks autoplay, so Howler reports a suspended
// AudioContext. Expected in this environment, not a failure.
const IGNORED_CONSOLE = [
    /AudioContext/i,
    /autoplay/i,
    /user gesture/i,
    /play\(\) failed/i,
];


// The loading screen runs a deliberate FAKE_LOADING_TIME (see js/Settings.js)
// on top of real asset loading, so give the boot generous headroom.
const BOOT_TIMEOUT = 25_000;


function isIgnorable(text) {
    return IGNORED_CONSOLE.some((pattern) => pattern.test(text));
}


/**
 * Samples the canvas: how many pixels are drawn, plus a cheap checksum so
 * successive samples can be compared to prove the render loop is live.
 */
function sampleCanvas() {
    const canvas = document.getElementById("game");
    if (canvas === null) {
        return { found: false };
    }
    const context = canvas.getContext("2d");
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);

    let litPixels = 0;
    let checksum = 0;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a !== 0 && (r !== 0 || g !== 0 || b !== 0)) {
            litPixels++;
            checksum = (checksum + r * 3 + g * 5 + b * 7 + i) % 2147483647;
        }
    }
    return { found: true, litPixels, checksum, total: data.length / 4 };
}


test.describe.serial("engine boot", () => {

    const pageErrors = [];
    const consoleErrors = [];
    const badResponses = [];
    let firstSample;
    let secondSample;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();

        page.on("pageerror", (error) => {
            pageErrors.push(error.message);
        });

        page.on("console", (message) => {
            if (message.type() === "error" && !isIgnorable(message.text())) {
                consoleErrors.push(message.text());
            }
        });

        page.on("requestfailed", (request) => {
            badResponses.push(`${request.url()} — ${request.failure()?.errorText ?? "failed"}`);
        });

        page.on("response", (response) => {
            const url = response.url();
            if (!url.endsWith(".js")) {
                return;
            }
            const type = response.headers()["content-type"] ?? "";
            if (!type.includes("javascript")) {
                // The dev server's SPA fallback answers 200 + text/html for
                // missing files (INF-8), which is how a stale import path hides.
                badResponses.push(`${url} — served as "${type}" instead of JavaScript`);
            }
        });

        await page.goto("/", { waitUntil: "load" });

        // Surface load-time failures immediately with their real message —
        // otherwise a dead module only shows up as a blank-canvas timeout
        // 25 seconds later, which points at the wrong thing.
        await page.waitForTimeout(1000);
        const earlyFailures = [...pageErrors, ...consoleErrors, ...badResponses];
        if (earlyFailures.length > 0) {
            throw new Error("engine failed during load: " + earlyFailures.join(" | "));
        }

        // Wait for the engine to actually draw something.
        await expect
            .poll(() => page.evaluate(sampleCanvas).then((s) => (s.found ? s.litPixels : 0)),
                { timeout: BOOT_TIMEOUT, message: "canvas never rendered any non-black pixels" })
            .toBeGreaterThan(0);

        firstSample = await page.evaluate(sampleCanvas);
        await page.waitForTimeout(1500);
        secondSample = await page.evaluate(sampleCanvas);
    });


    test("throws no uncaught errors during boot", () => {
        expect(pageErrors, `uncaught errors:\n${pageErrors.join("\n")}`).toEqual([]);
    });


    test("logs no console errors during boot", () => {
        expect(consoleErrors, `console errors:\n${consoleErrors.join("\n")}`).toEqual([]);
    });


    test("serves every module as JavaScript", () => {
        expect(badResponses, `bad responses:\n${badResponses.join("\n")}`).toEqual([]);
    });


    test("renders to the canvas", () => {
        expect(firstSample.found, "canvas #game not found").toBe(true);
        expect(firstSample.litPixels, "canvas is entirely blank").toBeGreaterThan(0);
    });


    test("keeps the render loop running", () => {
        // Something on screen must change between samples — the demo menu
        // animates continuously, so a frozen checksum means the loop died.
        expect(secondSample.checksum, "canvas is static — render loop appears stalled")
            .not.toBe(firstSample.checksum);
    });

});
