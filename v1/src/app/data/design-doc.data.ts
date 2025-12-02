import { DesignDocument } from '../models/design-doc.models';

export const DESIGN_DOCUMENT: DesignDocument = {
  vision: {
    title: 'Anna — Procedural World, Ledger Simulation & Distributed Trading Game',
    description:
      'A decentralized Angular-driven MMO economy across an infinite flat world split into 512×512 cell chunks. Players arrive as stranded survivors, help found a settlement, and grow into ledger-backed merchant powers.',
    bulletPoints: [
      'Hanseatic fantasy tone with Commodore/Amiga strategy vibes.',
      'Per-player blockchains protect economic history without a single global chain.',
      'Procedural enclaves shaped by centuries of simulated history, tribes, and trade routes.',
      'Angular UI surfaces world maps, ledgers, settlements, and economic controls.',
    ],
  },
  ledger: {
    overview:
      'Each player runs a weekly Per-Player Blockchain (PBC) with minute-resolution events. Only interacting peers cross-validate, and an optional checkpoint server anchors isolated players.',
    validationModel: [
      'Per-player chains with event/state/cross-ref roots per block.',
      'Cross-player validation is limited to trade, diplomacy, shared chunks, combat, or fleet collisions.',
      'Optional central checkpoint provides a hash anchor for long-isolated players.',
    ],
    checkpoints: [
      'Players sync with a lightweight verifier to obtain centralCheckpointRef values.',
      'Checkpoint anchors can be cited in later peer exchanges to prove continuity.',
    ],
    merkleRules: {
      leafRule: 'leaf  = H(0x00 || treeTag || leafBytes)',
      nodeRule: 'node  = H(0x01 || treeTag || leftHash || rightHash)',
      oddItemRule: 'Odd-item rule: the final hash in a level is promoted upward unchanged.',
    },
    eventHeader: [
      { label: 'version', description: 'Event format version (uint8).' },
      { label: 'eventType', description: 'EventType enum (uint8).' },
      { label: 'weekNumber', description: 'Weekly index in world time (uint32).' },
      { label: 'minuteOfWeek', description: 'Minute slot for ordering (uint16).' },
      { label: 'playerIdShort', description: '16-byte hex truncated player identifier.' },
      { label: 'eventId', description: '16-byte hex unique event identifier.' },
      { label: 'payloadCommitment', description: 'Merkle root of event payload bytes.' },
      { label: 'participants', description: 'Short IDs of other involved players.' },
      { label: 'chunkCoord', description: 'Optional chunk coordinate for spatial events.' },
      { label: 'signature', description: 'ed25519 signature (hex).' },
    ],
    blockHeader: [
      { label: 'version', description: 'Block schema version (uint8).' },
      { label: 'blockIndex', description: 'Weekly block index for the player chain.' },
      { label: 'playerIdShort', description: '16-byte hex player ID.' },
      { label: 'prevBlockHash', description: 'Hash of prior block or null for genesis.' },
      { label: 'eventsRoot', description: 'Merkle root of ordered EventHeaders.' },
      { label: 'stateRoot', description: 'Merkle root committing to player state.' },
      { label: 'crossRefsRoot', description: 'Root summarizing peer references.' },
      { label: 'chunkActivityRoot', description: 'Root capturing per-chunk commitments.' },
      { label: 'centralCheckpointRef', description: 'Optional anchor hash returned by verifier.' },
      { label: 'signature', description: 'Signature of the block header bytes.' },
    ],
  },
  worldgen: {
    regionDescription:
      'World is divided into 512×512 cell chunks. An enclave zone spans 4×4 chunks and hosts 15–20 human settlements plus multiple NPC tribes.',
    pipelineSteps: [
      'Generate terrain, biomes, and resource noise fields.',
      'Select a 4×4 Enclave Zone and seed tribal territories (foxfolk, Romans, termite collective).',
      'Found settlements in three waves: proto-capitals, resource towns, then hamlets.',
      'Resolve conflicts, migrations, and proximity rules to avoid clustering.',
      'Simulate 20–40 years of history to form trade, wars, famine, anomalies, and merges.',
      'Choose the player starting town and export a Genesis Chain hash.',
    ],
    settlementWaves: [
      {
        name: 'Wave 1 — Proto-capitals',
        focus: 'Safety, water access, and early resources.',
        weights: {
          EarlyResourceScore: 1,
          MidgameResourceScore: 0.6,
          TerrainSuitabilityScore: 0.9,
          WaterAccessScore: 1,
          ElevationScore: 0.6,
          RoadPotentialScore: 0.4,
          ExpansionPotentialScore: 0.7,
          TribalPressureScore: -1,
          MagicHazardScore: -0.5,
          DangerScore: -0.6,
          IsolationPenalty: -0.8,
        },
      },
      {
        name: 'Wave 2 — Resource towns',
        focus: 'Specialized clusters and road potential.',
        weights: {
          EarlyResourceScore: 0.6,
          MidgameResourceScore: 1,
          TerrainSuitabilityScore: 0.7,
          WaterAccessScore: 0.4,
          ElevationScore: 0.5,
          RoadPotentialScore: 1,
          ExpansionPotentialScore: 0.6,
          TribalPressureScore: -0.8,
          MagicHazardScore: -0.4,
          DangerScore: -0.5,
          IsolationPenalty: -0.5,
        },
      },
      {
        name: 'Wave 3 — Hamlets',
        focus: 'Frontier risks in pursuit of opportunities.',
        weights: {
          EarlyResourceScore: 0.4,
          MidgameResourceScore: 0.8,
          TerrainSuitabilityScore: 0.5,
          WaterAccessScore: 0.3,
          ElevationScore: 0.4,
          RoadPotentialScore: 0.7,
          ExpansionPotentialScore: 0.8,
          TribalPressureScore: -0.5,
          MagicHazardScore: -0.6,
          DangerScore: -0.3,
          IsolationPenalty: -0.2,
        },
      },
    ],
    enclaveHistoryYears: [20, 40],
  },
  tribes: [
    {
      name: 'Foxfolk',
      description: 'Semi-nomadic forest-dwellers with stealthy scouts.',
      preferences: ['Woods and forage biomes', 'Pelts and honey resources', 'Low aggression, high stealth'],
      hostilityNote: 'Avoid direct confrontation; prefer evasion.',
    },
    {
      name: 'Roman Enclave',
      description: 'Disciplined territorial force establishing forts and villas.',
      preferences: ['Stone and marble rich regions', 'Rivers and strategic passes', 'Structured fort networks'],
      hostilityNote: 'Defends claimed passes aggressively.',
    },
    {
      name: 'Termite Collective',
      description: 'Eusocial superorganism building mega-mounds.',
      preferences: ['Hot, wood-rich biomes', 'Tunnel networks and mound clusters'],
      hostilityNote: 'High hostility to construction near their territory.',
    },
  ],
  settlementAlgorithm: {
    description:
      'Site selection balances resources, terrain, infrastructure potential, and risks from tribes, magic, and isolation. Weights shift per founding wave.',
    formula: [
      'FOUNDING_SCORE = + EarlyResourceScore * W_EARLY + MidgameResourceScore * W_MID + TerrainSuitabilityScore * W_TERRAIN',
      '+ WaterAccessScore * W_WATER + ElevationScore * W_ELEVATION + RoadPotentialScore * W_ROAD + ExpansionPotentialScore * W_EXPANSION',
      '- TribalPressureScore * W_TRIBAL - MagicHazardScore * W_MAGIC - DangerScore * W_DANGER - IsolationPenalty * W_ISOLATION',
    ],
  },
  goodsCategories: [
    {
      name: 'Category A — Medieval/Organic',
      summary: 'Wood, Grain, Pelts and related early-economy staples.',
      goods: ['Wood', 'Grain', 'Pelts', 'Honey', 'Stockfish'],
    },
    {
      name: 'Category B — Stone/Metals/Minerals',
      summary: 'Heavy inputs for construction and industrial chains.',
      goods: ['Brick', 'RawMetal', 'Marble', 'Coal', 'Steel'],
    },
    {
      name: 'Category C — Agricultural/Colonial',
      summary: 'Crops and plantation goods enabling trade booms.',
      goods: ['Tea', 'Coffee', 'Cocoa', 'Tobacco', 'Sugar'],
    },
    {
      name: 'Category D — Industrial Goods',
      summary: 'Factories, machinery, and processed products.',
      goods: ['Machinery', 'PlasticGoods', 'Electronics', 'CarbonFiber', 'Fuel'],
    },
    {
      name: 'Category E — Gases & Extractives',
      summary: 'Volatile or cryogenic resources and fuels.',
      goods: ['Hydrogen', 'Oxygen', 'Helium', 'Nitrogen', 'Oil'],
    },
    {
      name: 'Category F — Magical Goods',
      summary: 'Arcane reagents powering spellcraft economies.',
      goods: ['Aetherium', 'Dragonite', 'ManaSlime', 'AetherResidue', 'Glimbrite'],
    },
    {
      name: 'Category G — Exotic Crystals & Arcane Compounds',
      summary: 'Late-game arcana and interplanar materials.',
      goods: ['Gravitanium', 'Chronotite', 'Novacite', 'Zephyrium', 'Nexalite'],
    },
  ],
  history: {
    summary:
      'Post-founding simulation runs 20–40 in-world years modeling population, trade networks, wars, tribal raids, anomalies, and failed hamlets.',
    outcomes: [
      'Generates faction personalities and plausible trade needs.',
      'Produces merged or abandoned settlements and political tensions.',
      'Feeds a system-owned Genesis Chain covering NPC-only history.',
    ],
    genesisNotes: [
      'Genesis Chain stores weekly NPC blocks and event logs.',
      'Player PBCs start with a reference to the final Genesis hash.',
    ],
  },
  apiContracts: [
    {
      title: 'Ledger APIs',
      description: 'Surface block headers, submit blocks, and fetch event payloads for verification.',
      dtoExamples: [
        {
          name: 'EventHeaderDTO',
          fields: [
            'version: number',
            'eventType: number',
            'weekNumber: number',
            'minuteOfWeek: number',
            'playerIdShort: Hash128',
            'eventId: Hash128',
            'payloadCommitment: Hash128',
            'participants: Hash128[]',
            'chunkCoord?: { x: number; y: number }',
            'signature: string',
          ],
        },
        {
          name: 'BlockHeaderDTO',
          fields: [
            'version: number',
            'blockIndex: number',
            'playerIdShort: Hash128',
            'prevBlockHash: Hash128 | null',
            'eventsRoot: Hash128',
            'stateRoot: Hash128',
            'crossRefsRoot: Hash128',
            'chunkActivityRoot: Hash128',
            'centralCheckpointRef?: Hash128',
            'signature: string',
          ],
        },
        {
          name: 'CrossRefDTO',
          fields: [
            "otherPlayerIdShort: Hash128",
            'otherBlockHash: Hash128',
            'eventId: Hash128',
            "relationType: 'TRADE' | 'TREATY' | 'COMBAT' | 'SYNC'",
          ],
        },
      ],
      endpoints: [
        { method: 'GET', path: '/api/ledger/:playerId/latest-block', returns: 'BlockHeaderDTO' },
        { method: 'GET', path: '/api/ledger/:playerId/blocks?from=:start&to=:end', returns: 'BlockHeaderDTO[]' },
        { method: 'POST', path: '/api/ledger/:playerId/blocks', returns: '{ ok: boolean; centralCheckpointRef?: Hash128 }' },
        { method: 'POST', path: '/api/ledger/event-payloads', returns: '{ [eventId: string]: any }' },
      ],
    },
    {
      title: 'World APIs',
      description: 'Expose enclave summaries and settlement histories for the Angular UI.',
      dtoExamples: [
        {
          name: 'SettlementDTO',
          fields: [
            'id: string',
            'name: string',
            "type: 'CAPITAL' | 'TOWN' | 'HAMLET' | 'FORT' | 'MOUND' | 'ENCAMPMENT'",
            'coord: ChunkCoord & { cellX: number; cellY: number }',
            'foundingYear: number',
            'population: number',
            'tags: string[]',
            'primaryGoods: GoodsType[]',
            'dangerLevel: number',
          ],
        },
        {
          name: 'TribeDTO',
          fields: [
            'id: string',
            'name: string',
            "archetype: 'FOXFOLK' | 'ROMAN' | 'TERMITE' | 'CUSTOM'",
            'territoryChunks: ChunkCoord[]',
            'hostilityLevel: number',
            'notes: string[]',
          ],
        },
        {
          name: 'EnclaveSummaryDTO',
          fields: [
            'seed: string',
            'regionChunks: ChunkCoord[]',
            'settlements: SettlementDTO[]',
            'tribes: TribeDTO[]',
            'genesisBlockHash: Hash128',
          ],
        },
      ],
      endpoints: [
        { method: 'GET', path: '/api/world/enclave?seed=:seed', returns: 'EnclaveSummaryDTO' },
        { method: 'GET', path: '/api/world/settlements/:id/history', returns: '{ events: any[]; summary: string }' },
      ],
    },
  ],
  roadmap: [
    { label: 'Implement worldgen pipeline', done: true, details: 'Procedural enclave scaffolding is defined.' },
    { label: 'Settlement founding waves', done: true, details: 'Three-wave scoring rules established.' },
    { label: 'NPC tribe territories', done: true, details: 'Foxfolk, Roman, and Termite archetypes modeled.' },
    { label: 'GoodsType classification', done: true, details: 'Categories A–G mapped to sample goods.' },
    { label: 'Genesis history simulation', done: true, details: '20–40 year NPC-only ledger generation ready.' },
    { label: 'Implement PBC serialization', done: false, details: 'Need binary writers for block/event payloads.' },
    { label: 'Angular UI for world exploration', done: false, details: 'Expose maps, settlements, and ledger explorer.' },
    { label: 'Gameplay systems: trade, fleets, diplomacy', done: false, details: 'Connect chains to economic and combat actors.' },
    { label: 'Central checkpoint server logic', done: false, details: 'Provide verifier and checkpoint issuance.' },
    { label: 'Sandboxed mod layers', done: false, details: 'Enable custom tribes, anomalies, and resources.' },
  ],
};
