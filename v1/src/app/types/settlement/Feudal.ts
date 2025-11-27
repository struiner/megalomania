import { ID } from "../ID";

export interface Feudal {
  leader: ID;
  subjects: Feudal | ID[];
}
