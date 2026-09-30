---
name: create-plan-doc
description: After requirements are understood - writes a dated design doc in docs/ with a header, fixed sections and session-sized work packages that a fresh session can implement from the doc alone.
disable-model-invocation: true
---

# /create-plan-doc — Creating a plan doc

Write a full design doc of the required changes and save it as `docs/plan-<YYYY-MM-DD>-<topic>.md`, dated the day it is first written (read the clock with a command; do not guess). Include the work packages: sensibly sized, sequentially ordered, one per session so that token usage stays low across sessions, each specified so that a fresh session can do it from this doc alone with no design decision from this conversation lost. If anything is unclear or there is a gap in the design, ask before writing.

The doc opens with this header and these sections, in this order. Add whatever else the plan needs after them.

```markdown
# <Title>

**Created:** YYYY-MM-DD HH:MM
**Updated:** YYYY-MM-DD HH:MM
**Status:** <at most five words>

## Goal
## Requirements
## Decisions
## Things that came up
## Work packages
```

- **Requirements**: a summary of what the user wants and needs, their limits and what is out of scope, usually the outcome of `/requirements-elicitation`. Written so that a session that did not take part in that conversation can check a package against them.
- **Decisions**: each choice made, with the alternative rejected and why. A choice not yet made is listed as **Open:** with its options, and rewritten as a decision once settled.
- **Things that came up**: starts empty. Filled during implementation with what was done or noticed beyond a package, and the decisions taken along the way, each with its why. It is reviewed with the user when the plan is finished.
- **Work packages**: one heading per package, with a stable id in the repo's `<TOPIC>-<NUMBER>` format (topics as listed in `BACKLOG.md`), numbered on from the highest existing id of that topic so plan and backlog ids never collide. A package is marked done only once it is verified.

The header is maintained for the life of the plan: every session that changes the plan's content refreshes **Updated** (marking a package done does not count) and rewrites **Status** to say where the plan stands now. `/sync-docs` does the same.
