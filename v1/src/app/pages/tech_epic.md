
ChatGPT said:
Epic Task Specification
Technology Tree Editor & Management (Semi‑Recursive)
This document defines an Epic Task for Megalomania. It follows the same structure as the Gameplay HUD & Interface Foundations epic but applies to the systems needed to define, edit and manage multiple technology trees. The goal is to provide a robust foundation for research‑driven progression that can support the game’s diverse cultures and mechanics.

An epic task is a bounded initiative whose primary outcomes are:

A coherent architectural and UX foundation for the feature

A set of well‑scoped child tasks (task specifications) to implement it

Initial implementation where appropriate

This epic may generate further tasks recursively, but it must do so deliberately and visibly. Codex executes this epic under Project Manager coordination.

1. Epic Summary
Epic name: Technology Tree Editor & Management

Purpose:

Establish a system that allows designers and modders to create, edit and manage multiple technology trees, including importing/exporting tree definitions as JSON, wiring them into existing shared types/enums and accommodating highly dynamic, culture‑specific requirements. The system should provide a modular, ergonomic editor, enforce deterministic logic and integrate with the Per‑Player Blockchain (PBC) ledger for recording research events.

This epic addresses the foundation and structure of the technology system; it does not prescribe all possible research mechanics.

2. Authority & Governing Documents
This epic is governed by:

Global Agents Framework (agents.md)

UI & HUD Ergonomics Charter (relevant for editor UI)

Level of Detail & Abstraction Charter

Ledger & Event Schema documentation (for PBC integration)

All child tasks MUST explicitly reference these documents.

3. Epic Scope
3.1 In Scope
A data model for technology nodes and trees (generic enough to model different cultures)

A technology tree editor UI to create, edit, clone and delete tech trees

JSON import/export of tech tree definitions

Integration with existing shared types and enums to ensure tech effects and prerequisites reference valid game entities

Basic validation rules (acyclic dependency checking, prerequisite satisfaction, culture tagging)

Recording research events and completions in the PBC ledger at structural fidelity

Deterministic loading and saving of tech trees for reproducible gameplay

3.2 Explicitly Out of Scope
Balancing or designing specific technologies – that is a Game Designer domain

Creating new backend APIs for storage (assume existing persistence mechanisms)

Rendering culture‑specific art assets for the editor (visual polish beyond structure)

Implementing research point generation or progression mechanics (these will be separate ledger or economy tasks)

4. Agents & Responsibilities
Project Manager (Epic Owner)
Decompose this epic into child task specifications

Ensure tasks are sequenced to build data models before UI

Enforce scope and fidelity level

Game Designer
Define the conceptual structure and diversity of technology trees (e.g. cultural branches, prerequisites)

Provide sample tech tree definitions for testing

Validate the editor’s usability and clarity

Frontend Developer / Toolsmith
Implement the technology tree editor UI at Structural or early Functional fidelity

Integrate with JSON import/export

Wire UI interactions to shared types and enums without encoding game logic

Avoid premature abstraction or generic over‑generalisation until multiple trees warrant it

Backend Engineer / Ledger Engineer
Extend the ledger event schema to include tech research events (e.g., RESEARCH_START, RESEARCH_COMPLETE)

Ensure all research activities are recorded in the PBC with minute‑level accuracy and cross‑validation hooks

Provide deterministic APIs to load and save tech trees

Architecture Steward (Enforcement)
Enforce charter compliance (UI must remain a tool, not own truth)

Validate that dynamic tech definitions do not leak logic into UI or bypass shared ownership boundaries

Prevent overengineering (e.g., avoid building a generic graph library if a simpler tree suffices)

QA & Test Engineer
Validate determinism of import/export and tree loading

Test the editor for stability, culture tagging and validation rules

Ensure ledger events are emitted correctly and recorded across players

5. Epic Decomposition Strategy (Recursive)
The epic MUST be decomposed into child task specifications using the Reusable Task Spec Template. Decomposition rules:

Each child task must:

Be executable independently

Target a single concern (data model, UI component, ledger event, etc.)

Child tasks may themselves:

Produce further sub‑tasks (with justification)

But may not exceed one additional recursion layer without human approval

Tasks must prefer Structural fidelity unless explicitly promoted by the Project Manager and Architecture Steward.

6. Initial Child Task Candidates (Seed Set)
These tasks are expected but must still be formalised as individual task specs:

Tech Tree Data Model Definition

Define TypeScript interfaces/classes for TechNode, TechTree and CultureTag

Integrate with existing enums/types for effects, buildings, goods, etc.

Ensure models support custom metadata for cultures and prerequisites

JSON Import/Export Service

Create a deterministic parser/serializer for tech tree JSON files

Validate data against the TechNode/TechTree schema

Provide hooks for versioning and migration

Tech Tree Editor UI Skeleton

Build a structural UI with panels for tree overview, node detail, and connections

Support adding, editing and removing nodes

Integrate with the import/export service

Shared Enum & Type Integration

Fetch and display lists of valid effects, buildings or resources from existing enums

Provide pickers in the editor UI that bind to these lists

Ensure no new enums are created here (truth‑ownership remains with domain owners)

Ledger Event Wiring for Research

Define ledger event types for starting and completing research

Record research actions in the PBC ledger as minute‑resolution events

Provide stub services to emit these events without implementing research logic

Each of these MUST be elaborated into its own task.md file.

7. Execution Phases
Phase 1 — Planning (No Code)
Project Manager generates child task specs and sequences them

Game Designer provides conceptual examples of tech trees and culture tags

Architecture Steward reviews tasks for charter compliance and scope creep

Phase 2 — Data & Service Foundations
Backend engineer defines data models and import/export services

Frontend developer begins wiring structural UI components using placeholder data

QA validates deterministic parsing and serialization

Phase 3 — Editor Implementation
Frontend developer implements the editor UI skeleton and integrates pickers for shared enums

JSON import/export is wired into the UI

Ledger engineer adds event hooks for research operations

QA tests creation, editing, cloning and deletion flows at structural fidelity

Phase 4 — Review & Promotion
Game Designer validates that diverse cultures can be represented and that dynamic requirements are met

Architecture Steward decides if components can graduate to Functional fidelity

Completed tasks are archived; follow‑up tasks are generated for missing features or clarifications

8. Recursion & Task Generation Rules
This epic MAY generate:

Clarification tasks (e.g., ambiguous culture behaviour)

Validation tasks (e.g., more robust graph validation)

Integration tasks (e.g., connecting tech effects to buildings)

It MUST NOT generate:

Feature creep tasks beyond tech tree editing (e.g., implementing combat units)

Cross‑domain logic tasks (e.g., economy balancing within the editor)

Unbounded refactors of existing data models

9. Review Gates
Before the epic is considered successful:

 All seed tasks exist as specifications

 A basic technology tree editor UI is present and navigable (add/edit/delete nodes)

 JSON import/export works deterministically and validates input against the schema

 Shared enums/types are referenced, not duplicated

 Ledger events for research start and completion are defined and emitted

 UI & HUD Ergonomics Charter violations are resolved (editor must remain an instrument and respect attention hierarchy)

 No game logic resides in UI code

10. Exit Condition
This epic is complete when:

The technology tree editor exists as a stable foundation and supports basic operations

Tech tree definitions can be imported, edited, exported and tied to cultures via shared enums/types

Research events are recorded in the PBC ledger

Future work can be expressed as small, independent tasks (e.g., research progression, advanced validation)

This epic document can be archived

11. Notes on Reuse
This epic specification is a template for other large systems where dynamic, culture‑specific data must be authored and wired into the game. Future epics could include:

Technology Progression Mechanics (research point generation, buffs)

Culture & Society Modeling (law systems, traditions)

Diplomacy & Alliance Infrastructure