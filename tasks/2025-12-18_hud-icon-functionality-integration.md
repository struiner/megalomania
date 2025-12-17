# Task Specification — HUD Icon Functionality Integration

**STATUS: COMPLETED (functional integration) — asset/bevel decisions pending**

## Task Summary
Implement the generic icon functionality that was referenced in multiple HUD component tasks as a prerequisite for header areas, button icons, and pane decorations.

## Purpose and Scope
- Create a reusable icon system that supports the pixel heritage aesthetic (16×16 default, 2× scale option)
- Integrate with the HudIconHeaderComponent and button grid components
- Establish consistent icon treatment (stroke weight, bevel style, framing) across all HUD surfaces

## Explicit Non-Goals
- No asset creation or sourcing - this task uses existing icon framework
- No hotkey glyphs or interactive icon states beyond basic hover/focus
- No animation or complex icon behaviors

## Fidelity & Constraints
- **Functional fidelity**: working icon integration across HUD components
- Must maintain pixel integrity and integer scaling
- Align with Hanseatic aesthetic and UI & Ergonomics Charter

## Agent Assignments
- **Owner / Executor:** Frontend Developer
- **Design Intent:** Icons should feel like etched brass fixtures - clear, functional, with subtle beveling that respects the pixel grid
- **Architecture Steward:** Ensure icon system doesn't introduce UI truth ownership

## Deliverables
- Integrated icon functionality in HudIconHeaderComponent and button grid
- Updated SCSS with icon sizing and treatment rules
- Documentation of icon usage patterns and constraints
- Example implementations showing icon integration across different HUD contexts

## Review Gate
- [ ] Icons integrate cleanly with existing HUD components
- [ ] Pixel integrity maintained at all supported scales
- [ ] Consistent treatment across different HUD surfaces
- **Approvers:** Frontend Developer + Architecture Steward; Game Designer optional for aesthetic review

## Dependencies & Sequencing
- Depends on: Font asset clarification for consistent icon/typography pairing
- Precedes: HUD theme consistency retrofit work
- Referenced by: Info pane framework, button grid component, routing dialogs

## Open Questions / Clarifications
- Original: "Preferred default icon size (e.g., 16×16 vs 24×24) given pixel heritage?"
- Additional: Should icon treatment vary between primary actions (buttons) and secondary information (headers)?
- New: Confirm asset pack/sprite source to replace placeholder glyphs in `HudIconComponent` while keeping licensing clear.
