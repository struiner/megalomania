/**
 * GUILD MODEL – PLATONIC ARCHETYPES + WORLD INSTANCES
 * ----------------------------------------------------
 * - IdeaGuild: the cosmic / platonic archetype of a guild.
 * - GuildInstance: a concrete manifestation in a specific world/region.
 * - Fully enum + brand based, no stringly-typed nonsense.
 */

/** Utility to create branded string types */
type Brand<K, T> = K & { readonly __brand: T };

/** Core IDs (adjust to your project structure as needed) */
export type WorldId = Brand<string, "WorldId">;
export type RegionId = Brand<string, "RegionId">;
export type GuildInstanceId = Brand<string, "GuildInstanceId">;
export type NPCId = Brand<string, "NPCId">;
export type CompanyId = Brand<string, "CompanyId">;
export type PlayerId = Brand<string, "PlayerId">;
export type TownId = Brand<string, "TownId">;
export type BuildingId = Brand<string, "BuildingId">;
export type TradeRouteId = Brand<string, "TradeRouteId">;


/** Your original guild base enums (cleaned up) */


export enum GuildRank {
  Apprentice = "apprentice",
  Journeyman = "journeyman",
  Master = "master",
  GuildLeader = "guild_leader",
  GrandMaster = "grand_master",
}

export enum GuildRelation {
  Member = "member",
  Ally = "ally",
  Neutral = "neutral",
  Rival = "rival",
  Enemy = "enemy",
  Banned = "banned",
  Indentured = "indentured",
  Revered = "revered",
}

/** Personality bounded scale */
export enum PersonalityLevel {
  VeryLow = 1,
  Low = 2,
  Medium = 3,
  High = 4,
  VeryHigh = 5,
}

/** Archetypal / instance personality */
export interface GuildPersonality {
  aggression: PersonalityLevel;
  ambition: PersonalityLevel;
  conservatism: PersonalityLevel;
  greed: PersonalityLevel;
  secrecy: PersonalityLevel;
  honor: PersonalityLevel;
}

/** Generic environment descriptors (world-agnostic, extend as needed) */
export enum WealthLevel {
  Impoverished = "impoverished",
  Poor = "poor",
  Moderate = "moderate",
  Prosperous = "prosperous",
  Rich = "rich",
}

export enum MagicLevel {
  None = "none",
  Low = "low",
  Moderate = "moderate",
  High = "high",
  Wild = "wild",
}

export enum LawEnforcementLevel {
  Absent = "absent",
  Weak = "weak",
  Normal = "normal",
  Strict = "strict",
  Draconian = "draconian",
}

export enum StabilityLevel {
  Collapsing = "collapsing",
  Unstable = "unstable",
  Stable = "stable",
  Rigid = "rigid",
}

export enum DangerLevel {
  Safe = "safe",
  Tense = "tense",
  Dangerous = "dangerous",
  Lethal = "lethal",
}

/**
 * Snapshot of local environment / context for a guild instance.
 * This is what lets the same IdeaGuild manifest differently in different worlds.
 */
export interface RegionEnvironment {
  worldId: WorldId;
  regionId: RegionId;
  primaryTownId?: TownId;

  wealth: WealthLevel;
  magic: MagicLevel;
  law: LawEnforcementLevel;
  stability: StabilityLevel;
  danger: DangerLevel;

  populationEstimate: number;
  dominantIndustries: GoodsType[];
  majorReligionsPresent: boolean;
  hasFormalGuildCharters: boolean;
}

/** Objectives – what a guild tends to pursue. */
export enum GuildObjectiveType {
  ExpandInfluence = "expand_influence",
  SecureResource = "secure_resource",
  UndercutRivals = "undercut_rivals",
  ProtectMembers = "protect_members",
  RaiseFunds = "raise_funds",
  Sabotage = "sabotage",
  Recruit = "recruit",
  Research = "research",
}

/**
 * Discriminated union of objectives.
 * Extend freely with new variants as needed.
 */
export type GuildObjective =
  | {
      type: GuildObjectiveType.ExpandInfluence;
      targetRegion?: RegionId;
      targetTown?: TownId;
    }
  | {
      type: GuildObjectiveType.SecureResource;
      resource: GoodsType;
      minimumAmount: number;
    }
  | {
      type: GuildObjectiveType.UndercutRivals;
      rivalGuild: GuildType;
    }
  | {
      type: GuildObjectiveType.ProtectMembers;
      threatDescription?: string;
    }
  | {
      type: GuildObjectiveType.RaiseFunds;
      targetAmount: number;
    }
  | {
      type: GuildObjectiveType.Sabotage;
      targetGuild: GuildType;
      subtle: boolean;
    }
  | {
      type: GuildObjectiveType.Recruit;
      desiredRank: GuildRank;
      minimumInfluence: PersonalityLevel;
    }
  | {
      type: GuildObjectiveType.Research;
      topicId: string; // or branded type if you have one
    };

/** Members form the "hive-mind" that shapes the instance personality. */
export type ActorId = NPCId | CompanyId | PlayerId;

export interface GuildMember {
  id: ActorId;
  rank: GuildRank;
  influence: PersonalityLevel; // how much they pull the guild personality
  specialties?: GoodsType[];
}

/** Leadership structure for an instance */
export interface GuildLeadership {
  leaderId: ActorId | null;
  councilIds: ActorId[];
  electionCycleDays: number;
}

/** Resources controlled by a guild instance */
export interface GuildResources {
  treasury: number;
  stockpiles: Partial<Record<GoodsType, number>>;
  ownedBuildings: BuildingId[];
  tradeRoutes: TradeRouteId[];
}

/** Relations, strongly typed */
export type GuildRelationMap = Partial<Record<GuildType, GuildRelation>>;
export type TownRelationMap = Partial<Record<TownId, GuildRelation>>;
export type PlayerRelationMap = Partial<Record<PlayerId, GuildRelation>>;

export interface GuildRelations {
  guilds: GuildRelationMap;
  towns: TownRelationMap;
  players: PlayerRelationMap;
}

/** History of an instance – useful for flavour & AI */
export enum GuildHistoryEventType {
  Founded = "founded",
  LeadershipChange = "leadership_change",
  AllianceFormed = "alliance_formed",
  WarDeclared = "war_declared",
  Crisis = "crisis",
  GoldenAge = "golden_age",
}

export interface GuildHistoryEventBase {
  timestamp: number;
  description: string;
}

export type GuildHistoryEvent =
  | (GuildHistoryEventBase & {
      type: GuildHistoryEventType.Founded;
      founderId: ActorId | null;
    })
  | (GuildHistoryEventBase & {
      type: GuildHistoryEventType.LeadershipChange;
      oldLeaderId: ActorId | null;
      newLeaderId: ActorId | null;
    })
  | (GuildHistoryEventBase & {
      type: GuildHistoryEventType.AllianceFormed;
      otherGuild: GuildType;
    })
  | (GuildHistoryEventBase & {
      type: GuildHistoryEventType.WarDeclared;
      enemyGuild: GuildType;
    })
  | (GuildHistoryEventBase & {
      type: GuildHistoryEventType.Crisis;
      crisisKey: string;
    })
  | (GuildHistoryEventBase & {
      type: GuildHistoryEventType.GoldenAge;
      prosperityLevel: WealthLevel;
    });

/**
 * IDEA-GUILD (Platonic archetype)
 * - No relations, no members, no world.
 * - Just "what this kind of guild is" in the abstract.
 */
export interface IdeaGuild {
  id: GuildType;
  displayName: string;
  description: string;

  /** Baseline tendencies; instances will drift from this. */
  defaultPersonality: GuildPersonality;

  /** Which ranks make sense for this guild type. */
  allowedRanks: readonly GuildRank[];

  /** Common objective types this archetype is drawn to. */
  typicalObjectives: readonly GuildObjectiveType[];

  /** Optional: default privileges if the local world allows it. */
  baselinePrivileges?: readonly string[]; // or a typed privilege enum if you want
}

/** Registry of all platonic guild archetypes */
export type IdeaGuildRegistry = {
  [G in GuildType]: IdeaGuild;
};

/**
 * GUILD INSTANCE
 * - The "NPC made of NPCs" in a specific world/region.
 * - Has personality, members, leadership, resources, relations, etc.
 */
export interface GuildInstance {
  ideaId: GuildType;       // link back to its archetype
  instanceId: GuildInstanceId;

  worldId: WorldId;
  regionId: RegionId;

  /** Local, evolved personality (starting from idea.defaultPersonality). */
  personality: GuildPersonality;

  members: GuildMember[];
  leadership: GuildLeadership;
  relations: GuildRelations;
  objectives: GuildObjective[];
  resources: GuildResources;
  history: GuildHistoryEvent[];

  createdAt: number;
  lastUpdatedAt: number;
}

/** Registry of instances within a given world (or globally) */
export type GuildInstanceRegistry = Partial<Record<GuildInstanceId, GuildInstance>>;

/**
 * FACTORY FUNCTIONS
 * These are pure and world-agnostic; your GuildService can wrap them.
 */

/** Simple ID generator placeholder – replace with your real implementation. */
function createGuildInstanceId(raw: string): GuildInstanceId {
  return raw as GuildInstanceId;
}

/** Derive a starting personality from archetype and environment. */
export function deriveInitialPersonality(
  idea: IdeaGuild,
  env: RegionEnvironment
): GuildPersonality {
  // naive example; adjust logic as you like
  const base = idea.defaultPersonality;

  const aggressionShift =
    env.danger === DangerLevel.Lethal
      ? 1
      : env.danger === DangerLevel.Dangerous
      ? 0
      : -1;

  const secrecyShift =
    env.law === LawEnforcementLevel.Draconian
      ? 1
      : env.law === LawEnforcementLevel.Absent
      ? -1
      : 0;

  const clamp = (value: PersonalityLevel): PersonalityLevel =>
    Math.min(PersonalityLevel.VeryHigh, Math.max(PersonalityLevel.VeryLow, value));

  return {
    aggression: clamp((base.aggression + aggressionShift) as PersonalityLevel),
    ambition: base.ambition,
    conservatism: base.conservatism,
    greed: base.greed,
    secrecy: clamp((base.secrecy + secrecyShift) as PersonalityLevel),
    honor: base.honor,
  };
}

/** Create a new instance of a guild in a given world/region. */
export function createGuildInstance(
  idea: IdeaGuild,
  env: RegionEnvironment,
  now: number,
  seed: string
): GuildInstance {
  const instanceId = createGuildInstanceId(`${idea.id}:${env.worldId}:${env.regionId}:${seed}`);

  const personality = deriveInitialPersonality(idea, env);

  const initialHistory: GuildHistoryEvent[] = [
    {
      type: GuildHistoryEventType.Founded,
      timestamp: now,
      description: `Guild founded in region ${env.regionId}`,
      founderId: null,
    },
  ];

  const emptyRelations: GuildRelations = {
    guilds: {},
    towns: {},
    players: {},
  };

  const emptyResources: GuildResources = {
    treasury: 0,
    stockpiles: {},
    ownedBuildings: [],
    tradeRoutes: [],
  };

  const leadership: GuildLeadership = {
    leaderId: null,
    councilIds: [],
    electionCycleDays: 365,
  };

  return {
    ideaId: idea.id,
    instanceId,
    worldId: env.worldId,
    regionId: env.regionId,
    personality,
    members: [],
    leadership,
    relations: emptyRelations,
    objectives: [],
    resources: emptyResources,
    history: initialHistory,
    createdAt: now,
    lastUpdatedAt: now,
  };
}
