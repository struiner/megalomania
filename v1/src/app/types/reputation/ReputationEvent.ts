import { ReputationType } from "../../enums/ReputationType";
import { ID } from "../ID";

export interface ReputationEvent {
  type: 'achievement' | 'scandal' | 'heroic_act' | 'betrayal' | 'trade_success' | 'military_victory';
  description: string;
  date: Date;
  impact: {
    reputationType: ReputationType;
    scoreChange: number;
    affectedRegions?: ID[];
  };
  witnesses: ID[];
}
