# Task Specification — HUD Routing & Dialog Wiring

## Task Summary
Wire HUD entry points (buttons, panes) to Angular routes/dialog shells without adding gameplay logic, ensuring navigation scaffolding is stable and charter-compliant. Target **Structural fidelity**.

## Purpose and Scope
- Define navigation/routing links from HUD elements to placeholder dialogs or panels (e.g., inventory, ledger view) without implementing their content.
- Establish consistent dialog shell components with clear ownership boundaries and pixel-safe framing.
- Document how HUD triggers map to routes to avoid future coupling errors.

## Explicit Non-Goals
- No implementation of dialog content or gameplay interactions.
- No state management, data fetching, or ledger mutations.
- No keyboard/macro systems beyond minimal accessibility focus order.

## Fidelity & Constraints
- Structural-only: placeholder routes/components with visible stubs are acceptable.
- Must avoid truth ownership: dialogs display injected content only; no calculations inside shells.
- Respect UI & Ergonomics Charter: dialogs should not obscure central world unnecessarily; use restrained framing.

## Agent Assignments
- **Owner / Executor:** Frontend Developer
- **Design Intent Blurb (Game Designer):** Dialogs feel like pulled-up ledgers or map overlays—stable, utilitarian, minimal animations; summon only when needed.
- **Architecture Steward:** Review routing boundaries and dependency graph for simplicity.
- **QA:** Verify navigation stability, absence of stray focus traps, and predictable close behavior.

## Deliverables
- Routing map linking HUD buttons/panes to placeholder dialog components (Angular routes or overlay services) with documented paths/ids.
- Shell dialog components with basic framing and close/back affordances; placeholder bodies labeled for future tasks.
- Notes on intended future content ownership to prevent UI from inventing state.

## Review Gate
- [ ] Routing complies with Angular best practices and avoids hidden global state.
- [ ] Dialog shells respect UI & Ergonomics Charter (restraint, minimal obstruction).
- [ ] No gameplay logic or derived truth inside HUD routing/dialog code.
- **Approvers:** Architecture Steward + Project Manager; Game Designer optional for UX tone.

## Dependencies & Sequencing
- Depends on: Bottom HUD layout skeleton to anchor triggers.
- Should follow definition of button grid slots to ensure mapping clarity.

## Open Questions / Clarifications
- Preferred dialog stacking model (single overlay vs. multiple panels)?
    Answer: Multiple completely overlapping panels, where active panels are indicated with a tab.
- Should routes use guarded entry (e.g., feature flags) or stay open for now?
    Answer: Let routes remain open for now, adding a TODO for more generic dynamic route guarding and it's indication.

## Review Notes (Architecture Steward)
- Sign-off: Architecture Steward — L. Vermeer (2024-06-05).
- Findings:
  - Structural fidelity is sufficient per the Level of Detail & Abstraction Charter; routing and shell components should stay minimal and intentional.
  - Dialog framing and unobtrusive overlays align with the UI & Ergonomics Charter; ensure central world visibility remains primary.
  - No additional recursion layers are required; keep routing maps flat and avoid nested dialog stacks beyond the stated model.
- Required Amendments: Keep TODOs for future guards explicit and document that placeholder dialogs carry no derived logic.
