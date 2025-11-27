import { ReputationType, ReputationLevel } from "../../enums/ReputationType";
import { NotableAct } from "./NotableAct";

export interface SpecificReputation {
  type: ReputationType;
  level: ReputationLevel;
  score: number;
  lastChanged: Date;
  notableActs: NotableAct[];
}
