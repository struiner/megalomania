import { ID } from "../ID";

export interface Hanse {
  alderman?: ID;
  councilMembers: ID[];
  comittees: Hanse[];
}
