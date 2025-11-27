import { ID } from "../ID";

export interface RegionalReputation {
  settlementId: ID;
  modifier: number;
  reason: string;
  establishedDate: Date;
}
