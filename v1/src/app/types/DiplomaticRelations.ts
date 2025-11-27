import { ID } from "./ID";
import { DiplomaticRelation, DiplomaticAction } from "../enums/DiplomaticRelation";

export interface DiplomaticState {
  entityId: ID; // Settlement, Guild, or Player ID
  relations: EntityRelation[];
  activeNegotiations: Negotiation[];
  diplomaticHistory: DiplomaticEvent[];
  
  // Diplomatic capabilities
  diplomaticPower: number; // 0-100
  availableActions: DiplomaticAction[];
  
  // Treaties and agreements
  activeTreaties: Treaty[];
  tradeAgreements: TradeAgreement[];
}

export interface EntityRelation {
  targetEntityId: ID;
  relation: DiplomaticRelation;
  relationScore: number; // -100 to 100
  lastChanged: Date;
  
  // Factors affecting the relationship
  factors: RelationFactor[];
  
  // Ongoing effects
  activeEffects: DiplomaticEffect[];
}

export interface RelationFactor {
  type: 'trade_volume' | 'military_action' | 'gift' | 'insult' | 'treaty_violation' | 'mutual_enemy';
  description: string;
  impact: number; // positive or negative
  date: Date;
  decayRate: number; // how quickly this factor loses importance
}

export interface DiplomaticEvent {
  action: DiplomaticAction;
  initiatorId: ID;
  targetId: ID;
  date: Date;
  description: string;
  outcome: 'success' | 'failure' | 'partial';
  consequences: DiplomaticConsequence[];
}

export interface DiplomaticConsequence {
  type: 'relation_change' | 'trade_impact' | 'military_consequence' | 'economic_effect';
  description: string;
  value: number;
  duration: number; // in days, -1 for permanent
}

export interface Negotiation {
  id: ID;
  type: 'peace_treaty' | 'trade_agreement' | 'alliance' | 'tribute' | 'territorial_dispute';
  participants: ID[];
  initiatorId: ID;
  
  startDate: Date;
  deadline?: Date;
  
  // Negotiation terms
  proposedTerms: NegotiationTerm[];
  acceptedTerms: NegotiationTerm[];
  rejectedTerms: NegotiationTerm[];
  
  status: 'ongoing' | 'successful' | 'failed' | 'suspended';
  
  // Progress tracking
  rounds: NegotiationRound[];
  currentRound: number;
}

export interface NegotiationTerm {
  id: ID;
  type: 'monetary_payment' | 'goods_transfer' | 'territorial_concession' | 'trade_rights' | 'military_support';
  description: string;
  proposedBy: ID;
  value: number;
  conditions: string[];
  
  // Voting/acceptance status
  votes: { entityId: ID; vote: 'accept' | 'reject' | 'abstain' }[];
}

export interface NegotiationRound {
  roundNumber: number;
  date: Date;
  actions: NegotiationAction[];
  outcome: string;
}

export interface NegotiationAction {
  actorId: ID;
  action: 'propose_term' | 'accept_term' | 'reject_term' | 'modify_term' | 'make_threat' | 'offer_incentive';
  details: string;
  impact: number; // effect on negotiation success
}

export interface Treaty {
  id: ID;
  name: string;
  type: 'peace' | 'alliance' | 'non_aggression' | 'mutual_defense' | 'trade';
  signatories: ID[];
  
  signedDate: Date;
  expirationDate?: Date;
  
  terms: TreatyTerm[];
  violations: TreatyViolation[];
  
  status: 'active' | 'expired' | 'violated' | 'suspended';
}

export interface TreatyTerm {
  description: string;
  type: 'obligation' | 'restriction' | 'benefit' | 'condition';
  affectedParties: ID[];
  consequences: string[];
}

export interface TreatyViolation {
  violatorId: ID;
  violatedTerm: string;
  date: Date;
  severity: 'minor' | 'major' | 'severe';
  consequences: DiplomaticConsequence[];
}

export interface TradeAgreement {
  id: ID;
  name: string;
  parties: ID[];
  
  // Agreement terms
  preferredGoods: string[];
  tariffReductions: { goodsType: string; reduction: number }[];
  exclusiveRights: string[];
  
  // Economic terms
  minimumTradeVolume?: number;
  maximumTradeVolume?: number;
  priceGuarantees: { goodsType: string; minPrice: number; maxPrice: number }[];
  
  // Duration and renewal
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  
  // Performance tracking
  currentTradeVolume: number;
  totalProfit: number;
  violations: TradeViolation[];
}

export interface TradeViolation {
  violatorId: ID;
  type: 'price_violation' | 'volume_violation' | 'quality_violation' | 'exclusivity_violation';
  description: string;
  date: Date;
  penalty: number;
}

export interface DiplomaticEffect {
  type: 'trade_bonus' | 'trade_penalty' | 'military_support' | 'information_sharing' | 'access_restriction';
  description: string;
  value: number;
  duration: number; // in days, -1 for permanent
  startDate: Date;
}
