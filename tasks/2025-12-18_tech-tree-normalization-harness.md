# Task Specification — Tech Tree Normalization Harness & Case Drift Tests

**STATUS: COMPLETE (Structural fidelity; mixed-case harness and fixtures added)**

## Task Summary
Build a deterministic test/fixture harness to exercise tech-tree import/export with mixed-case identifiers, ensuring the current normalization pipeline does not emit false positives or mutate values unexpectedly during merges.

## Purpose and Scope
- Create mixed-case fixtures (PascalCase, camelCase, snake_case) that mirror real enum values and intentional edge cases.
- Wire harness tests around `TechTreeIoService` to assert round-trip equality (including ordering) and to capture warnings/errors for regression tracking.
- Produce a small report that flags remaining normalization gaps for follow-up tasks or migrations.

## Explicit Non-Goals
- No UI changes beyond optional dev-only surfaces to view harness results.
- No schema or ledger changes; focus is on testing/validation coverage.
- No automatic mutation of authoritative enums.

## Fidelity & Constraints
- **Structural fidelity:** simple harness/tests plus fixtures; prioritize clarity and deletability.
- Respect **Level of Detail & Abstraction**: avoid heavyweight test frameworks; lightweight deterministic assertions are sufficient.
- Keep outputs stable for CI/regression (sorted, consistent timestamps or mocked clocks).

## Agent Assignments
- **Owner / Executor:** QA & Test Engineer (with Backend Engineer support for fixtures).
- **Consultation:** Architecture Steward for coverage expectations.
- **Review:** Architecture Steward + Backend Engineer.

## Deliverables
- Mixed-case tech-tree fixtures covering enums with non-snake-case values.
- Harness/tests calling `importTechTree` and `exportTechTree`, asserting normalized output and captured issues.
- Documentation of observed discrepancies to inform enum mapping fixes.

## Review Gate
- [x] Tests reproduce the current casing drift warnings seen during merges.
- [x] Round-trip assertions are deterministic (ordering, casing, metadata).
- [x] Remaining gaps are documented with pointers to responsible enums/fields.

## Dependencies & Sequencing
- Depends on: `TechTreeIoService` current implementation.
- Precedes: mapping/alignment work (see `tasks/2025-12-18_tech-enum-case-alignment.md`).

## Open Questions / Clarifications
- Should the harness live beside existing tech-tree data fixtures or under a dedicated QA folder?
- Do we need snapshot outputs for CI, or are inline expectations sufficient?
- Which enums are most error-prone (e.g., `GoodsType.Mead` vs. snake_case fixtures)?
