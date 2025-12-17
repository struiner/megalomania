Applied Example
Bottom HUD UI (Gameplay Interface)

This section applies the above template to a real Megalomania UI task.

1. Task Summary

Task name: Implement Bottom HUD Gameplay Interface

Trigger:

Existing placeholder HUD component and routing

Defined in prior design discussion

Context:

Gameplay screen already exists

HUD is a separate Angular component

Explicit Non‑Goals:

No new gameplay mechanics

No ledger schema changes

No new backend endpoints

2. Authority & Entry Point

The Project Manager agent coordinates this task.

3. Agent Assignments
3.1 Project Manager

Responsibilities:

Confirm HUD scope matches existing design intent

Prevent expansion into gameplay logic

3.2 Game Designer

Responsibilities:

Define what the HUD represents to the player

UX Intent:

HUD is the player’s operational console

It provides:

Situational awareness

Access to management dialogs

High‑level layout intent:

Bottom‑anchored bar

Left: square minimap

Center: 2×4 button grid

Right: two equal information panes

Constraints:

HUD does not explain mechanics

HUD surfaces access, not logic

3.3 Frontend Developer

Responsibilities:

Implement HUD component layout

Wire buttons to existing routes/dialogs

Integrate minimap component

Technical scope:

BottomHudComponent

Child components:

MiniMapComponent

HudButtonGridComponent

Constraints:

No game state mutation

Buttons trigger navigation or open dialogs only

3.4 Ledger Engineer (Consultative)

Responsibilities:

Verify that any displayed numeric indicators are derived views

3.5 QA & Test Engineer

Responsibilities:

Verify HUD renders across resolutions

Verify buttons route correctly

Verify no crashes with missing data

4. Data Contract

Allowed:

Minimap tile data from world view service

Player summary data from derived views

Forbidden:

Direct ledger queries

On‑the‑fly aggregation in UI

5. Execution Plan

Game Designer confirms HUD intent

Frontend Developer replaces placeholder HUD

QA validates layout and routing

Project Manager approves merge

6. Review Gate




7. Exit Condition

HUD is visible and interactive in gameplay screen

All checks pass

This document archived

Note on “Design Does Not Own Truth”

This concern is cross‑cutting and should live with an organizing agent, not the Game Designer.

Recommendation:

Treat this as a Project Manager enforcement rule or a small separate agent (e.g. Architecture Steward) responsible for:

Preventing UI or design documents from becoming authoritative truth

Ensuring all truth flows from ledger → views → UI

This keeps the Game Designer focused on meaning, not correctness.