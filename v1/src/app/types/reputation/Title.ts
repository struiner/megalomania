import { ID } from "../ID";
import { TitleBenefit } from "./TitleBenefit";

export interface Title {
  name: string;
  description: string;
  grantedBy: ID;
  grantedDate: Date;
  benefits: TitleBenefit[];
  requirements: string[];
}
