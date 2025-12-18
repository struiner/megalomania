import dayjs from 'dayjs';
import { HazardType } from '../enums/HazardType';
import { StructureType } from '../enums/StructureType';
import { RoomLedgerEvent } from '../models/ledger.models';
import { RoomBlueprintReference } from '../models/room-blueprint.models';
import { RoomLedgerService } from '../services/room-ledger.service';

const roomLedgerService = new RoomLedgerService();

const storageBlueprintV1: RoomBlueprintReference = {
  identity: {
    blueprintId: 'storage_room_small',
    revision: 1,
    blueprintHash: 'storage_room_small_hash_v1',
  },
  structureType: StructureType.Warehouse,
  footprint: { width: 4, height: 6 },
  hazards: [HazardType.FIRE, HazardType.FLOOD],
  purpose: 'storage',
  tags: ['draft_v1'],
};

const storageBlueprintV2: RoomBlueprintReference = {
  ...storageBlueprintV1,
  identity: {
    blueprintId: 'storage_room_small',
    revision: 2,
    blueprintHash: 'storage_room_small_hash_v2',
  },
  hazards: [HazardType.ELECTRICAL, HazardType.FIRE, HazardType.FLOOD],
  tags: ['ready_for_export'],
};

export const roomLedgerFixtures: RoomLedgerEvent[] = [
  roomLedgerService.createBlueprintCreatedEvent({
    blueprint: storageBlueprintV1,
    initiatedBy: 'player_shipwrights_guild',
    timestamp: dayjs('1880-01-04T12:02:10Z'),
    source: 'player',
    creationNotes: 'Initial storage room captured from room creator stub.',
    validation: {
      validators: ['player_harbor_master'],
      expectedHazards: [HazardType.FIRE, HazardType.FLOOD],
      validationNotes: 'Hazard ordering and presence expected to be validated by SDK.',
    },
  }),
  roomLedgerService.createBlueprintUpdatedEvent({
    blueprint: storageBlueprintV2,
    initiatedBy: 'player_shipwrights_guild',
    timestamp: dayjs('1880-01-05T08:22:00Z'),
    previousRevisionHash: 'storage_room_small_hash_v1',
    changeSummary: 'Added electrical hazard signage and export readiness tags.',
    validation: {
      validationNotes: 'Pending allied validator acknowledgement.',
    },
  }),
  roomLedgerService.createBlueprintExportedEvent({
    blueprint: storageBlueprintV2,
    initiatedBy: 'player_shipwrights_guild',
    timestamp: dayjs('1880-01-05T10:40:00Z'),
    exportFormat: 'json',
    exportHash: 'storage_room_small_export_hash_v2',
    exportNotes: 'Shared with allied validator for audit.',
  }),
  roomLedgerService.createBlueprintAppliedEvent({
    blueprint: storageBlueprintV2,
    initiatedBy: 'player_shipwrights_guild',
    timestamp: dayjs('1880-01-06T10:10:00Z'),
    applicationId: 'apply_storage_room_alpha',
    target: {
      structureId: 'warehouse_alpha',
      chunkCoord: { x: 12, y: 4 },
      roomLabel: 'storage_aft',
    },
    applicationProof: 'apply_storage_room_alpha_proof',
  }),
  roomLedgerService.createConstructionStartedEvent({
    construction: {
      constructionId: 'construction_storage_room_alpha',
      target: {
        structureId: 'warehouse_alpha',
        roomLabel: 'storage_aft',
      },
    },
    blueprint: storageBlueprintV2,
    initiatedBy: 'player_shipwrights_guild',
    timestamp: dayjs('1880-01-06T10:15:00Z'),
    scheduledCompletionIso: '1880-01-07T10:00:00Z',
    validation: {
      validators: ['player_harbor_master'],
    },
  }),
  roomLedgerService.createConstructionCompletedEvent({
    construction: {
      constructionId: 'construction_storage_room_alpha',
      target: {
        structureId: 'warehouse_alpha',
        roomLabel: 'storage_aft',
      },
    },
    blueprint: storageBlueprintV2,
    initiatedBy: 'player_shipwrights_guild',
    timestamp: dayjs('1880-01-07T09:45:00Z'),
    completionProof: 'completion_storage_room_alpha_merkle_root',
  }),
];
