import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the base code's own test suite.
 *
 * This suite exists to verify the ENGINE still boots and runs — it is not
 * intended for games built on top of this repo. See test/README.md for how to
 * strip it when starting a new project.
 */
export default defineConfig({

    testDir: ".",
    testMatch: "**/*.spec.mjs",

    // The suite is a boot check, not a matrix — keep it fast and serial.
    fullyParallel: false,
    workers: 1,
    forbidOnly: !!process.env.CI,
    retries: 0,
    reporter: process.env.CI ? "list" : [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],

    use: {
        baseURL: "http://localhost:8080",
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
    },

    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                // Matches `npx playwright install --only-shell chromium`, so no
                // full browser download is required.
                channel: "chromium-headless-shell",
            },
        },
    ],

    webServer: {
        command: "npm start",
        url: "http://localhost:8080",
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
        cwd: "..",
    },

});
