# Task Specification — HUD Info Pane Framework

## Task Summary
Establish left/right secondary info pane scaffolding within the HUD for peripheral data (statuses, summaries) at **Structural fidelity**.

## Purpose and Scope
- Provide panel shells that can host contextual info (resources, party status) without implementing data sources.
- Define sizing, margins, and typographic constraints consistent with peripheral attention and pixel integrity.
- Offer slot/content projection APIs so panes can be populated by future tasks.

## Explicit Non-Goals
- No live data wiring, sorting logic, or computed gameplay summaries.
- No complex typography or decorative frames beyond clear hierarchy cues.
- No animations or collapsible behaviors in this stage.

## Fidelity & Constraints
- Structural-only: placeholder text/blocks permitted; emphasize readability and restraint.
- Respect UI & Ergonomics attention hierarchy: panes are peripheral, unobtrusive, and stable.
- Avoid truth ownership: panes display passed-in view models; no calculations inside.

## Agent Assignments
- **Owner / Executor:** Frontend Developer
- **Design Intent Blurb (Game Designer):** Panes should feel like ledger margins—concise, glanceable, with crisp pixel-aligned dividers; avoid visual weight that competes with world view.
- **Architecture Steward:** Check for separation of concerns and over-abstraction.
- **QA:** Validate consistent spacing and visibility at common resolutions.

## Deliverables
- Angular components for left/right info panes with slot/content-projection support and documented input contracts.
- SCSS defining padding, typography scale (integer-friendly), and divider rules.
- Inline documentation on recommended content types and limits (counts, short labels).

## Review Gate
- [ ] Pane placement honors peripheral attention and symmetry rules.
- [ ] No embedded computations or gameplay logic.
- [ ] Structural fidelity demonstrated with placeholders and documented APIs.
- **Approvers:** Architecture Steward + Project Manager; Game Designer optional for tone.

## Dependencies & Sequencing
- Depends on: Bottom HUD layout skeleton for anchoring regions.
- Can run in parallel with button grid and minimap tasks.

## Open Questions / Clarifications
- Should panes reserve header areas for icons/titles, or remain minimalist labels?
- Expected maximum width per pane before it threatens central world focus?
