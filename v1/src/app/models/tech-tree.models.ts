import { Biome } from '../enums/Biome';
import { GuildType } from '../enums/GuildType';
import { SettlementType } from '../enums/SettlementType';
import { SettlementSpecialization } from '../enums/SettlementSpecialization';
import { StructureType } from '../enums/StructureType';
import { GoodsType } from '../enums/GoodsType';

export type TechTreeId = string;
export type TechNodeId = string;

export type CultureTagNamespace = 'biome' | 'settlement' | 'guild';

// Snake_case, namespaced identifiers aligned to enum sources (e.g., biome_taiga).
export type CultureTagId = `${CultureTagNamespace}_${string}`;

export interface CultureTagBinding {
  id: CultureTagId;
  source: CultureTagNamespace;
  sourceValue: Biome | SettlementType | GuildType;
  note?: string;
}

export interface TechNodePrerequisite {
  node: TechNodeId;
  relation: 'requires' | 'blocks' | 'excludes';
}

export interface TechNodeEffects {
  unlockStructures?: StructureType[];
  unlockGoods?: GoodsType[];
  grantsSettlementSpecialization?: SettlementSpecialization;
  guildReputation?: { guild: GuildType; delta: number };
  researchRateModifier?: number;
  customMetadata?: Record<string, unknown>;
}

export interface TechNode {
  id: TechNodeId;
  title: string;
  summary: string;
  cultureTags: CultureTagId[];
  prerequisites: TechNodePrerequisite[];
  effects: TechNodeEffects;
  metadata?: Record<string, unknown>;
}

export interface TechTreeOrdering {
  nodes: TechNodeId[];
  prerequisites: Record<TechNodeId, TechNodeId[]>;
}

export interface TechTree {
  techTreeId: TechTreeId;
  version: number;
  defaultCultureTags: CultureTagId[];
  nodes: TechNode[];
  ordering?: TechTreeOrdering;
}

export interface TechResearchPointer {
  techTreeId: TechTreeId;
  techTreeVersion?: number;
  nodeId: TechNodeId;
  cultureTags: CultureTagId[];
}
