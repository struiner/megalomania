Epic: Interior Room Blueprint Creator

Purpose:
Develop a tool for designing interior rooms (ships, buildings, dungeons) with dimensions, purpose, hazards and notable features. The creator should allow saving multiple blueprints, import/export them as JSON, and integrate with the world‑generation and structure systems.

In Scope:

Data model for RoomBlueprint with fields (name, width, height, purpose, hazards, features).

UI editor for creating/editing/removing blueprints and displaying basic metrics (area).

Hazard enumeration and integration with existing HazardType or similar enums.

JSON import/export of room blueprints.

Validation rules (e.g., minimum sizes, required names, hazard constraints).

Ledger event definitions for blueprint creation/modification to allow historical tracking (structural fidelity only).

Out of Scope:
Procedural interior generation, placement in the world, 3‑D rendering or pathfinding.

Seed Tasks:

Room Blueprint Data Model & Hazards Enum Integration.

Blueprint Import/Export Service with versioning.

Room Blueprint Editor UI: structural layout with forms, hazard pickers, list of saved rooms.

Validation Service: ensure physical plausibility (non‑zero dimensions) and hazard logic.

Ledger Event Wiring: record blueprint creation/modification events.

Phases: planning, model & service implementation, UI skeleton & import/export integration, review. Exit when users can create blueprints, see metrics, save/load them deterministically and ledger events are emitted.