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

export interface TechPrerequisite {
  node: TechNodeId;
  relation: 'requires';
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
}

export interface TechNode {
  id: TechNodeId;
  title: string;
  summary: string;
  culture_tags: CultureTag[];
  prerequisites: TechPrerequisite[];
  effects?: TechNodeEffects;
}

export interface TechTreeOrdering {
  nodes: TechNodeId[];
  prerequisites: Record<TechNodeId, TechNodeId[]>;
}

export interface TechTree {
  tech_tree_id: TechTreeId;
  version: number;
  default_culture_tags: CultureTag[];
  nodes: TechNode[];
  ordering: TechTreeOrdering;
}
