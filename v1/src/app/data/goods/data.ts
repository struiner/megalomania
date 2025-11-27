import { GoodsType } from "../../enums/GoodsType";


export interface GoodsInfo {
 type: GoodsType,
  title: string;
  rarity: number;        // 1–5
  complexity: number;    // 1–5
  basePrice: number;
  components?: GoodComponent[];
}
export interface GoodComponent {
  type: GoodsType;
  amount: number;
}

export const GOODS_DATA: GoodsInfo[] = [
  {
    type: GoodsType.Wood,
    title: "Wood",
    rarity: 1,
    complexity: 1,
    basePrice: 10,
  },
  {
    type: GoodsType.Iron,
    title: "Iron",
    rarity: 2,
    complexity: 2,
    basePrice: 25,
  },
  {
    type: GoodsType.Cloth,
    title: "Cloth",
    rarity: 2,
    complexity: 3,
    basePrice: 30,
  },
  {
    type: GoodsType.Beer,
    title: "Beer",
    rarity: 3,
    complexity: 3,
    basePrice: 40,
    components: [{type: GoodsType.Grain, amount:6}]
  },
  {
    type: GoodsType.MetalGoods,
    title: "Tools",
    rarity: 4,
    complexity: 4,
    basePrice: 100,
    components: [{type: GoodsType.Wood, amount:8}, {type: GoodsType.Grain, amount:4}]
  }
];
