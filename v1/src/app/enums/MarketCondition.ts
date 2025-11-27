export enum MarketCondition {
  Booming = "booming",
  Stable = "stable",
  Declining = "declining",
  Volatile = "volatile",
  Crashed = "crashed",
  Recovering = "recovering",
  Seasonal = "seasonal",
  Manipulated = "manipulated"
}

export enum PriceModifier {
  VeryLow = "very_low",      // 0.5x base price
  Low = "low",               // 0.75x base price
  Normal = "normal",         // 1.0x base price
  High = "high",             // 1.25x base price
  VeryHigh = "very_high",    // 1.5x base price
  Extreme = "extreme"        // 2.0x+ base price
}

export enum MarketEvent {
  Shortage = "shortage",
  Surplus = "surplus",
  Embargo = "embargo",
  NewSupplier = "new_supplier",
  CompetitorArrival = "competitor_arrival",
  SeasonalDemand = "seasonal_demand",
  WarDemand = "war_demand",
  TradeFair = "trade_fair",
  Monopoly = "monopoly",
  PriceWar = "price_war"
}
