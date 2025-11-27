import { ID } from "../ID";

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
