import { GoodsType } from '../enums/GoodsType';
import {
  AngularIntegrationGuide,
  ChunkCoord,
  EnclaveSummaryDTO,
  GenesisChainSummary,
  GoodsClassificationCategory,
  HistoricalSimulationSlice,
  PerPlayerBlockchainSpec,
  SettlementDTO,
  SettlementFoundingAlgorithm,
  SettlementFoundingWave,
  SettlementKind,
  TradeEventPayload,
  TribeArchetype,
  TribeDTO,
} from './anna-readme.models';

export interface WorldGenerationPipeline {
  terrainAndResources: string[];
  enclaveSize: { chunks: number; cellsPerChunk: number };
  settlementWaves: SettlementFoundingWave[];
  tribeArchetypes: TribeArchetype[];
  historySpanYears: [number, number];
}

export interface GoodsClassification {
  categories: GoodsClassificationCategory[];
  drivers: string[];
}

export interface LedgerArchitecture {
  perPlayerChain: PerPlayerBlockchainSpec;
  genesisChain: GenesisChainSummary;
}

export interface WorldIntegrationSnapshot {
  ledger: LedgerArchitecture;
  worldGeneration: WorldGenerationPipeline;
  settlementAlgorithm: SettlementFoundingAlgorithm;
  tribes: TribeDTO[];
  goods: GoodsClassification;
  history: HistoricalSimulationSlice;
  apiContracts: {
    enclaveSummary: EnclaveSummaryDTO;
    tradeExample: TradeEventPayload;
  };
  angular: AngularIntegrationGuide;
}

export interface SettlementGoodsProfile {
  settlement: SettlementDTO;
  exported: GoodsType[];
  imported: GoodsType[];
}

// Re-export DTOs to provide a single world-facing model entrypoint.
export type {
  ChunkCoord,
  SettlementDTO,
  SettlementKind,
  TribeDTO,
  TribeArchetype,
  EnclaveSummaryDTO,
  TradeEventPayload,
};
