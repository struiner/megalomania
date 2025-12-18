import { GoodsType } from "../enums/GoodsType";
import { GuildType } from "../enums/GuildType";
import { SettlementSpecialization } from "../enums/SettlementSpecialization";
import { StructureType } from "../enums/StructureType";

export type TechIdentifier = string;

export enum TechPrerequisiteRelation {
  Requires = "requires",
}

export interface TechPrerequisiteLink {
  node: TechIdentifier;
  relation: TechPrerequisiteRelation;
}

export interface TechGuildReputationEffect {
  guild: GuildType;
  delta: number;
}

export interface TechEffects {
  unlock_structures: StructureType[];
  unlock_goods: GoodsType[];
  grants_settlement_specialization?: SettlementSpecialization;
  guild_reputation?: TechGuildReputationEffect;
  research_rate_modifier?: number;
  metadata?: Record<string, unknown>;
}

export interface TechNode {
  id: TechIdentifier;
  title: string;
  summary: string;
  culture_tags: TechIdentifier[];
  prerequisites: TechPrerequisiteLink[];
  effects: TechEffects;
  metadata?: Record<string, unknown>;
}

export interface TechTreeOrdering {
  nodes: TechIdentifier[];
  prerequisites: Record<TechIdentifier, TechIdentifier[]>;
}

export interface TechTree {
  tech_tree_id: TechIdentifier;
  version: number;
  default_culture_tags: TechIdentifier[];
  nodes: TechNode[];
  ordering?: TechTreeOrdering;
  metadata?: Record<string, unknown>;
}
