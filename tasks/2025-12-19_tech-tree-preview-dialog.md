# Task Specification — Aesthetic Tech Tree Preview Dialog

**STATUS: NOT STARTED (Structural fidelity; Phase 2 follow-up)**

## Task Summary
Add a button to the tech tree editor that opens an aesthetically refined preview of the current tree inside a dialog, using deterministic data from the editor service while respecting the UI charter’s shallow modal rules.

## Purpose and Scope
- Provide a dialog-triggered preview that renders the tech tree with improved spacing, iconography, and culture tag overlays without altering the underlying editor data.
- Ensure the preview is read-only, driven by `TechTreeEditorService`, and matches export ordering so designers can sanity check layout before publishing.
- Keep modal depth at 1–2 levels and avoid obstructing core editing flows.

## Explicit Non-Goals
- No new research mechanics, progression logic, or ledger events.
- No print/export-to-image pipeline (can be a follow-up task).
- No bespoke animation or parallax beyond informational highlighting.

## Fidelity & Constraints
- **Structural fidelity**: functional dialog with read-only preview and placeholder styling; aesthetic refinements scoped to layout and icon usage.
- Must respect **UI & Ergonomics Charter** (limited modal depth, unobtrusive overlay, pixel alignment) and avoid UI-owned truth.
- Use existing tech icon registry and culture tags; no duplicate vocabularies.

## Agent Assignments
- **Owner / Executor:** Frontend Developer.
- **Consultation:** Game Designer for aesthetic direction and readability priorities.
- **QA:** QA & Test Engineer for determinism and modal accessibility.

## Deliverables
- New preview button in the tech tree editor action dock that opens a dialog overlay.
- Read-only preview component leveraging `TechTreeEditorService` data and `TechIconRegistryService` icons, with culture tag overlays.
- Documentation/notes on how the preview aligns with export ordering and how to extend styling later.
- Basic accessibility checks (focus trap, escape handling) consistent with existing dialog shells.

## Review Gate
- [ ] Dialog is read-only, respects modal depth rules, and uses deterministic data ordering.
- [ ] Preview styling leverages existing icon/tag assets without duplicating truth or enums.
- [ ] Accessibility and close semantics match existing HUD/SDK dialog patterns.
- **Approvers:** Frontend Developer + Architecture Steward (Game Designer consulted for aesthetics).

## Dependencies & Sequencing
- Depends on: tech tree editor action dock and data signals from `TechTreeEditorService`.
- Related to: grid layout task for tier positioning (preview should reflect grid layout once available).

## Open Questions / Clarifications
- Should the preview use the same connection overlay as the editor or a simplified static render?
    Answer: start with the existing overlay component; allow swap-out if readability demands a simplified render.
- Do we need zoom/pan controls in the dialog?
    Answer: optional—include stubbed controls if they do not complicate modal depth; otherwise defer.
- Should culture tags display as overlays or legend?
    Answer: include a compact legend below the preview; overlays are acceptable if they remain readable.
