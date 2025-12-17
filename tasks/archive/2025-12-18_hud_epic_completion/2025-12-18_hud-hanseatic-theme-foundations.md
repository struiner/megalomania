# Task Specification — HUD Hanseatic Theme Foundations

**STATUS: COMPLETE — palette/typography/icon tokens defined in `v1/src/app/pages/hud/hud-theme-foundations.md`; TODOs note asset/licensing clarifications.**

## Task Summary
Define the **visual foundations** for a Hanseatic, late-medieval inspired HUD, including palette, material cues, and typography tokens that respect the UI & Ergonomics Charter and pixel integrity rules.

## Purpose and Scope
- Provide a constrained color palette (base, accent, warning, highlight) evoking Baltic trade cities and maritime materials (aged wood, brass, parchment) while remaining UI-legible.
- Establish texture/embellishment guidelines (subtle pixel-dither, brass corners, rope motifs) that avoid clutter and keep the center playfield dominant.
- Specify typography tokens (scale, weight, casing, drop-shadow rules) suitable for pixel or bitmap fonts consistent with Hanseatic tone.
- Define sprite/icon treatment rules (line weight, bevel style, negative space) so future HUD icons feel cohesive.

## Explicit Non-Goals
- No direct asset production or sourcing; this task only defines **tokens and usage rules**.
- No runtime theming implementation or Angular styling changes; deliverables remain documentation/tokens.
- No new gameplay logic, HUD layout shifts, or routing changes.

## Fidelity & Constraints
- **Structural/visual direction fidelity only**: outputs are palettes, tokens, and reference mocks, not production art.
- Must comply with the UI & Ergonomics Charter (priority hierarchy, restrained density, pixel alignment) and Level of Detail & Abstraction Charter.
- Avoid gradients, bloom, or high-modern effects; prefer **integer-scaled, pixel-consistent** motifs.

## Agent Assignments
- **Owner / Executor:** Game Designer
- **Consulted:** Frontend Developer (feasibility of tokens in SCSS/Angular), Architecture Steward (ensures no truth leakage), Art/Brand consultant if available.
- **QA:** Validate tokens for accessibility (contrast), readability at 1×/2× scales, and charter compliance.

## Deliverables
- Palette specification with hex values, usage slots (primary, secondary, accent, warning, success, parchment background), and contrast notes.
- Texture/embellishment guidance sheet with pixel grid references, acceptable dithering patterns, and prohibited treatments.
- Typography token table (font families/alternatives, sizes, weights, spacing, shadow outlines) tuned for medieval trade tone and pixel clarity.
- Iconography style notes (stroke weight, chamfering, framing) with 2–3 reference sketches/mocks showing button grid, info pane headers, and minimap frame treatments.

## Review Gate
- [ ] Palette passes WCAG AA for primary text/background use cases and respects peripheral vs primary attention tiers.
- [ ] Tokens avoid sub-pixel rendering and align with integer scaling rules.
- [ ] Guidance does not introduce new HUD affordances or gameplay truths.
- **Approvers:** Project Manager + Architecture Steward; Frontend Developer consults on feasibility.

## Dependencies & Sequencing
- Should precede any HUD skinning or SCSS tokenization tasks to avoid rework.
- Informs future implementation tasks for theming the button grid, info panes, overlay frames, and minimap housing.

## Open Questions / Clarifications
- Preferred canonical pixel font family (e.g., BM Germar vs. custom bitmap) for medieval/Hanseatic tone? **Clarify with art direction.**
- Acceptable level of ornamentation on primary vs peripheral HUD regions (e.g., rope edging on bottom bar vs. minimal on overlays)?
- Should metallic accents lean brass/copper or iron/steel to align with economic fantasy tone?
