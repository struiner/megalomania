# Task Specification — Culture Tag Creation & Governance (CRUD)

**STATUS: COMPLETE (Structural fidelity; governance adapter + CRUD modal wired with audit trail)**

## Task Summary
Introduce controlled create/edit/delete flows for culture tags so designers can extend the tech tree vocabulary without violating enum ownership or ledger alignment, documenting governance and validation rules.

## Purpose and Scope
- Provide CRUD affordances (likely in the SDK/tech editor) that let authorized users propose new culture tags or adjust metadata while mapping to the canonical namespaces (`biome`, `settlement`, `guild`).
- Validate new tags against snake_case/namespace rules and prevent collisions with existing enum-derived tags.
- Route changes through a service boundary (adapter or governance queue) instead of binding UI directly to authoritative enums.

## Explicit Non-Goals
- No direct mutation of authoritative enums or ledger schemas from the UI.
- No auto-approval of tags without governance; persistence/storage connectors may be stubbed.
- No changes to tech research logic or progression systems.

## Fidelity & Constraints
- **Structural fidelity**: working CRUD flows with validation and stubbed persistence/governance hooks; UI may use placeholder shells.
- Must adhere to **Level of Detail & Abstraction** (deletable scaffolding) and keep UI passive per **UI & Ergonomics Charter**.
- Ensure determinism for added tags in import/export flows (ordering, normalization).

## Agent Assignments
- **Owner / Executor:** SDK & Modding Engineer (with Architecture Steward guardrails).
- **Consultation:** Game Designer for vocabulary governance and approval criteria.
- **QA:** QA & Test Engineer for validation coverage and determinism checks.

## Deliverables
- CRUD UI/flows (could be a modal or dedicated SDK pane) that emit structured tag proposals with namespace and source binding.
- Validation service covering namespace rules, snake_case normalization, and collision detection against existing vocabulary in `TechTreeIoService`.
- Governance/persistence adapter stubs (e.g., queue or review list) with clear TODOs for authoritative write path.
- Documentation outlining approval workflow, rejection handling, and how new tags propagate to pickers/export.

**Evidence:** Culture tag governance adapter enforces namespace/version rules with audit trail, and the editor modal exposes create/edit/delete proposals with usage-aware deletion guards.【F:v1/src/app/services/culture-tag-governance.adapter.ts†L1-L157】【F:v1/src/app/pages/tech-tree-editor/tech-tree-editor.component.ts†L346-L492】【F:v1/src/app/pages/tech-tree-editor/README.md†L18-L23】

## Review Gate
- [ ] CRUD flows do not mutate authoritative enums directly; changes route through a controlled adapter/governance layer.
- [ ] Validation rejects invalid identifiers and collisions deterministically; export/import handles new tags without breakage.
- [ ] Governance path and TODOs are documented, with UI staying within charter limits (minimal modal depth, no HUD clutter).
- **Approvers:** SDK & Modding Engineer + Architecture Steward (Game Designer consulted for vocabulary rules).

## Dependencies & Sequencing
- Depends on: culture tag vocabulary from `TechTreeIoService` and multi-select combobox task for surfacing new tags.
- Precedes: any ledger or research tasks that rely on extended culture tag sets.

## Open Questions / Clarifications
- Where should governance records live (ledger event, config repo, or moderated queue)?
    Answer: use a stubbed moderation queue in Phase 2; ledger/event alignment can be a follow-up task.
- Should edits be versioned with migration hooks?
    Answer: yes—include a simple version/migration number in tag definitions to keep import/export deterministic.
- Are deletions allowed to cascade to existing tech nodes?
    Answer: no cascading deletes; surface blocking validation and require manual reassignment before removal.
