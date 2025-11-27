import { ID } from "./ID";
import { ReputationType, ReputationLevel, SocialStatus } from "../enums/ReputationType";

export interface Reputation {
  entityId: ID; // Player, Company, or Settlement ID
  
  // Overall reputation
  overallLevel: ReputationLevel;
  overallScore: number; // -100 to 100+
  
  // Specific reputation types
  reputations: SpecificReputation[];
  
  // Social standing
  socialStatus: SocialStatus;
  titles: Title[];
  
  // Regional variations
  regionalReputations: RegionalReputation[];
  
  // Recent events affecting reputation
  recentEvents: ReputationEvent[];
}

export interface SpecificReputation {
  type: ReputationType;
  level: ReputationLevel;
  score: number; // -100 to 100+
  lastChanged: Date;
  
  // Specific achievements or failures
  notableActs: NotableAct[];
}

export interface RegionalReputation {
  settlementId: ID;
  modifier: number; // -50 to +50, modifies base reputation
  reason: string;
  establishedDate: Date;
}

export interface ReputationEvent {
  type: 'achievement' | 'scandal' | 'heroic_act' | 'betrayal' | 'trade_success' | 'military_victory';
  description: string;
  date: Date;
  impact: {
    reputationType: ReputationType;
    scoreChange: number;
    affectedRegions?: ID[]; // Settlement IDs
  };
  witnesses: ID[]; // NPC IDs who witnessed the event
}

export interface NotableAct {
  description: string;
  date: Date;
  impact: number; // positive or negative
  witnesses: ID[];
  stillRemembered: boolean;
}

export interface Title {
  name: string;
  description: string;
  grantedBy: ID; // Settlement or Guild ID
  grantedDate: Date;
  benefits: TitleBenefit[];
  requirements: string[];
}

export interface TitleBenefit {
  type: 'trade_discount' | 'tax_reduction' | 'diplomatic_bonus' | 'access_rights' | 'income';
  value: number;
  description: string;
}
