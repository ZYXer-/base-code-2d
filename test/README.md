# Base Code Test Suite

These tests exist to protect **the base code itself** — they verify that the
engine still boots and runs after a refactor. They are deliberately *not*
intended for games built on top of this repo.

Nothing here tests game content. The assertions are all engine-level: modules
execute, the canvas renders, the render loop keeps ticking.

## Why it exists

`npm run check-imports` proves every module *resolves*. It cannot prove they
*execute*. The 2026-06-12 `js/utils/` reorganisation left 42 stale import paths
behind and the engine could not boot for two months — ESLint passed, the dev
server returned HTTP 200 for every broken path, and nothing caught it (ENG-17).

This suite is the check that would have caught it, in about one second.

## Running

```bash
npm test           # headless
npm run test:headed   # watch it in a real browser window
```

The suite starts the dev server itself; you do not need `npm start` running
first. If a server is already on port 8080, it reuses it.

First run on a new machine needs the browser binary:

```bash
npx playwright install --only-shell chromium
```

`--only-shell` fetches the ~115 MB headless shell rather than a full browser,
into a shared cache outside this repo.

## What it asserts

| Test | Catches |
|---|---|
| No uncaught errors during boot | Dead modules, `ReferenceError`s on the boot path |
| No console errors during boot | Failed module scripts, asset load failures |
| Every module served as JavaScript | Stale import paths hidden by the dev server's SPA fallback (INF-8) |
| Renders to the canvas | Engine boots but draws nothing |
| Render loop keeps running | Loop dies or stalls after first frame |

## What it deliberately does NOT do

**No visual/pixel regression testing.** Particles, `Math.random`, delta-time
animation, and screen shake make snapshots flaky. A flaky suite during a game
jam is worse than no suite. Keep assertions structural.

## Removing it for a new project

This suite is base-code infrastructure. When copying the repo as a starting
point for an actual game, strip it:

```bash
rm -rf test/
npm uninstall --save-dev @playwright/test
```

Then remove the `test` and `test:headed` entries from `package.json` scripts,
and the Playwright block from `.gitignore`.

Keep `tools/check-imports.mjs` and the `lint` script — those are cheap, have no
dependencies, and stay useful in a real project.
