---
name: onboard
description: Session start - reads the changelog's top entry, the decisions, terminology and style docs and the backlog, then summarises the repo's state and proposes the next work package.
disable-model-invocation: true
---

# /onboard — Session Onboarding

`CLAUDE.md` and `MEMORY.md` are already loaded into your context — do **not** re-read them.

Read only these files:

1. `CHANGELOG.md` — **top entry only**: what changed most recently.
2. `docs/decisions.md` — **all of it**: locked decisions that constrain work.
3. `docs/terminology.md` — **all of it** (short): canonical terms to use consistently.
4. `docs/style.md` — **all of it** (short): coding style rules to follow when writing code.
5. `BACKLOG.md` — **all of it**: open work items.

After reading, respond with:
- One sentence on the most recent change.
- Open work from BACKLOG.md (list items with IDs, grouped by topic).
- The `Next up` line below.

End with exactly this line, and only when there is open work: `Next up: <ID> — <one clause on what it is>. Should I start on it?` Name one package: the one a careful colleague would pick next (an explicit "next" in a plan doc, then the backlog's order, then the last changelog entry's unfinished thread). A short affirmative from the user means start on it, with no further confirmation.

Keep the response to 14–18 lines total.
