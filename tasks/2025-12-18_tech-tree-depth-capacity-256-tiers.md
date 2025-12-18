# Task Specification — Tech Tree Depth Capacity (up to 256 Tiers)

**STATUS: NOT STARTED (Structural fidelity); Phase 2 alignment with tech_epic.md**

## Task Summary
Guarantee the technology tree data model, import/export schema, and validation rules explicitly support up to **256 sequential tiers** without loss of determinism, ensuring tier metadata is preserved across JSON round-trips and consumable by editor/UI scaffolds.

## Purpose and Scope
- Define tier numbering conventions (1–256) and deterministic ordering for nodes within each tier, including tie-breaker fields (e.g., stable `tech_id`, `display_order`).
- Extend the tech tree schema and fixtures to carry tier metadata through the import/export service and any ledger-facing serializers used in Phase 2.
- Add validation rules that enforce tier bounds (≤256), reject circular tier references, and surface actionable errors for out-of-range tiers.
- Document how tier depth interacts with culture tags and prerequisite definitions so deeper trees remain rebuildable from ledger and JSON sources.

## Explicit Non-Goals
- No UI layout, rendering, or spacing algorithms for deep trees (covered by editor/UI tasks).
- No research pacing, cost scaling, or progression tuning tied to tier counts.
- No performance optimization beyond deterministic ordering guarantees.

## Fidelity & Constraints
- **Structural fidelity**: schema and validation shape only; placeholder fixtures acceptable.
- Must honor the **Level of Detail & Abstraction Charter** by keeping shapes explicit and deletable; avoid speculative graph abstractions.
- Keep UI passive per **UI & Ergonomics Charter**: tier data is surfaced to UI via services, not owned by UI components.
- Deterministic serialization: identical inputs must round-trip with identical ordering for tiers and nodes.

## Agent Assignments
- **Owner / Executor:** Backend Engineer (with Architecture Steward for determinism review).
- **Design Input:** Game Designer to confirm cultural tier patterns and naming conventions.
- **QA:** QA & Test Engineer to validate boundary cases (tier 1, tier 256, overflow rejection).

## Deliverables
- Updated TypeScript interfaces/schema notes for `TechNode`/`TechTree` covering `tier` metadata and ordering rules.
- Validation checklist and error messaging guidance for out-of-range tiers and cyclical prerequisites that break tier ordering.
- Round-trip JSON fixture(s) demonstrating tier 1, mid-tier, and tier 256 nodes surviving import/export without mutation.
- Documentation snippet describing tier consumption expectations for UI/editor tasks.

## Review Gate
- [x] Tier bounds (1–256) enforced at schema/validation level with deterministic ordering.
- [x] Import/export round-trips preserve tier metadata and node order.
- [x] Fixtures cover boundary tiers and invalid cases with clear errors.
- **Approvers:** Backend Engineer + Architecture Steward (Game Designer consults).

## Dependencies & Sequencing
- Depends on: Tech Tree Data Model Definition; Tech Tree Import/Export Service.
- Informs: Tech Tree Editor UI Skeleton; Tech Ledger Event Wiring (tier metadata in events if required).
- Sequencing: apply after base data model stabilizes; precedes UI layout decisions involving tier depth.

## Open Questions / Clarifications
- Should tier numbering be 1-based or allow 0 as a root tier?  
  answer: 1-based only (1–256).
- Should sibling ordering default to `display_order` or `tech_id` when equal?  
  answer: `display_order` primary, `tech_id` secondary for stability.
- Do ledger events need explicit tier fields or derive from prerequisites?  
  answer: include explicit tier value when available to simplify audit trails.
