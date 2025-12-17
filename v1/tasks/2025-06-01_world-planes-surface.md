# Task Specification: World Planes Visualization Surface

## Task Summary
Create a proper "Planes" screen for the `world/planes` route so the UI no longer relies on the `KirbyComponent` placeholder. The screen should visualize planar slices (e.g., elevation, moisture, temperature) derived from deterministic world generation views.

## Trigger
* `MENU` entry `world/planes` currently points at `KirbyComponent` (placeholder).
* No visualization exists for planar data layers.

## Explicit Non-Goals
* No changes to ledger schemas or hashing.
* No new world-generation mechanics; only surface existing or mock deterministic views.
* No mutable gameplay state or manual editing of plane data from the UI.

## Agent Assignments
* **Project Manager** — Guard scope, ensure plan aligns with ledger-first rules.
* **World Generator (Primary)** — Provide planar data view contract (sample data acceptable if derived deterministically from seeds).
* **Frontend Developer** — Implement Angular page + components for plane toggles and legend; wire to provided view/service.
* **QA & Test Engineer** — Validate deterministic rendering (same seed → same image), viewport resizing, and route navigation.

## Data / Inputs
* Deterministic plane data (heightmap, moisture, temperature) from the world generation view service; if missing, supply a mock derived from seed for this task.
* Existing routing at `world/planes` in `menu.data.ts`.

## Deliverables
* A standalone Angular component replacing `KirbyComponent` on `world/planes` with:
  * Layer selector (at least 3 layers).
  * Legend for value ranges.
  * Canvas/SVG/Div grid render that accepts deterministic data input.
* Lightweight service or adapter consuming world plane view (mock OK, no new truth stored in UI).
* Inline help text clarifying that data is derived from ledger/world views.

## Review Gate
* [ ] UI uses provided deterministic data contract; no ad-hoc randomness.
* [ ] Route `world/planes` renders without console errors and passes lint/build.
* [ ] UX approved by Project Manager and Game Designer for clarity (visual only, no mechanics).

## Exit Criteria
* `world/planes` shows the new visualization on load via routing.
* Tests/build run green.
* Placeholder `KirbyComponent` removed from this route and references cleaned up.
