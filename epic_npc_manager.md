# EPIC: NPC Creation & Authoring Screen

**Epic ID:** EPIC-NPC-CREATION  
**Project:** Megalomania (Codename: Anna)  
**Status:** Proposed  
**Primary Owner:** Project Manager  
**Primary Domain:** Frontend (UI)  
**Collaborating Domains:** World Generator, Economy Engineer, Ledger Engineer  
**Target Fidelity:** Conceptual → Structural  
**Explicitly NOT Functional unless promoted**

---

## 1. Purpose

Provide a **developer-facing NPC authoring screen** that enables the creation of
**event-sourced NPC economic actors** for the Anna trading game.

The screen exists to:
- define NPC identity, role, appearance, possessions, and conduct policies
- preview deterministic ledger events
- emit NPC creation events to the **Game Ledger**
- record governance decisions in **agents.ledger**

This screen is an **authoring tool**, not a simulation surface and not player-facing.

---

## 2. Ledger Separation (Non-Negotiable)

This project uses two distinct ledgers:

### Game Ledger (Merkle-tree ledger)
- Authoritative source of world truth
- Defines NPC existence, placement, possessions, and actions
- Append-only, cryptographically chained

### agents.ledger
- Records decisions, rationale, precedents, and outcomes
- Governs *how work is done*, not *what exists in the world*
- Must never emit or replay game-ledger events

Rules:
- NPCs exist **only** in the Game Ledger
- NPC creation UI may emit **only** Game Ledger events
- All design and scope decisions MUST be recorded in agents.ledger
- The two ledgers must never reference each other

Violations are BLOCKING.

---

## 3. NPC Definition (Authoritative Model)

An NPC is an **event-sourced economic actor** with physical presence.

NPCs are:
- Ledger-addressable entities
- Rendered in the world
- Capable of owning or operating assets
- Participants in markets and logistics
- Deterministic, policy-driven actors

NPCs are NOT:
- Stateful objects
- Autonomous AI minds
- Mutable records
- UI-owned data
- Scripted behavior trees

---

## 4. Binding NPC Requirements

### 4.1 Identity
- Deterministic, globally unique NPC ID
- ID derivable from ledger events
- Names and titles are non-authoritative metadata

### 4.2 Physical Presence
- World location defined by ledger event
- Rendered as top-down pixel-art sprite
- Appearance is cosmetic and derived

### 4.3 Roles
- NPC roles are declarative (mayor, trader, explorer, general)
- Roles grant **permissions**, not behavior
- Roles restrict which events the NPC may emit

### 4.4 Possessions
- NPCs do not “own” objects
- Ledger events establish control or association:
  - fleets
  - counting houses
  - businesses
- Possessions are reconstructible from events

### 4.5 Inventory & Stats
- Inventory is a derived view of trade and transfer events
- Stats are aggregates over historical behavior
- No stat may be mutated directly

### 4.6 Conduct (Policy, Not AI)
NPC behavior is defined as **deterministic policies**, such as:
- thresholds
- schedules
- permissions
- triggers

Examples:
- “If grain price < X, emit buy order”
- “Once per season, explore adjacent region”
- “If treasury < Y, emit tax event”

Policies must be expressible as:
