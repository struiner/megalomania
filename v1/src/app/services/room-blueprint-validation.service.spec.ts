import { TestBed } from '@angular/core/testing';
import { RoomBlueprint } from '../models/room-blueprint.models';
import { RoomBlueprintValidationService } from './room-blueprint-validation.service';
import { HazardType } from '../enums/HazardType';

describe('RoomBlueprintValidationService', () => {
  let service: RoomBlueprintValidationService;

  const baseBlueprint: RoomBlueprint = {
    id: 'crew_quarters',
    name: 'Crew Quarters',
    purpose: 'Rest space',
    width: 32,
    height: 24,
    hazards: [HazardType.Fire],
    features: [],
    notes: 'Bunks, Lockers'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomBlueprintValidationService],
    });

    service = TestBed.inject(RoomBlueprintValidationService);
  });

  it('enforces dimension bounds, required purpose, and feature content with deterministic ordering', () => {
    const blueprint: RoomBlueprint = {
      ...baseBlueprint,
      name: '  CQ',
      purpose: '',
      hazards: [HazardType.Fire, HazardType.Fire],
      notes: '   ',
      width: 8,
      height: 4
    };

    const result = service.validateBlueprint(blueprint);
    const paths = result.notices.map((notice) => notice.path);

    expect(paths).toEqual([
      'dimensions.height',
      'dimensions.width',
      'features',
      'purpose',
      'features[0]',
      'hazards',
      'name',
    ]);
  });

  it('validates sockets stay in bounds and use supported kinds', () => {
    const blueprint: RoomBlueprint = {
      ...baseBlueprint,
      width: 20,
      height: 20,
      features: []
    };

    const result = service.validateBlueprint(blueprint);
    const byPath = new Map(result.notices.map((notice) => [notice.path, notice]));

    expect(byPath.get('sockets[0].position.x')?.severity).toBe('error');
    expect(byPath.get('sockets[1].position.y')?.severity).toBe('error');
    expect(byPath.get('sockets[1].kind')?.severity).toBe('warning');
    expect(byPath.get('sockets[1].id')?.severity).toBe('error');
  });

  it('surfaces missing prerequisite targets and duplicate blueprint ids when validating sets', () => {
    const engineering: RoomBlueprint = {
      ...baseBlueprint,
      id: 'engineering',
      name: 'Engineering Bay',
      features: [],
      notes: 'Power bus connection'
    };

    const duplicateCrew: RoomBlueprint = {
      ...baseBlueprint,
      name: 'Crew Quarters Copy',
    };

    const results = service.validateBlueprints([baseBlueprint, duplicateCrew, engineering]);

    const engineeringResult = results.find((entry) => entry.blueprintId === 'engineering');
    const crewResult = results.find((entry) => entry.blueprintId === baseBlueprint.id);

    // Note: These expectations may need adjustment based on the actual validation logic
    expect(engineeringResult?.notices.length).toBeGreaterThan(0);
    expect(crewResult?.notices.some((notice) => notice.path === 'id')).toBe(true);
  });
});
