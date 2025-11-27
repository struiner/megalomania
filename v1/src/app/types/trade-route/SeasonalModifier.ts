export interface SeasonalModifier {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  profitabilityModifier: number;
  dangerModifier: number;
  travelTimeModifier: number;
}
