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
f(ledger_history, world_state_at_t) → event(s)


No hidden state. No randomness.

---

## 5. Domain Ownership

### Frontend Developer
- Owns UI layout, flow, and ergonomics
- Must comply with UI & Ergonomics Charter
- Must not own NPC truth or persistence

### World Generator
- Owns world placement semantics
- Defines valid spatial contexts

### Economy Engineer
- Owns economic roles, goods interaction semantics
- Defines valid market participation rules

### Ledger Engineer
- Owns NPC-related game ledger event schemas
- Veto authority over determinism and rebuildability

Cross-domain assumptions MUST be documented and escalated.

---

## 6. NPC Creation Screen – Conceptual UI Shape

### 6.1 Entry
- Developer-only route
- Explicit “NPC Authoring Mode” indicator

---

### 6.2 Panels (Conceptual)

#### NPC Identity Panel
- Deterministic ID (preview)
- Display name / title
- Primary role(s)

#### Appearance Panel
- Sprite selection (cosmetic only)
- Palette / variation (deterministic)

#### World Presence Panel
- Starting region / settlement
- Derived constraints and warnings

#### Economic Role Panel
- Market participation flags
- Allowed goods categories
- Initial affiliations

#### Possessions Panel
- Initial fleets / businesses / houses (references only)
- No implicit ownership

#### Conduct Policy Panel
- Declarative rules (thresholds, schedules)
- No scripting or code entry
- Deterministic preview only

#### Ledger Preview Panel
- Human-readable event list
- Deterministic serialization
- Explicit irreversibility warning

---

### 6.3 Actions
- **Validate** (domain constraint checks)
- **Emit to Game Ledger** (irreversible)
- **Discard Draft**

No autosave. No hidden persistence.

---

## 7. Fidelity Plan

### Phase 1: Conceptual
Deliverables:
- Screen layout definition
- NPC data contracts (interfaces only)
- Game-ledger event shapes (names + fields)
- No logic, no simulation

Exit conditions:
- All panels named
- Inputs and outputs explicit
- No implicit behavior

---

### Phase 2: Structural
Deliverables:
- Angular component skeleton
- Form wiring with mock data
- Deterministic ledger preview rendering
- Explicit extension points

Exit conditions:
- Data flow explicit
- UI owns no truth
- Event emission path clear

Functional behavior requires explicit promotion approval.

---

## 8. Success Criteria

This epic is successful when:
- NPCs can be authored without touching code
- NPC existence is fully reconstructible from ledger events
- NPCs participate in the economy without hidden state
- UI can be deleted without data loss
- Domain owners agree the shape is correct

---

## 9. Escalation Triggers

Escalate immediately if:
- New game-ledger schemas are required
- NPC attributes cross domain ownership
- Persistent draft storage is requested
- Simulation or AI logic is proposed
- Randomness is introduced

---

## 10. Deliverables Summary

- This epic specification
- NPC creation task specs (Conceptual first)
- Angular component skeleton
- Game-ledger NPC event interfaces
- agents.ledger entries for all major decisions

Failure to record decisions in agents.ledger is BLOCKING.

---

## 11. agents.ledger Requirements

The following MUST be recorded:
- NPC model decisions
- Policy design decisions
- Ledger schema approvals
- Rejected approaches and rationale

Precedent MUST be checked before escalation.

---

## 12. Design Principle Reminder

NPCs are **economic actors**, not minds.

They exist to:
- move goods
- create competition
- shape history

They do not think.
They emit events.

When uncertain:
- stop early
- document assumptions
- escalate
- do not invent mechanics