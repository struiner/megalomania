# Task Summary
- **Title:** Connect HUD minimap to world view data
- **Trigger:** The new HUD renders a static minimap grid; tile data should come from the existing world view service and respect the data contract in `src/app/pages/hud_task.md`.
- **Purpose:** Replace hardcoded minimap tiles with derived, deterministic view data while keeping the HUD stateless.

## Explicit Non-Goals
- No new rendering engine or camera controls.
- No direct ledger queries from the HUD layer.
- No gameplay logic changes beyond visualization.

## Agent Assignments
- **Project Manager (primary):** Align scope with design intent and confirm acceptable data shape from world view service.
- **Frontend Developer:** Consume world view/minimap service outputs and map them into the HUD component without mutating state.
- **Ledger Engineer (consult):** Ensure the data path respects ledger → views → UI determinism and avoids hidden truth.
- **QA Engineer:** Validate rendering across breakpoints and with empty/partial data responses.

## Deliverables
- A lightweight minimap adapter service or input binding that feeds tile colors/icons from world view data.
- Updated HUD component unit tests or harness to verify rendering with varied tile payloads and missing data.
- Documentation note within the HUD component or README describing the expected minimap payload (tile type, color/symbol, focus marker).

## Review Gate
- [ ] HUD no longer uses hardcoded minimap tiles.
- [ ] HUD remains a pure view layer (no stateful caching, no randomization).
- [ ] Behavior matches `src/app/pages/hud_task.md` data contract (derived views only).

## Signals & References
- Static minimap tiles in `src/app/pages/hud/hud.component.ts`.
- Data contract guidance in `src/app/pages/hud_task.md`.
