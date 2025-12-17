# Task Specification — HUD Auxiliary Dialog Ownership Clarification

**STATUS: PENDING — requires Game Designer decision on final ownership and routing strategy**

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
- [ ] Decisions align with shallow modal depth requirements
- [ ] Ownership boundaries are clear and enforceable
- [ ] User experience and discoverability are considered
- **Approvers:** Project Manager + Architecture Steward; Game Designer owns decisions

## Dependencies & Sequencing
- Blocks: Future auxiliary feature implementation tasks
- Resolves: TODO items in routing and dialog wiring tasks

## Open Questions / Clarifications
- Original: "Should settings/help open as standalone draggable dialogs or navigate to dedicated routes?"
- Additional: Should auxiliary dialogs share the same ownership model as main HUD overlay system?
- Platform considerations: How do decisions affect mobile/embedded contexts?
