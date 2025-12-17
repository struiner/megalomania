# Meta-Task Specification

## Automated Task Spec Generation from Codebase Signals

This document defines a **recursive, meta-level task** whose purpose is to let Codex **generate future task specifications** (`task.md` files) by scanning the repository for signals such as:

* Placeholder components
* TODO / FIXME comments
* Stub routes or empty services
* Incomplete integrations

This meta-task does **not implement features directly**.
It produces **new, agent-oriented Task Specification documents** that can then be executed independently.

---

## 1. Task Summary

**Task name:** Generate Task Specifications from Repository Signals

**Trigger:**

* Presence of placeholders, TODOs, stubs, or incomplete wiring
* Periodic maintenance / cleanup passes

**Purpose:**

* Convert implicit work into **explicit, agent-scoped tasks**
* Reduce cognitive load on the human project owner
* Keep the roadmap aligned with the actual codebase state

**Explicit Non-Goals:**

* No direct code changes
* No feature implementation
* No design decisions beyond classification

---

## 2. Authority & Entry Point

This meta-task is initiated by the **Project Manager agent**.

All generated tasks MUST conform to:

* `agents.md`
* The **Reusable Task Specification Template**

---

## 3. Involved Agents

### 3.1 Project Manager (Primary Executor)

Responsibilities:

* Scan the repository for task signals
* Classify findings into candidate tasks
* Decide task granularity (merge/split)
* Assign tentative agent ownership

Constraints:

* Must not invent new mechanics
* Must not silently reprioritize the roadmap

---

### 3.2 Architecture Steward (Guardrail Agent)

**This agent is optional but strongly recommended.**

Owns:

* Structural integrity
* Truth-ownership enforcement

Responsibilities:

* Ensure generated tasks do not violate architectural principles
* Reject tasks that would cause truth leakage (UI owning state, design owning logic, etc.)
* Flag ambiguous ownership for human review

---

### 3.3 Game Designer (Consultative)

Responsibilities:

* Review generated tasks that touch player-facing features
* Clarify intent where placeholders are ambiguous

Non-Responsibilities:

* Does not write task specs

---

## 4. Signal Detection Rules

Codex MUST scan for the following signals:

### 4.1 Code-Level Signals

* Components containing text such as:

  * `TODO`
  * `FIXME`
  * `PLACEHOLDER`
  * `stub`
* Empty Angular templates or components with mock HTML
* Routes pointing to placeholder components
* Services with unimplemented methods throwing errors

### 4.2 Structural Signals

* Folders with index files but no concrete implementations
* UI elements wired to routes/dialogs that do nothing
* Commented-out imports or blocks

---

## 5. Task Extraction Logic

For each detected signal:

1. **Group related signals** (e.g. same feature or route)
2. Determine **domain ownership** using `agents.md`
3. Decide task scope:

   * UI task
   * Ledger task
   * World generation task
   * Cleanup / refactor task

If scope is unclear:

* Generate a task with **clarification required** flag

---

## 6. Task Spec Generation Rules

Each generated task MUST:

* Use the **Reusable Task Specification Template**
* Include:

  * Task Summary
  * Explicit Non-Goals
  * Agent Assignments
  * Review Gate

Naming convention:

```
tasks/
  YYYY-MM-DD_<short-description>.md
```

---

## 7. Output Format

The meta-task produces:

1. A **summary report** listing:

   * All detected signals
   * Proposed task titles
   * Assigned primary agent

2. One `task.md` file per task, ready for execution

No code changes are made at this stage.

---

## 8. Review & Approval Gate

Before tasks are accepted:

* [ ] Tasks respect agent ownership boundaries
* [ ] Tasks do not smuggle in new mechanics
* [ ] Tasks are scoped small enough to be executable
* [ ] Ambiguities are flagged explicitly

Approval authority:

* Human user OR
* Project Manager + Architecture Steward consensus

---

## 9. Execution Cycle

Recommended cadence:

* Run this meta-task:

  * Before major feature pushes
  * After large refactors
  * Periodically (e.g. monthly)

Generated tasks then enter the normal workflow:

Meta-Task → Task Specs → Execution → Archive

---

## 10. Why This Exists (Rationale)

This meta-task exists to:

* Prevent TODO sprawl
* Keep architectural intent visible
* Let Codex assist at the *planning* level, not just implementation

It is intentionally conservative.

> **If work cannot be described as a task spec, it should not be implemented yet.**

---

## 11. Exit Condition

This meta-task is complete when:

* All detected signals have corresponding task specs
* Or are explicitly dismissed with justification

This document itself remains reusable and persistent.
