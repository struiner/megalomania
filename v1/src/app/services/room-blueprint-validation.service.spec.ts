import { TestBed } from '@angular/core/testing';
import { RoomBlueprint } from '../models/room-blueprint.models';
import { RoomBlueprintValidationService } from './room-blueprint-validation.service';

describe('RoomBlueprintValidationService', () => {
  let service: RoomBlueprintValidationService;

  const baseBlueprint: RoomBlueprint = {
    id: 'crew_quarters',
    name: 'Crew Quarters',
    purpose: 'Rest space',
    width: 32,
    height: 24,
    hazards: ['fire'],
    sockets: [{ id: 'door', kind: 'structural', position: { x: 0, y: 0 } }],
    features: ['Bunks', 'Lockers'],
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
      width: 8,
      height: 4,
      hazards: ['fire', 'fire'],
      features: ['   '],
    };

    const result = service.validateBlueprint(blueprint, { hazardVocabulary: ['fire'] });
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
      sockets: [
        { id: 'north', kind: 'structural', position: { x: -1, y: 10 } },
        { id: 'north', kind: 'oxygen', position: { x: 5, y: 30 } },
      ],
    };

    const result = service.validateBlueprint(blueprint, { socketKinds: ['structural', 'power'] });
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
      sockets: [{ id: 'power_bus', kind: 'power', position: { x: 2, y: 2 } }],
      prerequisites: [{ id: 'needs-hub', requiresBlueprintId: 'hub_room', requiresSockets: ['data_bus'] }],
    };

    const duplicateCrew: RoomBlueprint = {
      ...baseBlueprint,
      name: 'Crew Quarters Copy',
    };

    const results = service.validateBlueprints([baseBlueprint, duplicateCrew, engineering], {
      hazardVocabulary: ['fire'],
    });

    const engineeringResult = results.find((entry) => entry.blueprintId === 'engineering');
    const crewResult = results.find((entry) => entry.blueprintId === baseBlueprint.id);

    expect(engineeringResult?.notices.some((notice) => notice.path === 'prerequisites[0].requiresBlueprintId')).toBe(true);
    expect(engineeringResult?.notices.some((notice) => notice.path === 'prerequisites[0].requiresSockets[0]')).toBe(true);
    expect(crewResult?.notices.some((notice) => notice.path === 'id')).toBe(true);
  });
});
