import { ID } from "./ID";
import { TradeRouteStatus } from "../enums/TradeRouteStatus";
import { GoodsType } from "../enums/GoodsType";

export interface TradeRoute {
  id: ID;
  name: string;
  fromSettlementId: ID;
  toSettlementId: ID;
  status: TradeRouteStatus;
  distance: number;
  travelTime: number; // in days
  dangerLevel: number; // 0-100
  profitability: number; // expected profit percentage
  
  // Route details
  waypoints: { x: number; y: number }[];
  routeType: 'land' | 'sea' | 'mixed';
  
  // Trade specifics
  primaryGoods: GoodsType[];
  seasonalModifiers: SeasonalModifier[];
  
  // Economic data
  establishedDate: Date;
  lastUsed: Date;
  totalProfit: number;
  timesUsed: number;
  
  // Conditions and requirements
  minimumShipType?: string;
  requiredPermits: string[];
  tolls: Toll[];
  
  // Dynamic factors
  currentEvents: RouteEvent[];
  weatherConditions?: WeatherCondition;
}

export interface SeasonalModifier {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  profitabilityModifier: number;
  dangerModifier: number;
  travelTimeModifier: number;
}

export interface Toll {
  location: { x: number; y: number };
  authority: ID; // Settlement or faction ID
  amount: number;
  goodsType?: GoodsType; // if toll is paid in goods
}

export interface RouteEvent {
  type: 'piracy' | 'war' | 'embargo' | 'festival' | 'disaster' | 'opportunity';
  description: string;
  impact: {
    profitability?: number;
    danger?: number;
    travelTime?: number;
  };
  duration: number; // in days
  startDate: Date;
}

export interface WeatherCondition {
  type: 'calm' | 'stormy' | 'foggy' | 'windy' | 'frozen';
  severity: number; // 0-100
  impact: {
    travelTime: number;
    danger: number;
  };
}
