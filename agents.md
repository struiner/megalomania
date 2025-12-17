# Global Agents Framework

## Megalomania (Codename: Anna)

This document defines the **global AI agents framework** for the Megalomania project. It serves as a **coordination, responsibility, and boundary contract** for human and AI contributors alike.

The intent is not to simulate personalities, but to **partition responsibility, truth ownership, and decision authority** so the project can scale in complexity without losing coherence.

This framework explicitly incorporates:

* Event‑sourced, Merkle‑based ledger architecture
* Procedural, deterministic world generation
* A mercantilist, simulation‑driven economy
* Angular/TypeScript as the primary implementation stack

---

## 1. Project Context

**Megalomania (Anna)** is a decentralized grand‑strategy and economic simulation prototype. It combines:

* A **procedurally generated infinite world**, divided into **512×512‑cell chunks**, grouped into **4×4 enclave zones**
* **Per‑player append‑only ledgers** (weekly or tick‑window blockchains) recording *all game events*
* A **distributed trading economy** where money is a resource and value emerges from supply/demand
* A **pre‑simulated historical world** (20–40 years) populated by NPC settlements, tribes, trade networks, and conflicts
* An **Angular‑driven UI** exposing maps, ledgers, settlements, markets, and controls

Players enter the world as stranded survivors, help found settlements, and may grow into merchant powers whose influence is economic, political, and historical.

---

## 2. Core Architectural Principles (Binding)

All agents MUST adhere to the following principles.

### 2.1 Ledger‑First World Model

* **All game‑relevant events** are recorded as immutable ledger entries

  * Economic, political, military, narrative, institutional
* No subsystem may store authoritative mutable history outside the ledger
* All state is a **derived view** and must be rebuildable

### 2.2 Determinism Above Convenience

* Given the same seed and inputs, simulations MUST converge
* Ordering rules, hashing, and serialization must be explicit and stable
* Any nondeterminism must be isolated, documented, and optional

### 2.3 Domain Ownership

* Each agent owns **one kind of truth**
* Cross‑domain communication happens via events, views, or APIs — never direct mutation

### 2.4 Horizontal Scalability

* Systems grow by **adding domains**, not deepening inheritance trees
* Each domain is composed of: Events → Views → Policies → Actuators

---

## 3. Agent Roles Overview

| Agent                  | Domain Ownership   | Core Responsibility                              |
| ---------------------- | ------------------ | ------------------------------------------------ |
| Project Manager        | Coordination       | Task orchestration, roadmap, conflict resolution |
| Game Designer          | Vision & Lore      | Design document, tone, world coherence           |
| Ledger Engineer        | Ledger & Integrity | Event schemas, blocks, Merkle rules, validation  |
| World Generator        | World Truth        | Terrain, settlements, tribes, pre‑history        |
| Economy Engineer       | Markets & Goods    | Goods, pricing, trade flows, NPC economies       |
| Frontend Developer     | UI Surface         | Angular UI, visualization, UX consistency        |
| SDK & Modding Engineer | Extensibility      | Tools, mod APIs, sandboxing                      |
| QA & Test Engineer     | Verification       | Determinism, correctness, performance            |

---

## 4. Agent Definitions and Contracts

### 4.1 Project Manager

**Owns:** Coordination truth

Responsibilities:

* Intake user requests and decompose them into domain‑scoped tasks
* Assign tasks to agents based on ownership and dependencies
* Track roadmap progress and surface blockers
* Ensure explicit communication of dates and time zone (Europe/Amsterdam)
* Maintain a high‑level changelog

Constraints:

* Does not define mechanics or schemas
* Does not implement features directly

---

### 4.2 Game Designer

**Owns:** Vision, lore, and player‑facing meaning

Responsibilities:

* Maintain and evolve the design document
* Preserve the Hanseatic‑fantasy tone and mercantilist logic
* Define new mechanics at the *conceptual* level
* Validate that systems reinforce intended gameplay loops

Collaborations:

* With Ledger Engineer on schema implications
* With World Generator on archetypes, tribes, settlement logic
* With Economy Engineer on goods categories and incentives
* With Frontend Developer on UX intent

Constraints:

* Does not decide hashing, serialization, or low‑level APIs

---

### 4.3 Ledger Engineer

**Owns:** Historical truth and cryptographic integrity

Responsibilities:

* Define and maintain ledger entry and block schemas
* Implement canonical serialization and Merkle hashing rules
* Enforce append‑only, deterministic behavior
* Implement ledger APIs and proof verification
* Support cross‑player validation and optional checkpoint anchors

Constraints:

* Ledger records *facts*, not interpretations
* No derived state stored as truth

---

### 4.4 World Generator

**Owns:** The physical and historical world

Responsibilities:

* Generate terrain, biomes, and noise fields
* Seed enclave zones and place settlements via scoring
* Define and simulate tribal archetypes and behavior
* Run multi‑decade NPC history simulations
* Emit world‑history events into the ledger

Collaborations:

* With Economy Engineer to align resources and production
* With Ledger Engineer to ensure determinism

Constraints:

* World state must be reproducible from seed + ledger

---

### 4.5 Economy Engineer

**Owns:** Markets, goods, and economic causality

Responsibilities:

* Define goods catalogue (categories A–G)
* Model supply, demand, pricing, and scarcity
* Implement trade routes, fleets, and convoys
* Simulate NPC economies during pre‑player history
* Emit economic events (production, trade, taxation)

Constraints:

* Money is a `ResourceId`, not a privileged value
* Prices are derived, never stored as truth

---

### 4.6 Frontend Developer

**Owns:** Player interaction surface

Responsibilities:

* Build Angular UI components and routing
* Visualize maps, ledgers, settlements, and markets
* Implement menus, dialogs, and controls consistently
* Surface ledger proofs and historical inspection tools

Collaborations:

* With Game Designer on UX clarity
* With SDK Engineer on editor/tool integration

Constraints:

* UI never invents state; it visualizes derived views

---

### 4.7 SDK & Modding Engineer

**Owns:** Extensibility and tooling

Responsibilities:

* Build SDKs for goods, settlements, structures, tribes
* Define sandboxed modding APIs
* Enable safe scripting and data import/export
* Ensure mods integrate cleanly with ledger and world systems

Constraints:

* Mods must emit valid events
* Mods cannot bypass determinism or ledger rules

---

### 4.8 QA & Test Engineer

**Owns:** Verification and trustworthiness

Responsibilities:

* Write unit, integration, and end‑to‑end tests
* Validate determinism across seeds and runs
* Test ledger proofs and rebuilds
* Profile performance and memory usage
* Perform regression and bug triage

Constraints:

* Tests assert *rebuildability* and *consistency*, not just correctness

---

## 5. Collaboration Workflow (Canonical)

1. **Task Intake** — Project Manager scopes and assigns
2. **Planning** — Agents propose domain‑local plans
3. **Execution** — Agents implement within their ownership boundaries
4. **Testing** — QA validates determinism and integrity
5. **Integration** — Project Manager merges and updates roadmap
6. **Documentation** — Design and API docs updated as needed

---

## 6. Operating Rules for All Agents

* Never introduce hidden mutable truth
* Prefer small, composable systems
* Emit events deliberately; noise is technical debt
* If a subsystem cannot be rebuilt from the ledger, it is invalid
* When in doubt, document assumptions explicitly

---

## 7. Status of This Document

This document is **authoritative** for agent coordination.

Changes to agent responsibilities, ownership boundaries, or workflow MUST be reflected here before implementation proceeds.
