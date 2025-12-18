# Task Specification — Ledger Event Wiring for Room Blueprints

**STATUS: NOT STARTED (Structural fidelity)**

## Task Summary
Define ledger events for room blueprint creation/modification/removal/export so blueprint operations are recorded in the PBC with deterministic schemas, without implementing placement or generation logic.

## Purpose and Scope
- Specify event payloads referencing blueprint identifiers, dimensions, hazards and actor metadata.
- Provide stub emitters that SDK/UI flows can call when blueprints are created/edited/removed/exported.
- Document validation rules, ordering expectations and cross-player verification hooks.
- Align payload schemas with existing ledger DTOs in `v1/src/app/models/ledger.models.ts` / `v1/src/app/models/anna-readme.models.ts` and reuse shared `HazardType`/`StructureType` enums rather than duplicating identifiers.

## Explicit Non-Goals
- No world placement, pathfinding or generation logic.
- No persistence beyond ledger emission hooks.
- No UI ownership of blueprint truth; UI only triggers events via services.

## Fidelity & Constraints
- **Structural fidelity**: schemas and stub emitters; deterministic serialization per ledger rules.
- Respect **UI & Ergonomics Charter** (UI passive) and **Level of Detail & Abstraction** (explicit, minimal scaffolding).
- Avoid embedding blueprint payloads in full; reference identifiers/hashes where possible.

## Agent Assignments
- **Owner / Executor:** Ledger Engineer (with SDK & Modding Engineer coordination).
- **Design Input:** World Generator / Game Designer for semantic fields to capture.
- **QA:** QA & Test Engineer for determinism and schema validation.

## Deliverables
- Event schema definitions for blueprint lifecycle and export actions.
- Stub service/API for emitting events from editor/import-export flows.
- Documentation on validation, ordering and verification expectations.
- Sample fixtures demonstrating valid events.

## Review Gate
- [ ] Events reference authoritative identifiers/hashes without duplicating full payloads.
- [ ] Serialization/hashing rules documented for determinism.
- [ ] Stub emitters side-effect minimal and safe for structural integration.
- **Approvers:** Ledger Engineer + Architecture Steward.

## Dependencies & Sequencing
- Depends on: Room Blueprint Data Model & Hazard Integration.
- Can parallelize with: Import/Export and Validation services once identifiers stabilize.
- Precedes: Any functional world-generation integration tasks.

## Open Questions / Clarifications
- Should exports include blueprint hash for verification?
    answer: yes
- Required timestamp precision and actor metadata?
    answer: yes
- Are separate events needed for hazard list updates vs. other edits?   
    answer: potentially, so yes.
