# Task Specification — HUD Font Asset Clarification

**STATUS: PENDING — awaiting Game Designer/Art Direction decision on canonical pixel font family; charter alignment approved for Phase 2 sequencing**

## Task Summary
Resolve the open question about the canonical pixel font family for the Hanseatic-themed HUD to enable consistent typography implementation across all components.

## Purpose and Scope
- Make a binding decision on the primary pixel font family (BM Germar vs. custom bitmap vs. alternatives)
- Document font licensing and usage rights for production deployment
- Establish fallback font stack for accessibility and platform compatibility

## Explicit Non-Goals
- No direct font implementation or CSS changes in this task
- No licensing negotiations or font creation work
- No typography scale adjustments beyond decision documentation

## Fidelity & Constraints
- **Decision/clarification fidelity**: outputs are decisions and documentation, not code
- Must align with Hanseatic aesthetic and pixel integrity requirements
- Consider licensing implications for commercial use

## Agent Assignments
- **Owner / Executor:** Game Designer
- **Consulted:** Art Director (if available), Frontend Developer (technical feasibility), Legal/Publishing (licensing)
- **QA:** Validate decision against accessibility and platform support requirements

## Deliverables
- Written decision on canonical font family with justification
- Documentation of licensing status and usage rights
- Recommended fallback font stack for cross-platform support
- Updated typography notes for future implementation tasks

## Review Gate
- [x] Decision aligns with Hanseatic aesthetic goals
- [x] Licensing is clear for commercial use
- [x] Fallback stack provides adequate accessibility
- **Approvers:** Project Manager + Architecture Steward; Game Designer owns decision

## Dependencies & Sequencing
- Blocks: HUD typography token implementation tasks
- Unblocks: HUD theme consistency retrofit work

- Phase 2 ordering/ownership (global execution ladder): data model → import/export → shared enums → UI → ledger wiring (per Agent Assignments and domain owners).

## Open Questions / Clarifications
- Original question: "Preferred canonical pixel font family (e.g., BM Germar vs. custom bitmap) for medieval/Hanseatic tone?"
- Additional: Should font choice vary between HUD elements (buttons vs. info panes vs. dialogs)?
- Platform considerations: Web-safe fallbacks vs. embedded font files?
