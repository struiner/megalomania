# Task Specification — Tech Tree Dynamic Tier Grid (Gridster evaluation)

**STATUS: COMPLETE (Structural fidelity; tier grid with add/trim controls + deterministic mapping live)**

## Task Summary
Evaluate and implement a gridster-style layout option for the tech tree editor so designers can dynamically create, resize, and rearrange tier bands while keeping node placement deterministic and ergonomically aligned with the UI charter.

## Purpose and Scope
- Provide an optional grid container that supports adding/removing tiers and snapping nodes into cells without breaking existing deterministic ordering.
- Preserve the current drag-and-drop semantics while allowing tier creation via a controlled affordance (e.g., add-tier button or context menu) that respects the **UI & Ergonomics Charter**.
- Keep exports/imports stable by mapping grid positions back to `tier` and `display_order` in the existing data model.

## Explicit Non-Goals
- No introduction of new tech progression logic or ledger writes.
- No visual polish beyond pixel-aligned grid scaffolding; advanced animations and art treatments are deferred.
- No dependency on non-free or heavyweight libraries if a lighter alternative meets requirements.

## Fidelity & Constraints
- **Structural fidelity**: working grid layout with deterministic mapping to tiers and ordering; placeholder styling is acceptable.
- Must honor **UI & Ergonomics Charter** limits (stable layout, shallow modals, minimal visible primary actions).
- Integrate without making the editor own authoritative tech data; UI remains a tool over imported/exported trees.

## Agent Assignments
- **Owner / Executor:** Frontend Developer (with Architecture Steward review for ownership boundaries).
- **Consultation:** Game Designer for ergonomic expectations on tier creation and visual density.
- **QA:** QA & Test Engineer for determinism checks on drag/drop and export ordering.

## Deliverables
- Gridster-style layout integration or approved lightweight alternative with tier add/remove controls.
- Mapping logic from grid coordinates to `tier`/`display_order` fields preserved across import/export via `TechTreeIoService`.
- Updated tech tree editor shell wiring and README notes describing grid behavior and fallbacks.
- Validation notes/tests covering deterministic ordering after tier mutations.

**Evidence:** Lightweight grid layout maps tier rows to display_order columns with drag/drop, add/trim tier controls, and clamped mapping inside the editor service; README documents the behavior.【F:v1/src/app/pages/tech-tree-editor/tech-tree-editor.component.ts†L53-L168】【F:v1/src/app/pages/tech-tree-editor/tech-tree-editor.service.ts†L71-L158】【F:v1/src/app/pages/tech-tree-editor/README.md†L10-L16】

## Review Gate
- [ ] Grid interactions keep exports deterministic and reversible through `TechTreeIoService`.
- [ ] Tier creation/removal controls respect UI charter (discoverable, shallow modal depth, limited primary actions).
- [ ] No UI-owned truth; all changes flow through existing editor service and models.
- **Approvers:** Frontend Developer + Architecture Steward (Game Designer consulted on ergonomics).

## Dependencies & Sequencing
- Depends on: existing tech tree editor shell and `TechTreeEditorService` drag/drop plumbing (`v1/src/app/pages/tech-tree-editor/tech-tree-editor.component.ts`).
- Precedes: aesthetic preview dialog and advanced validation tasks.

## Open Questions / Clarifications
- Should the grid integration prefer an external dependency (e.g., gridster) or a bespoke lightweight grid to maintain pixel integrity?
    Answer: default to a lightweight grid; only add a dependency if it materially improves ergonomics without violating determinism.
- How many visible tier bands should be supported before virtualization is required?
    Answer: target up to 32 tiers at structural fidelity; revisit after performance profiling.
- Do nodes need column locks within a tier (e.g., category clusters) or is free placement acceptable?
    Answer: free placement within a tier is acceptable at this stage; category-based locking can be a follow-up.
