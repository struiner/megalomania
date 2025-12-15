# ☀️ Anna — Procedural World, Ledger Simulation & Distributed Trading Game

Welcome to the **core design document** for the Angular-based MMO trading world known as **Anna**.
This README brings together *all aspects* of the world generation, distributed ledger model, settlement simulation, resource ecosystem, and tribal AI developed in the design thread so far.

This document outlines:

* The **game vision**
* The **distributed Per-Player Blockchain (PBC)** system
* The **world-generation pipeline**
* The **settlement founding algorithm**
* The **NPC tribe system**
* The **resource (GoodsType) classification**
* The **historical simulation layer**
* Integration points for an **Angular frontend**

Use this as a foundation for implementing gameplay systems, UI/UX, and backend integrations.

---

# 🌍 1. High-Level Vision

Anna is a **decentralized, distributed MMO trading game** set in a Hanseatic-fantasy universe. Players inhabit a mysterious infinite flat world divided into **512×512 cell chunks**, each large enough to contain a metropolis.

At game start, the player:

* arrives as part of a group of lost survivors magically teleported onto the world
* helps establish a settlement
* eventually inherits a **Counting House**, becoming an economic actor in a world shaped by:

  * centuries of procedural history
  * tribal factions
  * trade routes
  * magical resource fields

The game blends elements of:

* Commodore64 / Amiga strategy
* Medieval Hanseatic trade sims
* Procedural worldbuilding
* Blockchain-backed event integrity
* Angular-based interfaces

---

# 🔗 2. Distributed Ledger Architecture (PBC)

Instead of one global blockchain, **each player maintains their own Per-Player Blockchain (PBC)**. Integrity is guaranteed by cross-validation between players and periodic verification with a central checkpoint.

Key principles:

### ✔ Per-Player Chain

Each player maintains:

* A weekly block
* Minute-resolution events
* State commitments (resource balances, fleets, buildings, territory)

### ✔ Cross-Player Validation

Only players who directly interact need to validate each other’s chain integrity:

* Trade
* Diplomacy
* Shared chunk presence
* Combat
* Fleets colliding

### ✔ Optional Central Checkpoint

If a player is isolated for a long period, they:

* Sync with a lightweight central verifier
* Receive a `centralCheckpointRef` hash
* Use this as an anchor for later peers

### ✔ Anti-Cheat via Merkle Commitments

Blocks contain roots for:

* events
* state
* cross-player references
* chunk activity

The chain is compacted using deterministic, binary, big-endian formats.

---

# 🧱 3. Canonical Block & Event Structure

## 3.1 EventHeader

* Version
* EventType
* WeekNumber
* MinuteOfWeek
* PlayerIdShort (16 bytes)
* PayloadCommitment (Merkle root)
* Participants[]
* Optional ChunkCoord
* Signature (ed25519, 64 bytes)

Sorted by:

```
minuteOfWeek → eventType → eventId
```

## 3.2 BlockHeader

* BlockIndex (weekly)
* PlayerIdShort
* prevBlockHash
* eventsRoot
* stateRoot
* crossRefsRoot
* chunkActivityRoot
* optional centralCheckpointRef
* signature

### Root Construction Rules

All Merkle trees use:

```
leaf  = H(0x00 || treeTag || leafBytes)
node  = H(0x01 || treeTag || leftHash || rightHash)
```

Odd-item rule: last hash carries upward.

---

# 🌎 4. World Generation Pipeline

A fully procedural pipeline generates:

* Terrain
* Biomes
* Resource distributions
* NPC tribal territories
* 15–20 human settlements
* Trade routes
* Historical events

### Pipeline Steps

1. Generate terrain & resource noise fields.
2. Select an **Enclave Zone** (4×4 chunks).
3. Place **NPC tribes** (foxfolk, Romans, termite collective, etc.).
4. Found human settlements in **three waves**:

   * Wave 1: Proto-capitals
   * Wave 2: Resource towns
   * Wave 3: Hamlets
5. Resolve conflicts & migration.
6. Simulate 20–40 years of enclave history.
7. Select player starting town.

---

# 🏕 5. NPC Tribal Archetypes

Each tribe has unique rules for territory, resource preference, and hostility.

## Foxfolk

* Semi-nomadic
* Prefer woods, forage, pelts, honey
* Low aggression, high stealth

## Roman Enclave

* Disciplined & territorial
* Prefer stone, marble, rivers
* Build forts & villas
* Claim strategic passes

## Termite Collective

* Eusocial superorganism
* Thrive in hot, wood-rich biomes
* Build mega-mounds & tunnel networks
* High hostility to construction activity

Additional tribes can be added easily.

---

# 🛖 6. Settlement Founding Algorithm

The founding algorithm determines **where** settlements appear and **why**.

Each candidate cell receives:

```
FOUNDING_SCORE =
  + EarlyResourceScore * W_EARLY
  + MidgameResourceScore * W_MID
  + TerrainSuitabilityScore * W_TERRAIN
  + WaterAccessScore * W_WATER
  + ElevationScore * W_ELEVATION
  + RoadPotentialScore * W_ROAD
  + ExpansionPotentialScore * W_EXPANSION
  - TribalPressureScore * W_TRIBAL
  - MagicHazardScore * W_MAGIC
  - DangerScore * W_DANGER
  - IsolationPenalty * W_ISOLATION
```

Weights vary per founding wave:

* **Wave 1:** major capitals → prioritize safety, water, early resources
* **Wave 2:** resource towns → prioritize specialized clusters, road potential
* **Wave 3:** frontier hamlets → tolerate risk, chase opportunities

Settlements *move* to avoid tribal territory or clustered placement.

---

# 📦 7. GoodsType Classification

The game includes 140+ goods across technological eras.

Categories extracted for simulation:

* **Category A:** medieval/organic goods (Wood, Grain, Pelts…)
* **Category B:** stone/metals/mineral goods
* **Category C:** agricultural/colonial goods
* **Category D:** industrial goods
* **Category E:** gases & extractives
* **Category F:** magical goods (Aetherium, Dragonite, Gravitanium…)
* **Category G:** exotic crystals & arcane compounds

These drive:

* settlement site scoring
* tribal placement rules
* economic simulation
* production constraints
* trade route formation

---

# 📜 8. Historical Simulation (20–40 Years)

After founding settlements and tribes, a historical simulation runs:

* population growth
* trade network formation
* resource flows
* famine, war, alliances
* tribal raids
* magical anomalies
* failed hamlets
* merging of settlements

This creates:

* an enclave with personality
* plausible trade needs
* political factions
* a **Genesis Chain**, anchoring world history

---

# 🪙 9. Genesis Chain (System Ledger)

Before the player joins, enclave history is serialized into a **system-owned blockchain**:

* weekly blocks
* NPC-only events
* settlement evolution
* trade logs
* territorial expansions
* conflicts and merges

The player’s PBC begins with a reference to the **final Genesis hash**.

---

# 🧭 10. Player Onboarding

The player:

* arrives in the enclave via mysterious teleportation
* helps found a town
* eventually inherits a Counting House
* becomes a ledger node using the PBC model
* immediately integrates into the enclave’s economy

---

# 🧱 11. Angular Project Integration

This simulation feeds into Angular frontend components:

## Suggested Folders

```
src/
  app/
    core/           # Services (worldgen, time, ledgers, economic sim)
    shared/         # Pipes, components, directives
    screens/
      gameplay/
      world-map/
      settlements/
      tribes/
      economy/
```

## Key Angular Services

* `WorldgenService`
* `SettlementService`
* `TribeService`
* `GoodsService`
* `LedgerService` (PBC logic)
* `HistoryService`
* `ChunkService`

## UI Concepts

* world map explorer
* settlement list & detail pages
* trade route visualizer
* ledger explorer (per-player viewing)
* resource panel

---

# 🧭 12. Roadmap

### ✔ Implement worldgen pipeline

### ✔ Settlement founding waves

### ✔ NPC tribe territories

### ✔ GoodsType classification

### ✔ Genesis history simulation

### ☐ Implement PBC serialization (block & event payloads)

### ☐ Implement Angular UI for world exploration

### ☐ Add gameplay systems: trade, fleets, diplomacy

### ☐ Integrate central checkpoint server logic

### ☐ Add sandboxed mod layers (tribes, anomalies, resources)

---

# 💙 Conclusion

This README centralizes the full conceptual arc of the game.
It covers ledger verification, procedural enclaves, tribal AI, and historical worldbuilding—all ready to integrate into an Angular project.

Below are additional **API schemas** and **UML-style structures** to help with concrete implementation.

---

# 📡 13. Core API Schemas

These schemas describe core data contracts between frontend (Angular) and backend (simulation/ledger services). They are expressed in TypeScript-like notation but can be mapped to any language.

## 13.1 Ledger & Blockchain

```ts
export type Hash128 = string; // 16-byte hex
export type PlayerID = string; // full identifier (public key hash)

export interface EventHeaderDTO {
  version: number;           // uint8
  eventType: number;         // uint8 enum
  weekNumber: number;        // uint32
  minuteOfWeek: number;      // uint16
  playerIdShort: Hash128;    // 16-byte hex
  eventId: Hash128;          // 16-byte hex
  payloadCommitment: Hash128;// 16-byte hex
  participants: Hash128[];   // other player short IDs
  chunkCoord?: {
    x: number;               // int32
    y: number;               // int32
  };
  signature: string;         // ed25519 signature hex
}

export interface BlockHeaderDTO {
  version: number;           // uint8
  blockIndex: number;        // week
  playerIdShort: Hash128;
  prevBlockHash: Hash128 | null;
  eventsRoot: Hash128;
  stateRoot: Hash128;
  crossRefsRoot: Hash128;
  chunkActivityRoot: Hash128;
  centralCheckpointRef?: Hash128;
  signature: string;
}

export interface CrossRefDTO {
  otherPlayerIdShort: Hash128;
  otherBlockHash: Hash128;
  eventId: Hash128;
  relationType: 'TRADE' | 'TREATY' | 'COMBAT' | 'SYNC';
}
```

### Ledger HTTP/WS Endpoints (Example)

```ts
// Get latest block header for a player
GET /api/ledger/:playerId/latest-block
→ BlockHeaderDTO

// Get block range for a player
GET /api/ledger/:playerId/blocks?from=:start&to=:end
→ BlockHeaderDTO[]

// Submit new block segment (client → server → optional checkpoint)
POST /api/ledger/:playerId/blocks
body: { headers: BlockHeaderDTO[], events: EventHeaderDTO[] }
→ { ok: boolean; centralCheckpointRef?: Hash128 }

// Request event payloads for verification
POST /api/ledger/event-payloads
body: { eventIds: Hash128[] }
→ { [eventId: string]: any /* typed payloads */ }
```

---

## 13.2 World Generation & Enclave

```ts
export interface ChunkCoord {
  x: number;
  y: number;
}

export interface SettlementDTO {
  id: string;
  name: string;
  factionId: string;
  type: 'CAPITAL' | 'TOWN' | 'HAMLET' | 'FORT' | 'MOUND' | 'ENCAMPMENT';
  coord: ChunkCoord & { cellX: number; cellY: number };
  foundingYear: number;
  population: number;
  tags: string[]; // e.g. ['mining', 'trade_hub', 'burned_rebuilt']
  primaryGoods: GoodsType[];
  dangerLevel: number; // 0–1 normalized
}

export interface TribeDTO {
  id: string;
  name: string;
  archetype: 'FOXFOLK' | 'ROMAN' | 'TERMITE' | 'CUSTOM';
  territoryChunks: ChunkCoord[];
  hostilityLevel: number;   // 0–1
  notes: string[];
}

export interface EnclaveSummaryDTO {
  seed: string;
  regionChunks: ChunkCoord[];
  settlements: SettlementDTO[];
  tribes: TribeDTO[];
  genesisBlockHash: Hash128;
}
```

Example endpoints:

```ts
// Generate or fetch enclave for a world seed
GET /api/world/enclave?seed=:seed
→ EnclaveSummaryDTO

// Get detailed simulation history for a settlement
GET /api/world/settlements/:id/history
→ { events: any[]; summary: string }
```

---

## 13.3 Goods & Economy

```ts
export enum GoodsType {
  Wood = 'wood',
  Brick = 'Brick',
  Grain = 'Grain',
  Hemp = 'Hemp',
  Wool = 'Wool',
  RawMetal = 'RawMetal',
  Honey = 'Honey',
  Salt = 'Salt',
  MetalGoods = 'MetalGoods',
  Mead = 'Mead',
  Cloth = 'Cloth',
  Beer = 'Beer',
  Stockfish = 'Stockfish',
  Clothing = 'Clothing',
  Cheese = 'Cheese',
  Pitch = 'Pitch',
  Pelts = 'Pelts',
  Meat = 'Meat',
  Wine = 'Wine',
  Spices = 'Spices',
  Clay = 'clay',
  Marble = 'marble',
  Rubber = 'rubber',
  Glassware = 'glassware',
  Tea = 'tea',
  Dye = 'dye',
  Pottery = 'pottery',
  Cocoa = 'cocoa',
  Coffee = 'coffee',
  Cotton = 'cotton',
  Sugar = 'sugar',
  Tobacco = 'tobacco',
  Silver = 'silver',
  Saffron = 'saffron',
  Gold = 'gold',
  Gemstones  = 'gemstones',
  Jewelry = 'jewelry',
  Paper = 'paper',
  Coal = 'coal',
  Steel = 'steel',
  Oil = 'oil',
  PlasticGoods = 'PlasticGoods',
  Aluminium = 'Aluminium',
  Titanium = 'titanium',
  Fuel = 'fuel',
  Hydrogen = 'hydrogen',
  Oxygen = 'oxygen',
  Helium = 'helium',
  Fertilizer = 'fertilizer',
  Copper = 'copper',
  ManaSlime = 'ManaSlime',
  AetherResidue = 'AetherResidue',
  Silicon = 'silicon',
  Gunpowder = 'gunpowder',
  CarbonFiber = 'carbonFiber',
  Electronics = 'Electronics',
  PlasmaGel = 'PlasmaGel',
  Machinery = 'Machinery',
  Obsidian = 'Obsidian',
  Chemicals = 'Chemicals',
  Granite = 'Granite',
  Nitrogen = 'Nitrogen',
  Crylithium = 'Crylithium',
  Vortanite = 'Vortanite',
  Neptunium = 'Neptunium',
  Aetherium = 'Aetherium',
  Solarium = 'Solarium',
  Quantite = 'Quantite',
  Xenorite = 'Xenorite',
  Luminar = 'Luminar',
  Gravitanium = 'Gravitanium',
  Obscurium = 'Obscurium',
  Radiantite = 'Radiantite',
  Pulsarite = 'Pulsarite',
  Novacite = 'Novacite',
  Zephyrium = 'Zephyrium',
  Astralite = 'Astralite',
  Nebulon = 'Nebulon',
  Chronotite = 'Chronotite',
  Thermium = 'Thermium',
  Electrite = 'Electrite',
  Magnetarite = 'Magnetarite',
  Dragonite = 'Dragonite',
  Emberith = 'Emberith',
  Glimbrite = 'Glimbrite',
  Tharnax = 'Tharnax',
  Velunor = 'Velunor',
  Kryntal = 'Kryntal',
  Zorvium = 'Zorvium',
  Eldrithium = 'Eldrithium',
  Morvex = 'Morvex',
  Sylvaran = 'Sylvaran',
  Durnacite = 'Durnacite',
  Luminex = 'Luminex',
  Virelium = 'Virelium',
  Nexalite = 'Nexalite',
  Quenril = 'Quenril',
  Arcanite = 'Arcanite',
  Felbrim = 'Felbrim',
  Xenthium = 'Xenthium',
  Myrralith = 'Myrralith',
  Zephyrite = 'Zephyrite',
  Nexos = 'Nexos',
  Berillium = 'Berillium',
}

export interface ResourceBundle {
  good: GoodsType;
  amount: number; // may map to uint64 in binary
}

export interface TradeEventPayload {
  tradeId: string;
  fromPlayer: PlayerID;
  toPlayer: PlayerID;
  fromSettlementId?: string;
  toSettlementId?: string;
  itemsGiven: ResourceBundle[];
  itemsReceived: ResourceBundle[];
}
```

---

# 🧬 14. UML Structures (Textual)

Below are UML-style class diagrams expressed in Markdown code blocks. These capture the relationships between major domain types.

## 14.1 Ledger Domain UML

```text
+------------------+
| PlayerIdentity   |
+------------------+
| - playerId: ID   |
| - publicKey      |
| - createdAtWeek  |
+------------------+
          |
          | 1
          | owns
          v
+------------------+
| PlayerChain      |
+------------------+
| - blocks: Block[]|
| - owner: Player  |
+------------------+
          |
          | *
          v
+------------------+
| Block             |
+-------------------+
| - header: BlockHeader|
| - events: Event[]    |
+-------------------+
          |
          | *
          v
+------------------+
| Event            |
+------------------+
| - header: EventHeader |
| - payload: any        |
+------------------+

+------------------+
| CrossRef         |
+------------------+
| - otherPlayer    |
| - otherBlockHash |
| - eventId        |
+------------------+
```

## 14.2 World & Settlement UML

```text
+---------------------+
| World               |
+---------------------+
| - seed: string      |
| - chunks: Chunk[]   |
+---------------------+
           |
           | *
           v
+---------------------+
| Chunk               |
+---------------------+
| - coord: ChunkCoord |
| - cells: Cell[][]   |
+---------------------+
           |
   +-------+---------+
   |                 |
   | contains        | contains
   v                 v
+----------------+   +------------------+
| Settlement     |   | TribalTerritory  |
+----------------+   +------------------+
| - id           |   | - tribeId        |
| - name         |   | - area: Chunk[]  |
| - factionId    |   +------------------+
| - type         |
| - population   |
| - primaryGoods |
+----------------+
```

## 14.3 Tribe & Faction UML

```text
+------------------+
| Faction          |
+------------------+
| - id: string     |
| - name: string   |
| - type: enum     |
+------------------+
          ^
   +------+------+ 
   |             |
   v             v
+-----------+  +------------+
| Human     |  | Tribe      |
+-----------+  +------------+
| culture   |  | archetype  |
| politics  |  | hostility  |
+-----------+  +------------+

+------------------+
| Tribe            |
+------------------+
| - id             |
| - name           |
| - archetype      |
| - hostilityLevel |
| - territory      |
+------------------+
          |
          | 1..*
          v
+------------------+
| TribalSettlement |
+------------------+
| - id             |
| - kind           |
| - coord          |
+------------------+
```

## 14.4 Angular Service Layer UML (Conceptual)

```text
+----------------------+        +---------------------+
| WorldgenService      |        | LedgerService       |
+----------------------+        +---------------------+
| + generateEnclave()  |        | + getLatestBlock()  |
| + getEnclave(seed)   |        | + submitBlocks()    |
+----------------------+        +---------------------+
           |                              |
           | uses                         | uses
           v                              v
+----------------------+        +---------------------+
| SettlementService    |        | HistoryService      |
+----------------------+        +---------------------+
| + listSettlements()  |        | + getSettlementHist |
| + getSettlement(id)  |        | + getPlayerHist     |
+----------------------+        +---------------------+
```

---

# 🧩 15. Next Steps

You can now:

* Implement backend APIs to match these DTOs
* Map UML structures into actual classes/entities
* Hook Angular services into `/api/world/*` and `/api/ledger/*` routes
* Extend the UML with additional domains (fleets, companies, construction, diplomacy)

If you’d like, we can next:

* Design **event payload schemas** in detail (per EventType)
* Create **OpenAPI/Swagger** definitions for all endpoints
* Draft **Angular service stubs** and example component bindings
