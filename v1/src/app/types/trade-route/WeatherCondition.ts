export interface WeatherCondition {
  type: 'calm' | 'stormy' | 'foggy' | 'windy' | 'frozen';
  severity: number; // 0-100
  impact: {
    travelTime: number;
    danger: number;
  };
}
