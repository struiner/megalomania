# Task Specification — Room Blueprint World Context Validation

**STATUS: ✅ COMPLETED (Structural fidelity achieved); charter alignment approved for Phase 2 sequencing**

## Task Summary
Add world-context validation for room blueprints to ensure hazards, purposes, and dimensions stay coherent with world truths (structures, biomes, settlement types), using authoritative enums/types to prevent drift.

## Purpose and Scope
- Define validation rules that cross-check room purpose/hazards against world data (e.g., biome-linked hazards, structure types where rooms live).
- Reuse authoritative enums/types (`StructureType`, `Biome`, `SettlementType`, upcoming `HazardType`) for all references—no freeform strings.
- Provide fixtures and adapters so SDK room tools can surface context warnings without owning world truth.

## Explicit Non-Goals
- No procedural placement or generation logic.
- No pathfinding or spatial simulation.
- No ledger changes (covered separately).

## Fidelity & Constraints
- **Structural fidelity**: validation rules + fixtures; deterministic outputs.
- Respect **UI & Ergonomics Charter** (UI passive, limited actions) and **Level of Detail & Abstraction** (explicit, deletable).
- World truths stay authoritative; UI only consumes adapters.

## Agent Assignments
- **Owner / Executor:** World Generator (with QA for validation harness).
- **Design Input:** Game Designer for purpose/hazard plausibility.
- **QA:** QA & Test Engineer validates deterministic validation results.

## Deliverables
- Validation rule set and module wiring world enums into room blueprint validation.
- Fixtures demonstrating valid/invalid combinations (hazards vs. biomes, purposes vs. structure types).
- Documentation on ordering/casing rules for deterministic import/export feedback.
- Integration notes for room blueprint validation service and editor UI.

## Review Gate
- [x] Validation references authoritative world enums/types (no duplication).
- [x] Deterministic outputs for identical inputs; ordering documented.
- [x] Context warnings are consumer-facing without owning truth.
- **Approvers:** World Generator + Architecture Steward.

## Dependencies & Sequencing
- Depends on: HazardType Enum & SDK Alignment; Room Blueprint Data Model; Room Validation Service.
- Precedes: Any procedural placement tasks or ledger hooks for room events.

- Phase 2 ordering/ownership (global execution ladder): data model → import/export → shared enums → UI → ledger wiring (per Agent Assignments and domain owners).

## Open Questions / Clarifications
- Should hazard plausibility be strict blocking or warnings at structural stage?
    Answer: no
- Are certain purposes biome-locked (e.g., underwater labs) and how are exceptions modeled?
    answer: yes, exceptions will give warnings, but will be modeled. If possible, suggest biome-appropriate alternatives.
- Do we need culture-specific overrides for hazard/purpose plausibility now or later?
    answer: yes

