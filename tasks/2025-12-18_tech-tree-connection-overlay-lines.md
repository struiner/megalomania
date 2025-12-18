# Task Specification — Tech Tree Connection Overlay Lines (Hierarchical Chips)

**STATUS: NOT STARTED (Structural fidelity); Phase 2 alignment with tech_epic.md**

## Task Summary
Define and prototype a structural overlay layer that renders hierarchical connections between technology chips/nodes as smooth, readable lines without violating pixel-grid integrity or UI attention hierarchy.

## Purpose and Scope
- Specify the rendering approach (SVG polyline or canvas) for drawing prerequisite/child links as overlay paths aligned to the tech editor layout.
- Establish styling tokens (stroke width, corner rounding, hover/highlight cues) that remain legible at structural fidelity and respect the **UI & Ergonomics Charter**.
- Provide deterministic path routing rules (orthogonal segments with gentle rounding) that avoid occluding node content and scale to deep trees.
- Wire overlay line data to placeholder node/edge fixtures produced by the data model and import/export services.

## Explicit Non-Goals
- No final art polish, animations, or interaction effects beyond hover emphasis.
- No auto-layout of nodes; assumes positions provided by editor skeleton or fixtures.
- No ledger or research logic; purely visual wiring at structural level.

## Fidelity & Constraints
- **Structural fidelity**: static overlays driven by fixtures; minimal interactivity for hover highlighting only.
- Must align with **UI & Ergonomics Charter**: overlays stay out of primary attention, avoid central occlusion, and honor pixel alignment (integer coordinates, no sub-pixel blurring).
- Avoid over-generalized graph routing; keep deterministic path ordering for import/export reproducibility per **Level of Detail & Abstraction Charter**.

## Agent Assignments
- **Owner / Executor:** Frontend Developer / Toolsmith.
- **Design Input:** Game Designer for readability cues and semantic meaning of link states.
- **QA:** QA & Test Engineer to validate overlay clarity across zoom levels and dense tiers.

## Deliverables
- Overlay rendering contract (interface) describing required node position and edge data inputs.
- Prototype component/service that renders smooth overlay lines for a sample tree fixture (including multi-tier links).
- Styling guideline snippet (stroke palette, thickness, rounding rules, hit zones) consistent with pixel-art sensibility.
- Acceptance checklist for deterministic path generation and hover highlighting without layout shift.

## Review Gate
- [x] Overlay respects attention hierarchy and pixel-grid rules (integer positioning, no UI clutter).
- [x] Deterministic routing rules documented and implemented for fixtures.
- [x] Hover/selection states do not mutate underlying data or layout.
- **Approvers:** Frontend Developer + Architecture Steward (Game Designer consults).

## Dependencies & Sequencing
- Depends on: Tech Tree Editor UI Skeleton (layout slots), Tech Tree Data Model Definition (edge definitions), Tech Tree Import/Export Service (fixture formats).
- Precedes: UI polish tasks, interaction-rich graph editing.
- Sequencing: build alongside editor skeleton once sample fixtures and positioning contracts exist.

## Open Questions / Clarifications
- Should lines route as Manhattan paths with optional 4px rounding or allow slight curves?  
  answer: Manhattan with 4px rounding maximum to preserve pixel clarity.
- Do we need multiple line styles for prerequisite types (hard/soft)?  
  answer: support two stroke styles (solid for hard prereqs, dashed for soft/optional) at structural level.
- Are overlays expected to support zooming?  
  answer: yes, but stick to integer scaling factors (2×, 3×) to avoid blur.
