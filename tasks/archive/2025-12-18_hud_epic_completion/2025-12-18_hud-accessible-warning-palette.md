# Task Specification — HUD Accessible Warning Palette

**STATUS: NEW — spawned from theme retrofit gaps; pending QA validation.**

## Task Summary
Validate and, if necessary, adjust HUD warning/alert palette tokens to meet accessibility contrast targets without breaking Hanseatic tone.

## Purpose and Scope
- Run contrast checks (WCAG AA) for warning/alert text on parchment and dark-wood backplates.
- Propose alternate accent hex values if current tokens fail contrast or color-blind safety.
- Document approved pairings for badges, notices, and minimap markers.

## Explicit Non-Goals
- No runtime implementation or styling changes in this task.
- No new HUD behaviors or layout shifts.
- No animation or flashing indicators.

## Fidelity & Constraints
- Analytical/validation fidelity only; outputs are recommendations and updated token values.
- Must comply with UI & Ergonomics Charter (peripheral attention only for alerts).

## Agent Assignments
- **Owner / Executor:** QA & Test Engineer.
- **Consulted:** Game Designer (tone), Frontend Developer (feasibility), Architecture Steward (charter guardrails).

## Deliverables
- Contrast report covering Primary/Secondary backgrounds with current warning/alert tokens.
- Updated token recommendations appended to `hud-theme-foundations.md` if changes are required.
- Brief note in `hud-theme-retrofit-checklist.md` marking approved palette pairings.

## Review Gate
- [ ] WCAG AA contrast validated or alternatives proposed.
- [ ] Proposed changes keep pixel integrity (no gradients/bloom).
- [ ] No gameplay truth introduced.

## Dependencies & Sequencing
- Depends on base palette in `hud-theme-foundations.md`.
- Should complete before retrofitting HUD SCSS tokens to avoid rework.
