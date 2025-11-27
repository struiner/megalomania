import { ID } from "../ID";
import { SettlementType } from "../../enums/SettlementType";
import { Estate } from "../Estate";
import { FamilyMember } from "../FamilyMember";
import { Inventory } from "../Inventory";
import { Market } from "../Market";
import { Position } from "../Position";
import { Structure } from "../Structure";
import { Population } from "./Population";
import { Feudal } from "./Feudal";
import { Hanse } from "./Hanse";
import { Tribal } from "./Tribal";
import { SettlementSpecialization } from "../../enums/SettlementSpecialization";

export interface Settlement {
  id: ID;
  name: string;
  type: SettlementType;
  location: Position;
  estates: Estate[];
  structures?: Structure[];
  population: Population;
  npcs?: FamilyMember[];
  market: Market;
  inventory: Inventory;
  x: number;
  y: number;
  specializations: SettlementSpecialization[];
  rule: Feudal | Hanse | Tribal;
}
