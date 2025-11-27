
import { ID } from "../types/ID";
import { PlayerState } from "../types/PlayerState";
import { Settlement } from "../types/settlement/Settlement";

export interface GameStateData {
    id: ID;
    chunk:ID;
    settlements: Settlement[];
    units: UnitData[];
    players: PlayerState[];
  }
  
export interface UnitData {
    id: ID;
    type: 'fleet' | 'convoy' | 'explorer' | 'army' | 'other';
    x: number;
    y: number;
    owner: ID;
    meta:any;
  }
  