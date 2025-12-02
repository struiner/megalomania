export interface VisionSection {
  title: string;
  description: string;
  bulletPoints: string[];
}

export interface LedgerSection {
  overview: string;
  validationModel: string[];
  checkpoints: string[];
  merkleRules: MerkleRule;
  eventHeader: LedgerField[];
  blockHeader: LedgerField[];
}

export interface MerkleRule {
  leafRule: string;
  nodeRule: string;
  oddItemRule: string;
}

export interface LedgerField {
  label: string;
  description: string;
}

export interface WorldGenerationSection {
  regionDescription: string;
  pipelineSteps: string[];
  settlementWaves: SettlementWave[];
  enclaveHistoryYears: [number, number];
}

export interface SettlementWave {
  name: string;
  focus: string;
  weights: Record<string, number>;
}

export interface TribeArchetype {
  name: string;
  description: string;
  preferences: string[];
  hostilityNote: string;
}

export interface GoodsCategoryDefinition {
  name: string;
  summary: string;
  goods: string[];
}

export interface HistorySection {
  summary: string;
  outcomes: string[];
  genesisNotes: string[];
}

export interface ApiContractSection {
  title: string;
  description: string;
  dtoExamples: ApiDto[];
  endpoints: ApiEndpoint[];
}

export interface ApiDto {
  name: string;
  fields: string[];
}

export interface ApiEndpoint {
  method: string;
  path: string;
  returns: string;
}

export interface RoadmapItem {
  label: string;
  done: boolean;
  details: string;
}

export interface DesignDocument {
  vision: VisionSection;
  ledger: LedgerSection;
  worldgen: WorldGenerationSection;
  tribes: TribeArchetype[];
  settlementAlgorithm: SettlementAlgorithm;
  goodsCategories: GoodsCategoryDefinition[];
  history: HistorySection;
  apiContracts: ApiContractSection[];
  roadmap: RoadmapItem[];
}

export interface SettlementAlgorithm {
  formula: string[];
  description: string;
}
