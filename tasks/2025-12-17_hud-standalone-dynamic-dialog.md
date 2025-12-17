# Task Specification — HUD Standalone Dynamic Dialog

## Task Summary
Implement a reusable, standalone dynamic dialog shell that can be referenced by `hud-page.component` to host context-specific content without coupling presentation to gameplay logic. Target **Structural fidelity** to unblock later functional wiring.

## Purpose and Scope
- Provide a dialog wrapper component that can be invoked from HUD routes or button grid entries.
- Support dynamic content injection (Angular `ng-content`/portals) with consistent padding, focus management, and escape/close affordances.
- Keep the dialog chrome aligned with HUD icon/header utility usage for consistent branding.

## Explicit Non-Goals
- No gameplay decisions, data mutation, or ledger interactions.
- No visual polish beyond clear framing; animations and theming are out of scope for this task.
- No business logic for dialog content; consumers supply their own data and handlers.

## Fidelity & Constraints
- Structural fidelity only: placeholder body regions and mock triggers are acceptable.
- Must honor the UI & Ergonomics Charter for restraint, symmetry, and pixel-grid alignment.
- Dialog must keep world visibility priority by avoiding fullscreen scrims and honoring ESC/close behavior defined in the HUD overlay model.

## Agent Assignments
- **Owner / Executor:** Frontend Developer
- **Design Intent Blurb (Game Designer):** Dialogs should feel like restrained instrument panels that supplement—never overwhelm—the world view. Focus on clarity and spatial economy.
- **Architecture Steward:** Ensure dialog shell remains stateless and free of derived truth.
- **QA:** Validate keyboard focus trapping, ESC/close behaviors, and absence of layout jitter across viewport sizes.

## Deliverables
- Angular component for a standalone dynamic dialog shell referenced from `hud-page.component`.
- Input/API surface for dynamic content projection and header/icon injection.
- CSS/SCSS enforcing consistent padding, z-index discipline, and restrained backdrop treatment.
- Inline README notes documenting usage from HUD routes and buttons.

## Review Gate
- [ ] Dialog shell is stateless and free of gameplay logic.
- [ ] ESC/close affordances return users to prior HUD route without state leakage.
- [ ] Layout and padding align with the UI & Ergonomics Charter (integer scaling, minimal chrome).
- **Approvers:** Architecture Steward + Project Manager; optional Game Designer sign-off.

## Dependencies & Sequencing
- Depends on: HUD routing scaffold to host dialog routes.
- Precedes: Dialog content-specific tasks and functional payload wiring.

## Open Questions / Clarifications
- Should dialog width be fixed or responsive within a defined min/max range?
- Should we reserve tab affordances inside the dialog shell or keep tabs external in the overlay host?

## Review Notes (Architecture Steward)
- Pending — complete after implementation.
