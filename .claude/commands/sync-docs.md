# /sync-docs — Sync Documentation

First, orient yourself to what has changed since the last sync:

1. Run `git diff HEAD` and `git status` to see modified files.
2. Read the most recent entry in `CHANGELOG.md` — its date tells you roughly when docs were last in sync.
3. Skim `git log --oneline --since="<that date>"` to catch commits not yet reflected in docs.

Then review whether any of the following files need updating, based on what actually changed — not just what happened in this session. Make any necessary changes.

- `CHANGELOG.md` — development log. If the most recent entry covers the same theme as this session, append to it and update its date rather than creating a new entry. Only create a new entry if this session is clearly a separate piece of work. One bullet per change, one clause per bullet — no prose paragraphs.
- `README.md` — project overview and file layout. Update if layout changed. Do not add changelog content here.
- `CLAUDE.md` — operational context for Claude: conventions, architecture decisions, key paths. Update if any behavior, rule, or status changed.
- `BACKLOG.md` — open work items. Mark completed items done, add newly discovered items with the correct ID format (`<TOPIC>-<NUMBER>`).
- `docs/decisions.md` — locked design and tech decisions. Add decisions made this session. Remove or correct superseded ones. Do NOT add implementation details or preferences — only choices that rule out alternatives.
- `docs/terminology.md` — canonical terms. Add new terms introduced this session; update or remove any that no longer apply.

For each file, either make the changes or explicitly confirm no changes are needed.
