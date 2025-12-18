import { StructureType } from '../../enums/StructureType';
import { RoomHazardType } from '../../enums/RoomHazardType';
import { RoomBlueprint } from '../../models/room-blueprint.models';

export const CREW_QUARTERS_BLUEPRINT: RoomBlueprint = {
  id: 'crew_quarters',
  name: 'Crew Quarters',
  width: 24,
  height: 20,
  purpose: 'Habitation deck for the crew.',
  hazards: [RoomHazardType.Intrusion, RoomHazardType.Fire],
  features: ['Sleeping pods', 'Lockers', 'Emergency mask cache'],
  structureType: StructureType.Barracks,
  anchor: { x: 0, y: 0 },
  metadata: { deck: 'B' },
  version: 1,
};

export const DUPLICATE_HAZARD_BLUEPRINT: RoomBlueprint = {
  id: 'reactor_control',
  name: 'Reactor Control',
  width: 32,
  height: 24,
  purpose: 'Monitor and manage ship reactor output.',
  hazards: [RoomHazardType.Electrical, RoomHazardType.Fire, RoomHazardType.Fire],
  features: ['Control consoles', 'Reinforced shutters', 'Redundant cooling'],
  structureType: StructureType.Refinery,
  anchor: { x: 4, y: 4, z: 1 },
  version: 1,
};
