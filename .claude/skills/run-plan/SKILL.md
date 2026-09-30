---
name: run-plan
description: Implement an approved plan to the end without the user in the loop - one plan-worker subagent per work package (onboard, that package only, sync-docs, report), the plan doc kept current, decisions that came up recorded in the plan, blocking ones brought to the user.
disable-model-invocation: true
---

# /run-plan — Work a plan to the end, one subagent per package

The input is free-form: a plan doc, one or more work-package ids, or a feature name. Resolve it to a plan doc in `docs/`. If there is no concrete implementation plan for it, stop and point to `/requirements-elicitation` followed by `/create-plan-doc`; this skill does not plan.

## Before the first package

- Read the plan. Put every decision still marked **Open:** to the user now, so the run does not stall on it later, and write the answers into the plan.
- Start at the first package that is not done. An interrupted run resumes the same way.
- Tell the user which packages you are going to run, then go. Subagent permission prompts surface in this session, so an unattended run needs a permission mode that does not prompt.

## Each package

Spawn one `plan-worker` subagent in the foreground and wait for it. The agent definition pins the model and effort; if the user asked for a different model when starting the run, pass it on the spawn call, which overrides the definition. A different effort can only be set in `.claude/agents/plan-worker.md` itself, so say so and ask before editing it. Brief the subagent by reference, not by restating the plan:

- The plan doc's path and the one package it implements, and nothing beyond that package.
- The repo's full gate (tests, linters, whatever the repo's docs require before calling work done) must be green before it reports. Then it runs `.claude/skills/sync-docs/SKILL.md`, which also brings the plan doc up to date.
- If a decision comes up that the plan does not settle: one that leaves the plan's shape intact, it makes itself and records under "Things that came up" with the choice and why. One that would change the shape (a different approach, a rewrite, a stored-data or format change, anything the repo's decisions reserve for the user) is not its to make: it stops, leaves the package unfinished, and reports the question.
- Commits: whatever the repo's own rules say; this skill adds nothing.
- Its report, kept short: package id and done or what stopped it; files changed; the gate's result, with the last lines if red; every decision or shortcut taken and why; anything done beyond the package; anything it could not do; any question for the user.

After the report:

- **Red gate or unfinished, no question**: one more round with the same subagent, which still holds the context, telling it what failed. If that fails too, stop and report to the user.
- **A question**: ask the user. Write the answer into the plan's Decisions, then continue with the same subagent if it is still alive, otherwise a fresh one on the same package.
- **Done**: one line of progress to the user (package, outcome, what is next), then the next package.

Anything a report established that the plan does not yet say goes into the plan before the next subagent is briefed. You read reports and the plan, never the files a subagent read; keeping your own context small is the point of the loop.

## At the end

Go through "Things that came up" with the user, item by item. What they want done becomes new work packages in the plan doc; the rest stays recorded there. Then report: packages done, the gate's state, and what is left to them.
