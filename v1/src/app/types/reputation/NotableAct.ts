import { ID } from "../ID";

export interface NotableAct {
  description: string;
  date: Date;
  impact: number;
  witnesses: ID[];
  stillRemembered: boolean;
}
