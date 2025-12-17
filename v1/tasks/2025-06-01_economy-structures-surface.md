# Task Specification: Economy Structures Surface

## Task Summary
Replace the placeholder `KirbyComponent` on `economy/structures` with a proper structures catalogue surface that lists structure archetypes, costs, inputs/outputs, and unlock conditions using existing goods data.

## Trigger
* `MENU` entry `economy/structures` is routed to `KirbyComponent` (stub).
* No UI exists to browse structure definitions tied to goods and production.

## Explicit Non-Goals
* No new goods or structures are invented in this task.
* No gameplay simulation or build queue logic is added.
* No ledger or economy schema changes.

## Agent Assignments
* **Project Manager** — Scope control and sequencing.
* **Economy Engineer (Primary)** — Supply/read structure catalogue schema and ensure outputs reference existing goods categories.
* **Frontend Developer** — Build Angular UI for list + detail panes, sorted/grouped by category; wire to provided read-only data source.
* **QA & Test Engineer** — Validate build/lint and check that UI renders with empty/loaded data without crashes.

## Data / Inputs
* Existing goods definitions from `GoodsOverviewComponent`/related data services.
* Structure catalogue data (stub JSON acceptable) with deterministic IDs and references to goods.

## Deliverables
* Standalone component bound to `economy/structures` route, replacing `KirbyComponent`.
* Read-only listing with filters (by category/tier) and detail drawer showing inputs/outputs and upkeep.
* Copy indicating data is sourced from derived economy views (no direct ledger queries from UI).

## Review Gate
* [ ] Route `economy/structures` renders without console errors and passes build.
* [ ] Data references reuse existing goods identifiers; no ad-hoc strings.
* [ ] UX approved by Project Manager and Economy Engineer (read-only scope).

## Exit Criteria
* Users can browse structure definitions via the new page; placeholder removed from routing.
* Tests/build succeed.
* Documentation/comments updated where necessary to reflect the view contract.
