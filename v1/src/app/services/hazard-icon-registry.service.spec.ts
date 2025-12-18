import { HazardType, HAZARD_DISPLAY_ORDER } from '../enums/HazardType';
import { HazardIconRegistryService } from './hazard-icon-registry.service';

describe('HazardIconRegistryService', () => {
  let service: HazardIconRegistryService;

  beforeEach(() => {
    service = new HazardIconRegistryService();
  });

  it('exposes icons in deterministic display order', () => {
    const types = service.getIcons().map((icon) => icon.type);
    expect(types).toEqual([...HAZARD_DISPLAY_ORDER]);
  });

  it('sorts selections using the registry order', () => {
    const sorted = service.sortHazards([HazardType.Fauna, HazardType.Fire, HazardType.Vacuum]);
    expect(sorted).toEqual([HazardType.Fire, HazardType.Vacuum, HazardType.Fauna]);
  });

  it('surfaces placeholder validation issues without blocking usage', () => {
    const issues = service.validateRegistry();
    const placeholderIssue = issues.find((issue) => issue.kind === 'placeholder-icon');
    expect(placeholderIssue?.affectedTypes.length).toBeGreaterThan(0);
  });
});
