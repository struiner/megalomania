# Task Specification — HUD Minimap Baseline 512×512 Conformance

## Task Summary
Validate and enforce that the baseline minimap display in the HUD presents information consistent with the 512×512 px allocation defined by the world-render component, preserving clarity and scale fidelity.

## Purpose and Scope
- Align HUD minimap viewport and sampling with the 512×512 world-render baseline to avoid distortion or mismatched zoom levels.
- Document sizing assumptions and any scaling factors used when embedding the minimap into HUD chrome.
- Provide checklist and instrumentation to verify pixel accuracy across devices and DPRs.

## Explicit Non-Goals
- No new minimap rendering features (markers, overlays, panning controls) beyond baseline fidelity checks.
- No gameplay logic, AI behaviors, or ledger-driven updates.
- No alternative map projections or thematic styling changes.

## Fidelity & Constraints
- Structural/Verification fidelity: focus on sizing correctness and data parity rather than feature additions.
- Must respect UI & Ergonomics Charter spacing and avoid over-consuming HUD real estate.
- Preserve deterministic mapping between world coordinates and minimap pixels at 512×512 baseline before any optional scaling.

## Agent Assignments
- **Owner / Executor:** Frontend Developer
- **Design Intent Blurb (Game Designer):** The minimap should remain a crisp navigational aid—true to scale and legible—without decorative noise.
- **Architecture Steward:** Confirm no derived truth or state duplication; all world data must flow from existing render/view services.
- **QA:** Validate rendered dimensions, pixel sampling accuracy, and absence of stretching or anti-aliasing artifacts when scaled.

## Deliverables
- Configuration or component adjustments ensuring HUD minimap respects a 512×512 px source baseline from the world-render component.
- Documentation of scale factors, DPI handling, and any letterboxing/cropping rules when the minimap is framed in the HUD slot.
- Test checklist or automated assertion verifying baseline dimensions in common DPR settings.

## Review Gate
- [ ] Baseline minimap uses 512×512 source without distortion or unintended scaling.
- [ ] HUD framing preserves clarity and UI charter spacing guidelines.
- [ ] No duplicate state or truth leakage introduced in minimap embedding.
- **Approvers:** Architecture Steward + Project Manager; optional Game Designer sign-off.

## Dependencies & Sequencing
- Depends on: Existing minimap integration scaffold.
- Precedes: Minimap enrichment tasks (markers, density controls, overlays).

## Open Questions / Clarifications
- Should the HUD enforce a maximum on-device scaling factor to prevent blurry magnification?
- Do we need fallback behavior for lower-resolution devices (e.g., letterboxing vs. dynamic resampling)?

## Review Notes (Architecture Steward)
- Pending — complete after implementation.
