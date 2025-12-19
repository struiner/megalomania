# Task Specification — HUD Font Asset Clarification

**STATUS: RESOLVED — canonical HUD/narrative font families selected and cleared for implementation; charter alignment approved for Phase 2 sequencing**

**Resolution summary — 2025-12-18**
- **Primary HUD/system font:** Pixelify Sans (weights 400/500/700), chosen for crisp pixel stems that stay legible at 11–14px while matching the Hanseatic “instrument panel” tone.
- **Narrative/world accent font:** IM Fell English SC (weight 400) reserved for lore/world descriptors only; avoid in dense UI to protect readability.
- **Licensing:** Both families ship under the SIL Open Font License 1.1, permitting commercial use, bundling, and modification with attribution and without downstream trademark confusion. Self-host WOFF2 files to avoid CDN drift.
- **Fallback stack:** `Pixelify Sans`, `Press Start 2P`, `Silkscreen`, `VT323`, `ui-monospace`, `SFMono-Regular`, `Menlo`, `monospace` for HUD/system text; `IM Fell English SC`, `EB Garamond`, `Georgia`, `serif` for narrative accents.
- **Import/pipeline guidance:** Package WOFF2 files in `/assets/fonts/hud/` with deterministic filenames; expose them through a HUD SCSS token partial (`hud-theme.tokens.scss`) via `@font-face` + CSS custom properties. Enable `font-display: swap` and `-webkit-font-smoothing: none` on HUD/system text to keep pixel edges intact; allow antialiasing for the accent serif to preserve legibility.

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
Historical preferences are retained below for traceability; the Resolution Summary above is the binding decision for HUD implementation.
- Original question: "Preferred canonical pixel font family (e.g., BM Germar vs. custom bitmap) for medieval/Hanseatic tone?"
    Answer: preferably use Nokia Cellphone FC or similar font family for system text, preferably use Pixtura12 for world description, story and conversation.
- Additional: Should font choice vary between HUD elements (buttons vs. info panes vs. dialogs)?
    answer: yes, differing between game system context and world descriptive context use akin to Nokia Cellphone FC and Pixtura12
- Platform considerations: Web-safe fallbacks vs. embedded font files?
    answer: yes, web-safe fallbacks are prudent.
