import { HazardType } from '../enums/HazardType';

export interface RoomBlueprint {
  name: string;
  width: number;
  height: number;
  purpose: string;
  hazards: HazardType[];
  features?: string;
}
