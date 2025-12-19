# Goods Model Alliterating Suffixes Implementation

## Task Summary & Purpose
The `Era` enum in the goods model includes a TODO for implementing randomized, nicely alliterating suffixes to provide uniqueness between cultures and species. This task implements the suffix generation system for cultural and thematic differentiation.

**Original TODO:** `//TODO: Implement randomized nicely alliterating suffixes, for uniqueness between cultures/species.` in `megalomania/v1/src/app/models/goods.model.ts:132`

## Explicit Non-Goals
- Do not modify existing Era enum values or categorization logic
- Do not implement goods generation algorithms or economic modeling
- Do not create culture-specific content or lore beyond naming patterns
- Do not change goods model interfaces or validation rules

## Fidelity & Constraints
- **Target Stage:** Structural (skeleton) - establish naming pattern infrastructure
- **Reference:** Level-of-Detail Charter (structural fidelity for utility functions)
- **Domain:** Economy/goods modeling and naming utilities

## Agent Assignments
- **Primary:** Economy Engineer
- **Collaborators:** Game Designer (for cultural naming patterns), SDK & Modding Engineer (for extension patterns)

## Deliverables & Review Gate
- [ ] Create `EraSuffixGenerator` utility class with alliterating pattern algorithms
- [ ] Implement suffix pools for different cultural themes (fantasy, sci-fi, industrial, etc.)
- [ ] Add deterministic random generation preserving seed-based reproducibility
- [ ] Create unit tests for suffix generation patterns and alliteration quality
- [ ] Add documentation explaining usage patterns and cultural theming

**Review Gate:** Economy Engineer validates that suffix generation produces quality alliterations and maintains determinism.

## Dependencies & Sequencing
- **Prerequisites:** None - can proceed with utility development
- **Follow-up Tasks:** Culture-specific goods variants, advanced naming algorithms

## Open Questions / Clarifications
- Should suffix generation be culture-agnostic or support culture-specific patterns?
- Do we need to validate suffix appropriateness for different goods categories?
- Should the generator support configurable alliteration strength (subtle vs. prominent)?