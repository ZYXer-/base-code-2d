---
name: requirements-elicitation
description: Before a plan is written - a guided brain dump of a feature. Asks the user questions in small batches until their ideas, wishes, requirements and limits are understood and the gaps are found, then suggests /create-plan-doc.
disable-model-invocation: true
---

# /requirements-elicitation — Understand a feature before planning it

The user has an idea for a feature and wants to brain dump everything about it, guided by your questions. The goal is to understand their ideas, wishes, requirements and limitations well enough that `/create-plan-doc` can be written without guessing, and to find the holes they have not thought about yet.

- Start from what has already been said in this conversation; do not ask for it again.
- Ask in batches of at most eight questions, fewer is better: several small batches beat one big one. Group related questions, and put your recommendation beside a question where you have one, so a one-word answer works.
- Hunt for gaps actively: edge cases, failure paths, interactions with existing features and with the repo's binding decisions, what is out of scope, what "done" looks like. Say plainly when a wish conflicts with something the repo has already decided.
- Keep it conversational. No fixed opening or closing; recap your understanding when it helps.
- Stop when you have no more gaps, or when the user says so. Then say you are ready and suggest running `/create-plan-doc`.

Nothing is written to the repo during this skill.
