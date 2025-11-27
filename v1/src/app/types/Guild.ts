import { ID } from "./ID";
import { GuildType, GuildRank, GuildRelation } from "../enums/GuildType";
import { GoodsType } from "../enums/GoodsType";

export interface Guild {
  id: ID;
  name: string;
  type: GuildType;
  headquartersSettlementId: ID;
  
  // Leadership
  guildMaster: ID; // FamilyMember ID
  council: ID[]; // FamilyMember IDs
  
  // Membership
  members: GuildMembership[];
  maxMembers: number;
  
  // Resources and influence
  treasury: number;
  influence: number; // 0-100
  reputation: number; // -100 to 100
  
  // Guild specializations
  specializations: GoodsType[];
  monopolies: GoodsType[]; // goods this guild has monopoly over
  
  // Relations
  alliedGuilds: ID[];
  rivalGuilds: ID[];
  
  // Guild properties
  guildHalls: ID[]; // Structure IDs
  workshops: ID[]; // Structure IDs
  
  // Rules and policies
  membershipFee: number;
  monthlyDues: number;
  tradingRights: TradingRight[];
  
  // Events and activities
  upcomingEvents: GuildEvent[];
  recentActivities: GuildActivity[];
}

export interface GuildMembership {
  memberId: ID; // FamilyMember ID
  rank: GuildRank;
  joinDate: Date;
  contributions: number; // total contributions to guild
  standing: number; // -100 to 100, member's standing within guild
  specializations: GoodsType[];
}

export interface TradingRight {
  goodsType: GoodsType;
  exclusiveToMembers: boolean;
  taxRate: number; // percentage
  qualityStandards: string[];
}

export interface GuildEvent {
  type: 'meeting' | 'festival' | 'competition' | 'ceremony' | 'negotiation';
  name: string;
  description: string;
  date: Date;
  location: ID; // Settlement ID
  participants: ID[]; // Member IDs
  rewards?: GuildReward[];
}

export interface GuildActivity {
  type: 'trade_mission' | 'political_action' | 'member_promotion' | 'conflict_resolution';
  description: string;
  date: Date;
  participants: ID[];
  outcome: string;
  impact: {
    treasury?: number;
    influence?: number;
    reputation?: number;
  };
}

export interface GuildReward {
  type: 'money' | 'goods' | 'reputation' | 'rank_promotion' | 'trading_rights';
  value: number;
  description: string;
}
