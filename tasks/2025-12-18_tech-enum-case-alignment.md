# Task Specification — Tech Enum Case Alignment & Normalization Rules

**STATUS: NOT STARTED (Structural fidelity)**

## Task Summary
Audit and align enum identifier casing between authoritative sources (e.g., `GoodsType` PascalCase values) and tech-tree import/export normalization (snake_case) so round-trips do not generate fallback warnings, merge noise, or TypeScript type mismatches.

## Purpose and Scope
- Catalog all enum/value casing patterns used by tech-facing domains (`GoodsType`, `StructureType`, `SettlementType`, `GuildType`, etc.) and document the canonical identifier strategy.
- Propose and implement a deterministic mapping layer (or enum value adjustments) that preserves authoritative truth while allowing snake_case normalization for tech-tree payloads.
- Ensure `TechTreeIoService` and `TechEnumAdapterService` use the same mapping rules to prevent discrepancies between import/export and UI pickers.

## Explicit Non-Goals
- No gameplay logic changes or balance tweaks.
- No UI restyling beyond adopting unified labels/values.
- No ledger/schema version bumps beyond what the mapping layer requires.

## Fidelity & Constraints
- **Structural fidelity:** introduce mappings/adapters and documentation; keep code deletable and explicit.
- Must honor **UI & Ergonomics Charter** (UI remains passive) and **Level of Detail & Abstraction** (no over-engineering).
- Deterministic ordering and reversible normalization are required.

## Agent Assignments
- **Owner / Executor:** Architecture Steward (with Backend Engineer support).
- **Consultation:** Game Designer for naming/casing acceptance where user-facing labels change.
- **QA:** QA & Test Engineer to verify round-trip determinism across mixed-case fixtures.

## Deliverables
- Casing/mapping reference (doc or module) covering all tech-relevant enums.
- Updated import/export and enum adapter code paths that apply the shared mapping.
- Regression fixtures showing round-trips of mixed-case inputs without warnings.
- Migration/compatibility note if enum values change.

## Review Gate
- [ ] Authoritative enum values and normalized identifiers have a one-to-one, reversible mapping.
- [ ] Import/export and pickers use the same mapping and stop emitting spurious fallback warnings.
- [ ] No TypeScript type drift introduced by the normalization strategy.
- **Approvers:** Architecture Steward + Backend Engineer (Game Designer consults on naming).

## Dependencies & Sequencing
- Depends on: existing tech-tree data model and import/export services.
- Precedes: any further tech-tree UI refinement relying on stable enum values.

## Open Questions / Clarifications
- Should authoritative enums adopt snake_case strings, or should mapping stay localized to tech-tree flows?
- How are legacy persisted payloads with PascalCase values migrated without breaking determinism?
- Do we need locale-aware label formatting distinct from identifier casing?
