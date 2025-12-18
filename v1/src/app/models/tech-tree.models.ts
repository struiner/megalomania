import { Biome } from '../enums/Biome';
import { FloraUseType } from '../enums/FloraUseType';
import { GoodsType } from '../enums/GoodsType';
import { GuildType } from '../enums/GuildType';
import { SettlementSpecialization } from '../enums/SettlementSpecialization';
import { SettlementType } from '../enums/SettlementType';
import { StructureEffect } from '../enums/StructureEffect';
import { StructureType } from '../enums/StructureType';

type SnakeCaseKey<T extends string> =
  T extends `${infer First}${infer Rest}`
    ? Rest extends Uncapitalize<Rest>
      ? `${Lowercase<First>}${SnakeCaseKey<Rest>}`
      : `${Lowercase<First>}_${SnakeCaseKey<Uncapitalize<Rest>>}`
    : Lowercase<T>;

type SnakeCaseIdentifier<T extends string> =
  string extends T
    ? T
    : T extends `${Lowercase<T>}`
      ? T extends `${string} ${string}` | `${string}-${string}` ? never : T
      : never;

type BiomeCultureTag = `biome_${SnakeCaseKey<keyof typeof Biome>}`;
type SettlementCultureTag = `settlement_${SnakeCaseKey<keyof typeof SettlementType>}`;
type GuildCultureTag = `guild_${SnakeCaseKey<keyof typeof GuildType>}`;

export type CultureTag = BiomeCultureTag | SettlementCultureTag | GuildCultureTag;

export type TechNodeId<T extends string = string> = SnakeCaseIdentifier<T>;
export type TechTreeId<T extends string = string> = SnakeCaseIdentifier<T>;

export type CultureTagNamespace = 'biome' | 'settlement' | 'guild';

// Snake_case, namespaced identifiers aligned to enum sources (e.g., biome_taiga).
export type CultureTagId = `${CultureTagNamespace}_${string}`;

export interface CultureTagBinding {
  id: CultureTagId;
  source: CultureTagNamespace;
  sourceValue: Biome | SettlementType | GuildType;
  note?: string;
}

export const TECH_PREREQUISITE_RELATIONS = ['requires'] as const;
export type TechPrerequisiteRelation = (typeof TECH_PREREQUISITE_RELATIONS)[number];

export interface TechNodePrerequisite {
  node: TechNodeId;
  relation: TechPrerequisiteRelation;
  note?: string;
}

export interface TechNodeEffects {
  unlock_structures?: StructureType[];
  unlock_structure_effects?: StructureEffect[];
  unlock_goods?: GoodsType[];
  unlock_settlements?: SettlementType[];
  unlock_guilds?: GuildType[];
  flora_unlocks?: FloraUseType[];
  grants_settlement_specialization?: SettlementSpecialization;
  research_rate_modifier?: number;
  guild_reputation?: Array<{
    guild: GuildType;
    delta: number;
  }>;
  metadata?: Record<string, unknown>;
}

export interface TechNodeMetadata {
  culture_overlays?: Array<{
    tag: CultureTagId;
    glyph?: string;
    position?: 'subscript' | 'superscript';
    note?: string;
  }>;
  custom?: Record<string, unknown>;
}

export interface TechNode {
  id: TechNodeId;
  title: string;
  summary: string;
  tier?: number;
  category?: string;
  culture_tags: CultureTagId[];
  prerequisites: TechNodePrerequisite[];
  effects?: TechNodeEffects;
  metadata?: TechNodeMetadata;
}

export interface TechTreeOrdering {
  nodes: TechNodeId[];
  prerequisites: Record<TechNodeId, TechNodeId[]>;
}

export interface TechTreeMetadata {
  last_migration_applied?: number;
  source_label?: string;
  custom?: Record<string, unknown>;
}

export interface TechTree {
  tech_tree_id: TechTreeId;
  version: number;
  default_culture_tags: CultureTagId[];
  nodes: TechNode[];
  ordering?: TechTreeOrdering;
  metadata?: TechTreeMetadata;
}

export interface TechResearchPointer {
  techTreeId: TechTreeId;
  techTreeVersion: number;
  nodeId: TechNodeId;
  cultureTags?: CultureTagId[];
}

export type IssueSeverity = 'warning' | 'error';

export interface TechTreeValidationIssue {
  path: string;
  message: string;
  severity: IssueSeverity;
}

export interface TechTreeImportResult {
  tree: TechTree;
  issues: TechTreeValidationIssue[];
  normalizedFrom?: unknown;
}

export interface TechTreeExportResult {
  json: string;
  issues: TechTreeValidationIssue[];
  orderedTree: TechTree;
}
