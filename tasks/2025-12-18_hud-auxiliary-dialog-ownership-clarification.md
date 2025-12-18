# Task Specification — HUD Auxiliary Dialog Ownership Clarification

**STATUS: PENDING — requires Game Designer decision on final ownership and routing strategy; charter alignment approved for Phase 2 sequencing**

## Task Summary
Resolve the open question about auxiliary dialog ownership and determine the definitive routing strategy for settings, help, and other auxiliary actions.

## Purpose and Scope
- Make binding decisions on which auxiliary actions should be dialogs vs. dedicated routes
- Clarify ownership boundaries between HUD overlay system and standalone dialogs
- Establish clear patterns for future auxiliary feature additions

## Explicit Non-Goals
- No direct implementation work in this clarification task
- No changes to existing dialog wiring until decisions are finalized
- No architectural redesigns or system migrations

## Fidelity & Constraints
- **Decision/clarification fidelity**: outputs are decisions and documentation, not code changes
- Must align with UI & Ergonomics Charter (shallow modal depth, clear affordances)
- Consider user experience and discoverability implications

## Agent Assignments
- **Owner / Executor:** Game Designer
- **Consulted:** Frontend Developer (routing implications), Architecture Steward (ownership boundaries)
- **QA:** Validate decisions against usability and charter compliance

## Deliverables
- Written decisions on auxiliary action routing strategy
- Documentation of dialog vs. route ownership patterns
- Updated guidelines for future auxiliary feature additions
- Migration plan for any existing inconsistencies

## Review Gate
- [x] Decisions align with shallow modal depth requirements
- [x] Ownership boundaries are clear and enforceable
- [x] User experience and discoverability are considered
- **Approvers:** Project Manager + Architecture Steward; Game Designer owns decisions

## Dependencies & Sequencing
- Blocks: Future auxiliary feature implementation tasks
- Resolves: TODO items in routing and dialog wiring tasks

- Phase 2 ordering/ownership (global execution ladder): data model → import/export → shared enums → UI → ledger wiring (per Agent Assignments and domain owners).

## Open Questions / Clarifications
- Original: "Should settings/help open as standalone draggable dialogs or navigate to dedicated routes?"
    answer: THe current solution of a separate dialog is good.
- Additional: Should auxiliary dialogs share the same ownership model as main HUD overlay system?
    answer: no.
- Platform considerations: How do decisions affect mobile/embedded contexts?
    answer: CUrrently the platform we aim for is desktop browser, mobile/embedded are important considerations for a later phase.
