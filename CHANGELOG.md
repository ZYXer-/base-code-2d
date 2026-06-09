# Changelog

Entries are in reverse chronological order. One bullet per change, one clause per bullet.

---

## 2026-06-09

- Initialized project documentation: `CLAUDE.md`, `README.md`, `BACKLOG.md`, `CHANGELOG.md`, `docs/decisions.md`, `docs/terminology.md`
- Added `.claude/commands/onboard.md` and `.claude/commands/sync-docs.md` skills for AI-assisted development
- Split `Utils.js` into `NumberUtils.js` (numeric/random helpers), `DataUtils.js` (arrays, objects, matrix, IDs), and `StringUtils.js` (string helpers); `Utils.js` retains canvas creation, parallax, stopwatch, and arrow-key controls
- Updated all callers across `js/core/` and `js/utils/` to import from the new modules using namespace imports (`* as NumberUtils`, `* as DataUtils`)
- Auto-fixed keyword-spacing, prefer-const, and trailing-space warnings across all `js/utils/` files via ESLint `--fix`
- Fixed `!=` → `!==` in `Particle.js`, removed unused GeometryUtils imports in `Easing.js` and `TerrainGeneration.js`, added missing `Timer` import to `Utils.js` `stopwatch`
- Added backlog items CLN-9 (DrawUtils `c` param inconsistency), CLN-10 (expand StringUtils), CLN-11 (rehome remaining Utils.js functions)

---

## 2022 (approximate) — Post-LD50 Update

- `FIXED_SIZE_IN_UNITS` can now be used to constrain only one viewport dimension (previously required both)

---

## ~2020 — Pre-Ludum-Dare / GGJ Fixes

- Fixed `PauseScreen` missing `Text` import
- Fixed Tooltip dimension reading
- Fixed Tooltip deep compare for object content
- Started splitting `Utils.js` into `DrawUtils.js` and `GeometryUtils.js` (WIP)
- Various minor bugfixes discovered during GGJ 2020
- Updated Express dependency
