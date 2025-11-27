import { ID } from "./ID";
import { GoodsType } from "../enums/GoodsType";
import { MarketCondition, PriceModifier, MarketEvent } from "../enums/MarketCondition";

export interface MarketData {
  settlementId: ID;
  lastUpdated: Date;
  
  // Overall market health
  overallCondition: MarketCondition;
  marketSize: number; // 0-100, represents market capacity
  competitiveness: number; // 0-100
  
  // Goods data
  goodsPrices: GoodsPrice[];
  supplyDemand: SupplyDemandData[];
  
  // Market events and trends
  activeEvents: ActiveMarketEvent[];
  priceHistory: PriceHistoryEntry[];
  
  // Market participants
  majorTraders: MarketParticipant[];
  marketShare: MarketShare[];
  
  // Seasonal and cyclical data
  seasonalTrends: SeasonalTrend[];
  economicCycle: EconomicCycleData;
}

export interface GoodsPrice {
  goodsType: GoodsType;
  currentPrice: number;
  basePrice: number;
  priceModifier: PriceModifier;
  
  // Price factors
  supply: number; // 0-100
  demand: number; // 0-100
  quality: number; // 0-100
  
  // Price volatility
  volatility: number; // 0-100
  priceChange24h: number; // percentage change
  priceChange7d: number; // percentage change
  
  // Market depth
  buyOrders: number; // total quantity in buy orders
  sellOrders: number; // total quantity in sell orders
  
  lastTradePrice: number;
  lastTradeVolume: number;
  lastTradeTime: Date;
}

export interface SupplyDemandData {
  goodsType: GoodsType;
  
  // Supply factors
  localProduction: number;
  imports: number;
  stockpiles: number;
  
  // Demand factors
  localConsumption: number;
  exports: number;
  speculation: number;
  
  // Projections
  supplyForecast: ForecastData[];
  demandForecast: ForecastData[];
  
  // Critical levels
  shortageThreshold: number;
  surplusThreshold: number;
  currentStatus: 'shortage' | 'balanced' | 'surplus';
}

export interface ForecastData {
  period: 'week' | 'month' | 'season' | 'year';
  expectedValue: number;
  confidence: number; // 0-100
  factors: string[]; // factors affecting the forecast
}

export interface ActiveMarketEvent {
  event: MarketEvent;
  goodsAffected: GoodsType[];
  description: string;
  startDate: Date;
  endDate?: Date;
  
  // Impact on market
  priceImpact: number; // percentage change
  volumeImpact: number; // percentage change
  
  // Event details
  severity: 'minor' | 'moderate' | 'major' | 'catastrophic';
  source: 'local' | 'regional' | 'global';
  
  // Player involvement
  playerCanInfluence: boolean;
  influenceActions: string[];
}

export interface PriceHistoryEntry {
  date: Date;
  goodsType: GoodsType;
  price: number;
  volume: number;
  
  // Context
  marketCondition: MarketCondition;
  significantEvents: string[];
}

export interface MarketParticipant {
  participantId: ID; // Player, Company, or NPC ID
  participantType: 'player' | 'company' | 'npc' | 'guild';
  name: string;
  
  // Trading activity
  totalTradeVolume: number;
  averageTransactionSize: number;
  tradingFrequency: number; // trades per month
  
  // Specializations
  primaryGoods: GoodsType[];
  tradingStrategy: 'aggressive' | 'conservative' | 'opportunistic' | 'monopolistic';
  
  // Market influence
  marketInfluence: number; // 0-100
  priceInfluence: number; // ability to affect prices
  
  // Reputation and relationships
  tradingReputation: number; // 0-100
  preferredPartners: ID[];
  blacklistedPartners: ID[];
}

export interface MarketShare {
  goodsType: GoodsType;
  participantId: ID;
  sharePercentage: number; // 0-100
  trend: 'increasing' | 'stable' | 'decreasing';
  
  // Competitive position
  competitiveAdvantages: string[];
  threats: string[];
}

export interface SeasonalTrend {
  goodsType: GoodsType;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  
  // Typical seasonal changes
  priceMultiplier: number; // multiplier applied to base price
  demandMultiplier: number;
  supplyMultiplier: number;
  
  // Historical data
  historicalAverage: number;
  volatility: number;
  
  // Predictive factors
  weatherDependency: number; // 0-100
  culturalFactors: string[];
}

export interface EconomicCycleData {
  currentPhase: 'expansion' | 'peak' | 'contraction' | 'trough';
  cyclePosition: number; // 0-100, position within current cycle
  
  // Cycle characteristics
  averageCycleLength: number; // in months
  currentCycleAge: number; // in months
  
  // Economic indicators
  overallGrowthRate: number; // percentage
  inflationRate: number; // percentage
  unemploymentRate: number; // percentage
  
  // Predictions
  nextPhaseDate: Date;
  nextPhase: 'expansion' | 'peak' | 'contraction' | 'trough';
  confidence: number; // 0-100
}

export interface TradingOpportunity {
  id: ID;
  type: 'arbitrage' | 'seasonal' | 'event_driven' | 'speculation';
  
  // Opportunity details
  goodsType: GoodsType;
  buyLocation: ID; // Settlement ID
  sellLocation: ID; // Settlement ID
  
  // Financial projections
  buyPrice: number;
  sellPrice: number;
  expectedProfit: number;
  profitMargin: number; // percentage
  
  // Risk assessment
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  riskFactors: string[];
  
  // Timing
  windowStart: Date;
  windowEnd: Date;
  urgency: 'low' | 'medium' | 'high';
  
  // Requirements
  minimumCapital: number;
  requiredShipType?: string;
  requiredPermits: string[];
  
  // Competition
  competitorCount: number;
  difficultyLevel: number; // 0-100
}
