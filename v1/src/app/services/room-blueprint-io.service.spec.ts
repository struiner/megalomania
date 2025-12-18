import { TestBed } from '@angular/core/testing';
import { RoomBlueprintIoService } from './room-blueprint-io.service';
import { RoomHazardType } from '../enums/RoomHazardType';
import { CREW_QUARTERS_BLUEPRINT, DUPLICATE_HAZARD_BLUEPRINT } from '../data/rooms/room-blueprint.fixtures';
import { RoomBlueprintValidationError } from '../models/room-blueprint.models';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

describe('RoomBlueprintIoService', () => {
  let service: RoomBlueprintIoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomBlueprintIoService],
    });

    service = TestBed.inject(RoomBlueprintIoService);
  });

  it('round-trips a valid blueprint deterministically', () => {
    const raw = {
      ...clone(CREW_QUARTERS_BLUEPRINT),
      hazards: [RoomHazardType.Vacuum, RoomHazardType.Fire, RoomHazardType.Intrusion],
      features: ['Emergency mask cache', 'Lockers', 'Sleeping pods'],
    };

    const imported = service.importBlueprint(raw);
    expect(imported.orderedBlueprint.hazards).toEqual([
      RoomHazardType.Fire,
      RoomHazardType.Intrusion,
      RoomHazardType.Vacuum,
    ]);
    expect(imported.orderedBlueprint.features).toEqual(['Emergency mask cache', 'Lockers', 'Sleeping pods']);

    const exported = service.exportBlueprint(imported.orderedBlueprint);
    expect(JSON.parse(exported.json)).toEqual(imported.orderedBlueprint);
    expect(exported.validation.hasErrors).toBeFalse();
  });

  it('enforces the configured dimension bounds', () => {
    const invalid = { ...clone(CREW_QUARTERS_BLUEPRINT), width: 8, height: 8 };
    expect(() => service.importBlueprint(invalid)).toThrowError(/dimensions must be at least 16x16/i);
  });

  it('supports optional hazard deduplication with a warning surface', () => {
    const deduped = service.importBlueprint(clone(DUPLICATE_HAZARD_BLUEPRINT));
    expect(deduped.orderedBlueprint.hazards).toEqual([RoomHazardType.Electrical, RoomHazardType.Fire]);
    expect(deduped.validation.issuesByPath['hazards'][0].severity).toBe('warning');

    const retained = service.importBlueprint(clone(DUPLICATE_HAZARD_BLUEPRINT), { deduplicateHazards: false });
    expect(retained.orderedBlueprint.hazards).toEqual([
      RoomHazardType.Electrical,
      RoomHazardType.Fire,
      RoomHazardType.Fire,
    ]);
    expect(retained.validation.issuesByPath['hazards'][0].message).toContain('retained');
  });

  it('returns structured validation details for unknown hazards', () => {
    const invalid = { ...clone(CREW_QUARTERS_BLUEPRINT), hazards: ['phantom_hazard'] };

    try {
      service.importBlueprint(invalid);
      fail('Expected import to throw');
    } catch (error) {
      const validation = (error as RoomBlueprintValidationError).summary;
      expect(validation.hasErrors).toBeTrue();
      expect(validation.issuesByPath['hazards[0]'][0].message).toContain('Unknown hazard');
    }
  });
});
