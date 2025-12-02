import { GoodsType } from '../enums/GoodsType';

export type Hash128 = string; // 16-byte hex
export type PlayerID = string; // full identifier (public key hash)

export interface ChunkCoord {
  x: number;
  y: number;
}

export interface EventHeaderDTO {
  version: number; // uint8
  eventType: number; // uint8 enum
  weekNumber: number; // uint32
  minuteOfWeek: number; // uint16
  playerIdShort: Hash128; // 16-byte hex
  eventId: Hash128; // 16-byte hex
  payloadCommitment: Hash128; // 16-byte hex
  participants: Hash128[]; // other player short IDs
  chunkCoord?: ChunkCoord;
  signature: string; // ed25519 signature hex
}

export interface BlockHeaderDTO {
  version: number; // uint8
  blockIndex: number; // week
  playerIdShort: Hash128;
  prevBlockHash: Hash128 | null;
  eventsRoot: Hash128;
  stateRoot: Hash128;
  crossRefsRoot: Hash128;
  chunkActivityRoot: Hash128;
  centralCheckpointRef?: Hash128;
  signature: string;
}

export type CrossRelationType = 'TRADE' | 'TREATY' | 'COMBAT' | 'SYNC';

export interface CrossRefDTO {
  otherPlayerIdShort: Hash128;
  otherBlockHash: Hash128;
  eventId: Hash128;
  relationType: CrossRelationType;
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

export type SettlementKind = 'CAPITAL' | 'TOWN' | 'HAMLET' | 'FORT' | 'MOUND' | 'ENCAMPMENT';

export interface SettlementDTO {
  id: string;
  name: string;
  factionId: string;
  type: SettlementKind;
  coord: ChunkCoord & { cellX: number; cellY: number };
  foundingYear: number;
  population: number;
  tags: string[];
  primaryGoods: GoodsType[];
  dangerLevel: number; // 0–1 normalized
}

export type TribeArchetype = 'FOXFOLK' | 'ROMAN' | 'TERMITE' | 'CUSTOM';

export interface TribeDTO {
  id: string;
  name: string;
  archetype: TribeArchetype;
  territoryChunks: ChunkCoord[];
  hostilityLevel: number; // 0–1
  notes: string[];
}

export interface EnclaveSummaryDTO {
  seed: string;
  regionChunks: ChunkCoord[];
  settlements: SettlementDTO[];
  tribes: TribeDTO[];
  genesisBlockHash: Hash128;
}

export interface LedgerEndpoint {
  method: 'GET' | 'POST';
  path: string;
  returns: string;
}

export interface WorldEndpoint {
  method: 'GET';
  path: string;
  returns: string;
}

export interface LedgerApiSchema {
  dtos: [EventHeaderDTO, BlockHeaderDTO, CrossRefDTO];
  endpoints: LedgerEndpoint[];
}

export interface WorldApiSchema {
  dtos: [SettlementDTO, TribeDTO, EnclaveSummaryDTO];
  endpoints: WorldEndpoint[];
}

export interface MerkleConstructionRule {
  leafRule: string;
  nodeRule: string;
  oddItemRule: string;
}

export interface PerPlayerBlockchainSpec {
  weeklyBlock: boolean;
  minuteResolutionEvents: boolean;
  stateCommitments: string[];
  crossValidationTriggers: string[];
  optionalCheckpoint: boolean;
  merkleRules: MerkleConstructionRule;
}

export interface FoundingScoreWeights {
  EarlyResourceScore: number;
  MidgameResourceScore: number;
  TerrainSuitabilityScore: number;
  WaterAccessScore: number;
  ElevationScore: number;
  RoadPotentialScore: number;
  ExpansionPotentialScore: number;
  TribalPressureScore: number;
  MagicHazardScore: number;
  DangerScore: number;
  IsolationPenalty: number;
}

export interface SettlementFoundingWave {
  name: string;
  focus: string;
  weights: FoundingScoreWeights;
}

export interface SettlementFoundingAlgorithm {
  formula: string;
  waves: SettlementFoundingWave[];
}

export interface TribeArchetypeDefinition {
  name: string;
  behavior: string;
  preferences: string[];
  hostility: string;
}

export interface GoodsClassificationCategory {
  label: string;
  description: string;
  goods: GoodsType[];
}

export interface HistoricalSimulationSlice {
  durationYears: [number, number];
  events: string[];
  outputs: string[];
}

export interface GenesisChainSummary {
  description: string;
  contents: string[];
  playerBootstrap: string;
}

export interface AngularIntegrationGuide {
  suggestedFolders: string[];
  services: string[];
  uiConcepts: string[];
}

export interface RoadmapEntry {
  label: string;
  completed: boolean;
  notes?: string;
}

export interface AnnaDesignSpec {
  vision: string;
  blockchain: PerPlayerBlockchainSpec;
  worldGeneration: {
    chunkSize: number;
    enclaveArea: number;
    pipeline: string[];
    settlementAlgorithm: SettlementFoundingAlgorithm;
    tribes: TribeArchetypeDefinition[];
    goods: GoodsClassificationCategory[];
    history: HistoricalSimulationSlice;
    genesis: GenesisChainSummary;
  };
  apiSchemas: {
    ledger: LedgerApiSchema;
    world: WorldApiSchema;
    tradePayload: TradeEventPayload;
  };
  angularIntegration: AngularIntegrationGuide;
  roadmap: RoadmapEntry[];
}

export const MERKLE_RULES: MerkleConstructionRule = {
  leafRule: 'leaf  = H(0x00 || treeTag || leafBytes)',
  nodeRule: 'node  = H(0x01 || treeTag || leftHash || rightHash)',
  oddItemRule: 'Odd-item rule: last hash propagates upward unchanged.',
};
