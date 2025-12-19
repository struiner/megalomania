# Task Specification — Culture Tag Multi-Select Combobox

**STATUS: COMPLETE (Structural fidelity; combobox live with keyboard search + legacy grid fallback toggle)**

## Task Summary
Replace the checkbox grid for culture tags in the tech tree editor with an accessible multi-select dropdown/combobox that supports search, deterministic ordering, and keyboard navigation while staying within the UI charter’s restraint rules.

## Purpose and Scope
- Deliver a multi-select dropdown for culture tags that surfaces authoritative vocabulary from `TechTreeIoService` and preserves deterministic ordering.
- Provide typeahead/filtering and keyboard-first navigation to reduce visual clutter and align with ergonomic expectations for dense tag sets.
- Ensure selections still round-trip through import/export without introducing UI-owned truth.

## Explicit Non-Goals
- No redesign of the underlying culture tag schema or enum bindings.
- No persistence layer or ledger wiring changes; UI remains a passive editor surface.
- No additional tag analytics or recommendations (defer to later UX tasks).

## Fidelity & Constraints
- **Structural fidelity**: working combobox with search/filter, keyboard support, and deterministic ordering; placeholder styling allowed.
- Must respect **UI & Ergonomics Charter** (limited visible actions, pixel integrity, shallow modal depth).
- Keep the existing checkbox grid behind a feature flag or fallback to avoid blocking current flows.

## Agent Assignments
- **Owner / Executor:** Frontend Developer.
- **Consultation:** Game Designer for labeling and density preferences.
- **QA:** QA & Test Engineer for accessibility (keyboard) and determinism checks.

## Deliverables
- Combobox component (or adoption of an existing shared picker) wired into `TechTreeEditorComponent` with deterministic ordering.
- Search/filter logic sourcing options from `TechTreeIoService.getCultureTagOptions` without duplicating vocabularies.
- Fallback/feature-flag toggle between combobox and current checkbox grid.
- Accessibility notes (keyboard focus order, aria-labels) and README updates.

**Evidence:** Culture tag combobox renders as the primary picker with search/keyboard navigation, legacy grid is toggleable for audits, and README records the pattern.【F:v1/src/app/pages/tech-tree-editor/culture-tag-combobox.component.ts†L1-L227】【F:v1/src/app/pages/tech-tree-editor/tech-tree-editor.component.ts†L82-L178】【F:v1/src/app/pages/tech-tree-editor/README.md†L14-L23】

## Review Gate
- [ ] Multi-select combobox preserves deterministic ordering and round-trips through export/import.
- [ ] Accessibility and keyboard navigation validated; search/filter works with 100+ tag sets.
- [ ] UI charter respected (no overcrowding; minimal primary actions exposed).
- **Approvers:** Frontend Developer + QA & Test Engineer (Architecture Steward for ownership guardrail).

## Dependencies & Sequencing
- Depends on: existing culture tag options from `TechTreeIoService` and editor selection plumbing in `TechTreeEditorService`.
- Precedes: culture tag CRUD task (so new tags can surface in the picker once created).

## Open Questions / Clarifications
- Should the combobox be globalized for reuse across SDK pickers?
    Answer: yes—design it as a shared SDK picker if it does not compromise scope or charter limits.
- Is grouping by namespace (biome/settlement/guild) required in the dropdown?
    Answer: grouping by namespace is preferred if it remains compact; avoid deep nested menus.
- Should the combobox display applied tags as inline tokens or within the dropdown summary?
    Answer: inline tokens below the field are acceptable if limited to a single row with truncation and tooltip for overflow.
