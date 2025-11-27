import { ID } from "../ID";
import { ReputationLevel, SocialStatus } from "../../enums/ReputationType";
import { SpecificReputation } from "./SpecificReputation";
import { Title } from "./Title";
import { RegionalReputation } from "./RegionalReputation";
import { ReputationEvent } from "./ReputationEvent";

export interface Reputation {
  entityId: ID;
  overallLevel: ReputationLevel;
  overallScore: number;
  reputations: SpecificReputation[];
  socialStatus: SocialStatus;
  titles: Title[];
  regionalReputations: RegionalReputation[];
  recentEvents: ReputationEvent[];
}
