# Task Specification — Goods Derived Data & Stats

**STATUS: NOT STARTED (Structural fidelity)**

## Task Summary
Compute derived stats for the goods catalogue (e.g., tier totals, rarity-to-tier mapping, basic aggregates) using deterministic calculations that feed the Goods Manager UI without embedding economic simulation.

## Purpose and Scope
- Implement functions to compute tier/category breakdowns and simple aggregates from `ManagedGood` entries.
- Map rarity to tier where rules exist and expose validation warnings for mismatches.
- Provide outputs consumable by the Goods Manager UI and export routines.
- Use shared enums/models (e.g., `GoodCategory`, `Rarity` in `v1/src/app/models/goods.model.ts`) to keep derived stats DRY and consistent with catalogue/import definitions.

## Explicit Non-Goals
- No price balancing, supply/demand modeling or market simulation.
- No UI rendering; pure data/logic functions only.
- No ledger interactions.

## Fidelity & Constraints
- **Structural fidelity**: straightforward, deterministic functions; avoid premature abstraction per **Level of Detail & Abstraction**.
- Keep UI passive per **UI & Ergonomics Charter**—functions return data, UI displays it.
- Calculations must be reproducible given identical input ordering.

## Agent Assignments
- **Owner / Executor:** Economy Engineer (with SDK & Modding Engineer support).
- **Design Input:** Game Designer for rarity-tier mapping rules.
- **QA:** QA & Test Engineer for determinism and edge-case validation.

## Deliverables
- Utility module for derived stats (tier totals, rarity-tier mapping checks, aggregate counts).
- Validation/warning outputs for mismatches or missing data.
- Documentation on expected inputs/outputs and deterministic ordering.
- Sample fixtures/tests for structural verification.

## Review Gate
- [ ] Derived stats are deterministic and side-effect free.
- [ ] Rarity-tier mapping rules documented and enforced with warnings.
- [ ] Outputs integrate cleanly with Goods Manager UI and export flows.
- **Approvers:** Economy Engineer + Architecture Steward.

## Dependencies & Sequencing
- Depends on: Managed Good Data Model & Enum Integration; Goods Catalogue Import/Export fixtures.
- Precedes: Goods Manager UI wiring of breakdown panels.

## Open Questions / Clarifications
- Should rarity-tier mapping be configurable or fixed at this stage?
    Answer: It should preferably configurable, in an ergonomic, generic way.
- How should conflicting rarity/tier data be surfaced (warnings vs. hard errors)?
    Answer: warnings will be sufficient for now.
- Do we need per-culture aggregates now or defer to later tasks?
    answer: Please consider per-culter aggregates, creating tasks to implement functionality later in addition to the current aggregates.