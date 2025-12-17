# Task Specification — HUD Icon/Header Utility Rollout

## Task Summary
Deliver and standardize a HUD icon/header utility that can be reused across info panes, dialogs, and other HUD surfaces to ensure consistent visual hierarchy and spacing.

## Purpose and Scope
- Implement a shared icon+heading pattern with integer-scaled padding and typography consistent with the UI & Ergonomics Charter.
- Provide lightweight APIs/inputs for title, subtitle, icon asset, and optional status badge.
- Supply usage guidelines and examples for info panes, dialogs, and overlay shells.

## Explicit Non-Goals
- No custom theming engine or dynamic asset loading beyond the provided API surface.
- No gameplay logic, state derivation, or data fetching in the utility.
- No animation or advanced layout variants beyond baseline alignment and spacing.

## Fidelity & Constraints
- Structural fidelity: emphasize alignment, spacing, and minimal chrome suitable for repeated reuse.
- Must respect pixel-grid alignment (multiples of 2px/4px/16px) and avoid reflow-inducing dependencies.
- Utility must remain stateless, with inputs validated and defaults documented.

## Agent Assignments
- **Owner / Executor:** Frontend Developer
- **Design Intent Blurb (Game Designer):** Headings should feel utilitarian and legible, framing content without ornamentation; icons communicate function at a glance.
- **Architecture Steward:** Ensure no truth ownership and that the utility remains presentation-only.
- **QA:** Validate rendering across DPI settings, icon/title alignment, and accessibility labels.

## Deliverables
- Reusable icon/header Angular component or directive with SCSS helpers.
- Example usages within HUD info panes and dialogs demonstrating consistent spacing.
- Inline README documenting props/inputs, scaling guidance, and integration notes for HUD surfaces.

## Review Gate
- [ ] Utility is stateless and presentation-only.
- [ ] Spacing/typography align with UI & Ergonomics Charter and integer scaling rules.
- [ ] Examples confirm drop-in use across info panes and dialogs without layout drift.
- **Approvers:** Architecture Steward + Project Manager; optional Game Designer sign-off.

## Dependencies & Sequencing
- Depends on: Existing HUD layout scaffolds.
- Precedes: Widespread adoption in other HUD features (dialogs, overlays, info panes).

## Open Questions / Clarifications
- Should the utility include optional hotkey glyphs or remain purely icon/title?
- Do we need built-in truncation rules for narrow panes, or should callers manage overflow?

## Review Notes (Architecture Steward)
- Pending — complete after implementation.
