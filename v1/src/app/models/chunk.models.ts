import { ID } from "../types/ID";
import { Inventory } from "../types/Inventory";

export interface CompressedCellData {
    e:number;
    m:number;
    t:number;
    b:string;
}
  export interface CellData {
    id?: ID;
    elevation: number;
    moisture: number;
    temperature: number;
    biome: string;
  
    tiles?: Tile[][][]; // [layer][tileY][tileX]
  
    features?: CellFeature[]; // dynamic feature definitions
  }
  export interface CellFeature {
    type: string; // 'road', 'river', 'rail'
    connections: Direction[]; // simplified
    data?: Record<string, any>; // optional metadata
  }
  export type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
  export interface Tile {
    sprite:string;
    inventory?:Inventory; //for chests
    linkedTileData?:Tile; //for doors
  }

  /** CHUNK = 512 × 512 cells */
  export interface ChunkData {
    cells: CellData[][];
    isSaved: boolean;               // for save-on-exit
  }
  