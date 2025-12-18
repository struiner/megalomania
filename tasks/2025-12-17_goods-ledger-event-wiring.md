# Task Specification — Ledger Event Wiring for Goods Catalogue

**STATUS: NOT STARTED (Structural fidelity)**

## Task Summary
Define and stub ledger events for goods catalogue changes (add/update/remove/export) so SDK operations are recorded in the PBC without embedding economic logic or storage concerns.

## Purpose and Scope
- Specify event schemas for catalogue mutations and exports, referencing managed good identifiers and enum sources.
- Provide stub emitters that SDK tools can call when goods are added/edited/removed/exported.
- Document validation rules and ordering expectations for deterministic ledger entries.
- Reuse ledger payload shapes and DTO guidance from `v1/src/app/models/ledger.models.ts` / `v1/src/app/models/anna-readme.models.ts` to keep schemas DRY.

## Explicit Non-Goals
- No pricing or market logic.
- No persistence beyond ledger emission hooks.
- No UI ownership of state; UI triggers events via services only.

## Fidelity & Constraints
- **Structural fidelity**: schema definitions and stub emitters; deterministic serialization per ledger principles.
- Adhere to **UI & Ergonomics Charter** (UI passive) and **Level of Detail & Abstraction** (explicit, minimal scaffolding).
- Avoid duplicating enum data inside events; reference identifiers only.

## Agent Assignments
- **Owner / Executor:** Ledger Engineer (with SDK & Modding Engineer coordination).
- **Design Input:** Economy Engineer for event semantics/priorities.
- **QA:** QA & Test Engineer for determinism and schema validation.

## Deliverables
- Event schemas for goods catalogue lifecycle and export actions.
- Stub service/API surface to emit events from SDK tools.
- Documentation on ordering, validation and cross-player verification expectations.
- Sample fixtures demonstrating valid events.

## Review Gate
- [ ] Events reference authoritative identifiers (no duplication).
- [ ] Serialization/hashing rules documented for determinism.
- [ ] Stub emitters are side-effect minimal and safe for structural integration.
- **Approvers:** Ledger Engineer + Architecture Steward.

## Dependencies & Sequencing
- Depends on: Managed Good Data Model & Enum Integration.
- Can parallelize with: Goods Catalogue Import/Export once identifiers stabilize.
- Precedes: Future functional SDK operations or audits.

## Open Questions / Clarifications
- Which actions must be ledgered now (create/update/delete/export)? 
- Required timestamp precision and actor metadata?
- Should export events include catalogue hash for verification?
