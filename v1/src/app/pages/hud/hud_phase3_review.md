# HUD Epic — Phase 3 Review & Promotion

This document records Phase 3 of the Gameplay HUD epic, following the UI & Ergonomics Charter and the Level of Detail & Abstraction Charter. The goal is to decide promotion readiness, archive the Phase 2 task set, and surface explicit follow-ups.

## Promotion Decisions (Structural → Functional readiness)
- **Promote to Functional fidelity**
  - **Bottom HUD anchoring + layout skeleton**: Stable anchoring, safe-area padding, and slot layout are deterministic and exercised by the HUD page. No gameplay truth is owned.
  - **HUD button grid + routing shell**: Primary action grid routes into overlay tabs or auxiliary dialogs with guard-aware handling; behavior matches expected player workflow without deriving state.
  - **Overlay shell drag/snapping + block notices**: Drag bounds, snap-to-grid, and block notice surfacing are deterministic and already guarded by capability checks.
- **Remain at Structural fidelity (pending clarification/data)**
  - **Minimap surface**: Rendering depends on confirmed pixel density, scaling policy, and live tile data; keep structural until scaling/letterboxing decisions land.
  - **Info panes**: Placeholder text/badges and notification feeds need authoritative data sources; keep structural to avoid truth ownership drift.
  - **Auxiliary settings/help actions**: Ownership clarified (world configuration + reference docs); retain structural fidelity until domain-owned surfaces deliver live data.

## Task Archival
All Phase 2 HUD child tasks dated `2025-12-17_*` are considered **archived** post-review. Their statuses remain documented in `tasks/` for historical traceability; new work should spawn fresh task specs rather than reopening the originals.

## New Follow-up Task Specifications
Phase 3 surfaced clarifications that must be handled as new tasks (see `tasks/2025-12-18_*.md`):
- **HUD auxiliary destination clarification** — finalized routing/CTA ownership for non-overlay actions (settings/help) and codified fallback behavior.
- **HUD minimap scaling policy** — lock pixel density, scaling clamps, and low-resolution handling, aligned with pixel-integrity rules.
- **HUD Hanseatic theme foundations** — codify palette, typography, texture, and iconography tokens for late-medieval/Hanseatic tone without altering layout or owning truth.
- **HUD theme consistency & retrofit** — audit HUD surfaces for alignment with the approved theme tokens and plan implementation hooks without changing interactions.

### Phase 3 Outputs (this iteration)
- Theme tokens captured in `hud-theme-foundations.md`; remaining TODOs: font licensing, dither swatches, warning/alert accessibility variants.
- Retrofit audit + hook plan recorded in `hud-theme-retrofit-checklist.md`; follow-up tasks opened for icon pilot set, texture swatches, and accessibility palette validation.
- Minimap scaling policy codified in `hud-minimap.component.ts` (scale clamp + snapping) with README summary; letterboxing now cushions undersized renders with TODO for fill treatment on constrained devices.
- Auxiliary dialog wiring now deterministic (CTA routes for settings/help) with ownership and fallback display rules codified.
- Shared icon framing (`HudIconComponent`) added to button grid + headers to enforce consistent sizing; asset pack + bevel rules remain open for design confirmation.

## Outstanding Clarifications (tracked via TODOs)
- Minimap letterbox fill treatment and low-resolution policy in `hud-minimap.component.ts`.

## Exit Notes
- No gameplay truth was added or derived in Phase 3; work remains UI-structural.
- Additional promotions should only occur after the above clarifications are resolved and reviewed against the charters.
