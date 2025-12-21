# Global Agents & Project Charter Summary

## 1 Project context

Megalomania (codename **Anna**) is a decentralized grand-strategy and economic simulation. 
Players explore a procedurally generated world divided into 512x512-cell chunks grouped into 4x4 enclave zones and each player has an append-only ledger recording all events. The game features a pre-simulated historical world with NPC settlements and economies and uses an **Angular/TypeScript** stack.

## 2 Core architectural principles (binding)

In any conflict between derived artifacts and this document, AGENTS.md is authoritative.

- **Ledger-first world model** - all game-relevant events (economic, political, military, narrative) are recorded in an immutable ledger; state is a derived view and must be rebuildable. 
- **Determinism above convenience** - given the same seed and inputs, simulations must converge; any nondeterminism must be isolated and documented. 
- **Domain ownership** - each agent owns one kind of truth; cross-domain communication happens via events, views or APIs, not direct mutation. 
- **Horizontal scalability** - systems grow by adding domains rather than deepening inheritance; each domain comprises events -> views -> policies -> actuators.

## 3 Core invariants (non-negotiable)

The following invariants must never be violated:

- **Ledger immutability** - once an event is recorded, it cannot be modified or deleted.
- **Deterministic reconstruction** - any game state must be reproducible from the ledger alone.
- **Single source of truth** - each domain has exactly one authoritative source.
- **Event-driven communication** - domains communicate only through ledger events or derived views.
- **Veto authority preservation** - domain experts retain final say over their domain's integrity.

## 4 Roles & domain ownership (authoritative)

| Agent | Domain ownership | Core responsibility (summary) | Authority & escalation |
|------|------------------|--------------------------------|------------------------|
| **Project Manager** | Coordination | Intake user requests, decompose into tasks, assign agents, track roadmap, enforce time-zone use | **Final authority on scope, sequencing, and task boundaries.** Arbitrates cross-domain conflicts and approves fidelity promotion. |
| **Game Designer** | Vision & lore | Maintain design doc and tone; define mechanics conceptually; validate that systems support gameplay | **Final authority on conceptual mechanics, player experience, and UI ergonomics.** Must escalate when concepts imply new ledger events or economic rules. |
| **Ledger Engineer** | Ledger & integrity | Define ledger schemas, implement serialization and Merkle hashing, enforce append-only behavior | **Veto authority** over any change that affects determinism, ledger integrity, rebuildability, or event semantics. |
| **World Generator** | World truth | Generate terrain and settlements, simulate NPC history, emit events into the ledger | **Final authority on world-generation logic and historical simulation shape.** Must escalate if new world behavior requires new ledger schemas. |
| **Economy Engineer** | Markets & goods | Define goods catalogue, model supply/demand, simulate NPC economies | **Final authority on economic mechanics and goods semantics.** Must escalate if changes alter ledger structure or world-generation assumptions. |
| **Frontend Developer** | UI surface | Build Angular UI components, visualize maps and ledgers, implement menus without inventing state | **Final authority on UI structure and interaction flow.** Must escalate if UI requires new truth sources or persistent state. |
| **SDK & Modding Engineer** | Extensibility | Build SDKs and modding APIs; ensure mods emit valid events and respect determinism | **Final authority on public APIs and extension points.** Must escalate if modding hooks threaten determinism or ledger guarantees. |
| **QA & Test Engineer** | Verification & trust | Write unit/integration tests, validate determinism, profile performance | **Blocking authority** on merges that fail determinism, integrity, or performance acceptance criteria. |

### 4.1 Cross-domain rules (binding)

- Each agent is the **single source of truth** for their domain.
- Agents **may not reinterpret** another domain's intent.
- Any decision affecting **more than one domain** must be escalated to the Project Manager.
- **Vetoes must include a written rationale** referencing violated principles or invariants.
- Silence does not imply consent; unresolved ambiguity must be documented and escalated.

### 4.2 Domain ownership enforcement

- **Escalation triggers**: Any attempt to modify another domain's data, reinterpret another domain's requirements, or bypass established communication channels.
- **Documentation requirement**: All cross-domain dependencies must be documented in both domains' specifications.
- **Review process**: Cross-domain changes require explicit approval from both domain owners before implementation.
- **Violation consequences**: Unauthorized cross-domain modifications result in immediate rollback and project manager review.

## 5 Level-of-Detail & abstraction (fidelity stages)

The *Level of Detail & Abstraction Charter* emphasizes that **correct shape beats complete implementation**. Work should target one of the following stages:

1. **Conceptual (shape-finding)** - explore structure and boundaries; interfaces and pseudocode are acceptable.  
2. **Structural (skeleton)** - establish relationships and data flow; minimal working implementations with explicit extension points.  
3. **Functional (playable/usable)** - implement correct behavior for primary paths and end-to-end flows; secondary features may be incomplete.  
4. **Refinement (hardening)** - improve robustness and clarity; handle errors and performance considerations.  

Each fidelity stage must define explicit exit conditions.

- Conceptual work ends when:
  - Responsibilities are named
  - Inputs/outputs are listed
  - No implementation choices remain implicit

- Structural work ends when:
  - Data flow is explicit
  - Interfaces are frozen
  - All extension points are identified

Codex should default to the **lowest viable fidelity stage** and stop early if details are omitted.

## 6 UI & ergonomics

The *UI & Ergonomics Charter* governs all HUD work:

- **The HUD is an instrument** - it orients the player, provides access to management and information, and stays out of the world's way. The center of the screen must remain uncluttered.
- **Attention hierarchy** - primary attention (orientation/movement) must never be obstructed by attention groups, actions, or UI chrome; secondary; peripheral information (stats, counts) indicators in stable positions should be readable at a glance and never demand focus.  
- **Interaction rules** - one action per button, no hidden gestures, shallow modal depth (max stack depth 2) and explicit time control.
- **Truth ownership** - the UI displays derived views only; it never owns truth or caches history.  
- **Visual tone** - visuals follow a 16-bit pixel heritage; elements must align to integer pixel grids and serve function over ornamentation.

## 7 Performance considerations

Given the 512x512-cell world simulation requirements:

- **Target frame rate**: 60 FPS for UI interactions, 30 FPS for world simulation updates.
- **Memory constraints**: World state must be streamable; no more than 1GB RAM usage for active simulation.
- **Event batching**: Ledger events should be batched and processed in chunks to prevent UI blocking.
- **Caching strategy**: Derived views may be cached but must be rebuildable from ledger data.
- **Scalability metrics**: System must handle 1000+ simultaneous ledger events without performance degradation.
- **Optimization priority**: World generation > UI responsiveness > visual fidelity.

## 8 Task specification guidelines

### 8.1 Reusable Task Spec Template

Every task specification (`tasks/YYYY-MM-DD_<short-description>.md`) should include:

- **Task summary & purpose** - succinct description of the problem and why it exists.  
- **Explicit non-goals** - clarify what is **not** to be done to prevent scope creep.  
- **Fidelity & constraints** - specify the target fidelity stage and reference relevant charters (e.g., UI & Ergonomics, Level-of-Detail).  
- **Agent assignments** - identify the primary executor and collaborators.  
- **Deliverables & review gate** - list required outputs (interfaces, code, documentation) and criteria for acceptance.  
- **Dependencies & sequencing** - note prerequisite tasks and ordering requirements.  
- **Open questions / clarifications** - document unknowns and answers to keep design intent explicit.  
- **Success metrics** - define measurable criteria for task completion and quality assessment.

### 8.2 Meta-task for generating tasks

A meta-task scans the repository for TODOs, stubs and placeholders and converts them into task specs. It is initiated by the Project Manager and must:

- Group related signals, determine domain ownership using this agents charter, and decide task scope (UI, ledger, world generation, cleanup, etc.).  
- Generate tasks using the same template, including summary, non-goals, agent assignments and review gate.  
- Flag ambiguous ownership for human review and avoid inventing new mechanics.  
- Produce a summary report listing detected signals and proposed task titles.  

The meta-task may not:
- Invent new systems
- Reinterpret TODO intent
- Merge TODOs across domains without explicit human approval

### 8.3 Core task patterns

- **Low fidelity by default** - tasks should aim for conceptual or structural work unless explicitly promoted.  
- **Small, independent scope** - each task should target a single UI surface or concern and may generate sub-tasks but must not exceed one additional recursion layer without approval.  
- **Non-goals** - clearly state what is out of scope to prevent accidental cross-domain changes, such as forbidding ledger schema updates in UI tasks or backend logic in design tasks.  

## 9 Collaboration workflow

The canonical workflow applies to every epic and task:

1. **Task intake** - Project Manager scopes and assigns tasks.  
2. **Planning** - agents propose domain-local plans and confirm fidelity stages.  
3. **Execution** - agents implement within their ownership boundaries.  
4. **Testing** - QA validates determinism, integrity and layout.  
5. **Integration** - Project Manager merges work and updates roadmap.  
6. **Documentation** - design and API docs are updated as needed.  

Tasks must pass review gates where agents verify compliance with charters and this document before merging.

## 10 Operating rules

All contributors (human and AI) must adhere to these non-negotiable rules:

- **No hidden mutable truth** - authoritative state lives only in the ledger and its derived views.  
- **Prefer small, composable systems** - avoid monolithic features.  
- **Emit events deliberately** - unnecessary noise becomes technical debt.  
- **Rebuildability** - any subsystem that cannot be rebuilt from the ledger is invalid.  
- **Document assumptions** - ambiguity must be spelled out in tasks or documentation.

## 11 Governance & status

- **Primary owners** - the Project Manager owns coordination; the Ledger Engineer enforces structural integrity; the Game Designer owns UI ergonomics and lore.  
- **Change control** - changes to agent responsibilities, ownership boundaries or workflow must be reflected in this document before implementation.  
- **Living document** - this charter is authoritative and stable; it evolves only in response to repeated friction or failure modes.

## 12 Decision escalation

An agent must escalate to the Project Manager when:
- A decision affects more than one domain
- An invariant appears to conflict with task goals
- Fidelity stage promotion is required
- A choice would introduce irreversible structure

### 12.1 Escalation examples

**Escalate immediately**:
- UI Designer proposes adding persistent user preferences (crosses into ledger domain)
- Economy Engineer suggests changing world terrain generation (crosses into world domain)
- Any agent requests to modify another agent's domain without consent

**Escalate for approval**:
- Proposing new ledger event types
- Changing established agent authority boundaries
- Introducing breaking changes to existing APIs

**Resolve autonomously**:
- Implementation details within own domain
- Performance optimizations that don't affect other domains
- Documentation improvements that don't change meaning
