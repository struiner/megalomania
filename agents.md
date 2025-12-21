# Global Agents & Project Charter Summary

## 1 Project context

Megalomania (codename **Anna**) is a decentralized grand‑strategy and economic simulation.  
Players explore a procedurally generated world divided into 512×512‑cell chunks grouped into 4×4 enclave zones and each player has an append‑only ledger recording all events:contentReference[oaicite:0]{index=0}.  The game features a pre‑simulated historical world with NPC settlements and economies and uses an **Angular/TypeScript** stack:contentReference[oaicite:1]{index=1}.

## 2 Core architectural principles (binding)

- **Ledger‑first world model** – all game‑relevant events (economic, political, military, narrative) are recorded in an immutable ledger; state is a derived view and must be rebuildable:contentReference[oaicite:2]{index=2}.  
- **Determinism above convenience** – given the same seed and inputs, simulations must converge; any nondeterminism must be isolated and documented:contentReference[oaicite:3]{index=3}.  
- **Domain ownership** – each agent owns one kind of truth; cross‑domain communication happens via events, views or APIs—not direct mutation:contentReference[oaicite:4]{index=4}.  
- **Horizontal scalability** – systems grow by adding domains rather than deepening inheritance; each domain comprises events → views → policies → actuators:contentReference[oaicite:5]{index=5}.

## 3 Roles & domain ownership (authoritative)

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

### 3.1 Cross-domain rules (binding)

- Each agent is the **single source of truth** for their domain.
- Agents **may not reinterpret** another domain’s intent.
- Any decision affecting **more than one domain** must be escalated to the Project Manager.
- **Vetoes must include a written rationale** referencing violated principles or invariants.
- Silence does not imply consent; unresolved ambiguity must be documented and escalated.

## 4 Level‑of‑Detail & abstraction (fidelity stages)

The *Level of Detail & Abstraction Charter* emphasizes that **correct shape beats complete implementation**:contentReference[oaicite:14]{index=14}.  Work should target one of the following stages:

1. **Conceptual (shape‑finding)** – explore structure and boundaries; interfaces and pseudocode are acceptable:contentReference[oaicite:15]{index=15}.  
2. **Structural (skeleton)** – establish relationships and data flow; minimal working implementations with explicit extension points:contentReference[oaicite:16]{index=16}.  
3. **Functional (playable/usable)** – implement correct behavior for primary paths and end‑to‑end flows; secondary features may be incomplete:contentReference[oaicite:17]{index=17}.  
4. **Refinement (hardening)** – improve robustness and clarity; handle errors and performance considerations:contentReference[oaicite:18]{index=18}.  

Each fidelity stage must define explicit exit conditions.

- Conceptual work ends when:
  - Responsibilities are named
  - Inputs/outputs are listed
  - No implementation choices remain implicit

- Structural work ends when:
  - Data flow is explicit
  - Interfaces are frozen
  - All extension points are identified

Codex should default to the **lowest viable fidelity stage** and stop early if details are omitted:contentReference[oaicite:19]{index=19}.

## 5 UI & ergonomics

The *UI & Ergonomics Charter* governs all HUD work:

- **The HUD is an instrument** – it orients the player, provides access to management and information, and stays out of the world’s way:contentReference[oaicite:20]{index=20}.  The center of the screen must remain uncluttered:contentReference[oaicite:21]{index=21}.
- **Attention hierarchy** – primary attention (orientation/movement) must never be obstructed by UI chrome:contentReference[oaicite:22]{index=22}; secondary attention groups actions and indicators in stable positions:contentReference[oaicite:23]{index=23}; peripheral information (stats, counts) should be readable at a glance and never demand focus:contentReference[oaicite:24]{index=24}.  
- **Density & restraint** – empty space is a feature; no more than eight primary actions should be visible in the HUD at once:contentReference[oaicite:25]{index=25}.  Icons come before text; numbers last:contentReference[oaicite:26]{index=26}.  
- **Interaction rules** – one action per button, no hidden gestures, shallow modal depth (max stack depth 2) and explicit time control:contentReference[oaicite:27]{index=27}.
- **Truth ownership** – the UI displays derived views only; it never owns truth or caches history:contentReference[oaicite:28]{index=28}.  
- **Visual tone** – visuals follow a 16‑bit pixel heritage; elements must align to integer pixel grids and serve function over ornamentation:contentReference[oaicite:29]{index=29}:contentReference[oaicite:30]{index=30}.  

## 6 Task specification guidelines

### 6.1 Reusable Task Spec Template

Every task specification (`tasks/YYYY-MM-DD_<short-description>.md`) should include:

- **Task summary & purpose** – succinct description of the problem and why it exists:contentReference[oaicite:31]{index=31}.  
- **Explicit non‑goals** – clarify what is **not** to be done to prevent scope creep:contentReference[oaicite:32]{index=32}.  
- **Fidelity & constraints** – specify the target fidelity stage and reference relevant charters (e.g., UI & Ergonomics, Level‑of‑Detail):contentReference[oaicite:33]{index=33}.  
- **Agent assignments** – identify the primary executor and collaborators:contentReference[oaicite:34]{index=34}.  
- **Deliverables & review gate** – list required outputs (interfaces, code, documentation) and criteria for acceptance:contentReference[oaicite:35]{index=35}.  
- **Dependencies & sequencing** – note prerequisite tasks and ordering requirements:contentReference[oaicite:36]{index=36}.  
- **Open questions / clarifications** – document unknowns and answers to keep design intent explicit:contentReference[oaicite:37]{index=37}.  

### 6.2 Meta‑task for generating tasks

A meta‑task scans the repository for TODOs, stubs and placeholders and converts them into task specs.  It is initiated by the Project Manager and must:

- Group related signals, determine domain ownership using this agents charter, and decide task scope (UI, ledger, world generation, cleanup, etc.):contentReference[oaicite:38]{index=38}.  
- Generate tasks using the same template, including summary, non‑goals, agent assignments and review gate:contentReference[oaicite:39]{index=39}.  
- Flag ambiguous ownership for human review and avoid inventing new mechanics:contentReference[oaicite:40]{index=40}.  
- Produce a summary report listing detected signals and proposed task titles:contentReference[oaicite:41]{index=41}.

The meta-task may not:
- Invent new systems
- Reinterpret TODO intent
- Merge TODOs across domains without explicit human approval

### 6.3 Core task patterns

- **Low fidelity by default** – tasks should aim for conceptual or structural work unless explicitly promoted:contentReference[oaicite:42]{index=42}.  
- **Small, independent scope** – each task should target a single UI surface or concern and may generate sub‑tasks but must not exceed one additional recursion layer without approval:contentReference[oaicite:43]{index=43}.  
- **Non‑goals** – clearly state what is out of scope to prevent accidental cross‑domain changes, such as forbidding ledger schema updates in UI tasks or backend logic in design tasks:contentReference[oaicite:44]{index=44}.  

## 7 Collaboration workflow

The canonical workflow applies to every epic and task:contentReference[oaicite:45]{index=45}:

1. **Task intake** – Project Manager scopes and assigns tasks.  
2. **Planning** – agents propose domain‑local plans and confirm fidelity stages.  
3. **Execution** – agents implement within their ownership boundaries.  
4. **Testing** – QA validates determinism, integrity and layout.  
5. **Integration** – Project Manager merges work and updates roadmap.  
6. **Documentation** – design and API docs are updated as needed.  

Tasks must pass review gates where agents verify compliance with charters and this document before merging.

## 8 Operating rules

All contributors (human and AI) must adhere to these non‑negotiable rules:contentReference[oaicite:46]{index=46}:

- **No hidden mutable truth** – authoritative state lives only in the ledger and its derived views.  
- **Prefer small, composable systems** – avoid monolithic features.  
- **Emit events deliberately** – unnecessary noise becomes technical debt.  
- **Rebuildability** – any subsystem that cannot be rebuilt from the ledger is invalid.  
- **Document assumptions** – ambiguity must be spelled out in tasks or documentation.

## 9 Governance & status

- **Primary owners** – the Project Manager owns coordination; the Architecture Steward enforces structural integrity; the Game Designer owns UI ergonomics and lore:contentReference[oaicite:47]{index=47}.  
- **Change control** – changes to agent responsibilities, ownership boundaries or workflow must be reflected in this document before implementation:contentReference[oaicite:48]{index=48}.  
- **Living document** – this charter is authoritative and stable; it evolves only in response to repeated friction or failure modes:contentReference[oaicite:49]{index=49}.:contentReference[oaicite:50]{index=50}

## 10 Decision Escalation

An agent must escalate to the Project Manager when:
- A decision affects more than one domain
- An invariant appears to conflict with task goals
- Fidelity stage promotion is required
- A choice would introduce irreversible structure