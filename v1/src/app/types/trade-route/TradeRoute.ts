import { ID } from "../ID";
import { TradeRouteStatus } from "../../enums/TradeRouteStatus";
import { GoodsType } from "../../enums/GoodsType";
import { SeasonalModifier } from "./SeasonalModifier";
import { Toll } from "./Toll";
import { RouteEvent } from "./RouteEvent";
import { WeatherCondition } from "./WeatherCondition";

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
  waypoints: { x: number; y: number }[];
  routeType: 'land' | 'sea' | 'mixed';
  primaryGoods: GoodsType[];
  seasonalModifiers: SeasonalModifier[];
  establishedDate: Date;
  lastUsed: Date;
  totalProfit: number;
  timesUsed: number;
  minimumShipType?: string;
  requiredPermits: string[];
  tolls: Toll[];
  currentEvents: RouteEvent[];
  weatherConditions?: WeatherCondition;
}
