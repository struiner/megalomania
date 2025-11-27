import { ID } from "../ID";
import { GoodsType } from "../../enums/GoodsType";

export interface Toll {
  location: { x: number; y: number };
  authority: ID; // Settlement or faction ID
  amount: number;
  goodsType?: GoodsType; // if toll is paid in goods
}
