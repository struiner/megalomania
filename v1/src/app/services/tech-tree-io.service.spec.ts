import { TestBed } from '@angular/core/testing';
import { GoodsType } from '../enums/GoodsType';
import { StructureType } from '../enums/StructureType';
import { TechTree } from '../models/tech-tree.models';
import { MIXED_CASE_TECH_TREE, OUT_OF_RANGE_TIER_TREE } from '../data/tech-trees/tech-tree-normalization.fixtures';
import { TechTreeImportError, TechTreeIoService } from './tech-tree-io.service';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

describe('TechTreeIoService normalization harness', () => {
  let service: TechTreeIoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TechTreeIoService],
    });

    service = TestBed.inject(TechTreeIoService);
  });

  it('round-trips mixed-case enum values without fallback warnings', () => {
    const importResult = service.importTechTree(clone(MIXED_CASE_TECH_TREE));
    const warningIssues = importResult.issues.filter((issue) => issue.severity === 'warning');
    expect(warningIssues.length).toBe(0);

    const exported = service.exportTechTree(importResult.tree);
    expect(exported.issues.filter((issue) => issue.severity === 'warning').length).toBe(0);

    const meadNode = exported.orderedTree.nodes.find((node) => node.id === 'mead_luxuries');
    expect(meadNode?.effects?.unlock_goods).toContain(GoodsType.Mead);
    expect(meadNode?.effects?.unlock_structures).toContain(StructureType.TownHall);

    const finalNode = exported.orderedTree.nodes.find((node) => node.id === 'guild_patents');
    expect(finalNode?.tier).toBe(256);
  });

  it('enforces tier bounds with actionable errors', () => {
    try {
      service.importTechTree(clone(OUT_OF_RANGE_TIER_TREE));
      fail('Expected tier bound validation to throw');
    } catch (error) {
      expect(error instanceof TechTreeImportError).toBeTrue();
      const issues = (error as TechTreeImportError).issues;
      expect(issues.some((issue) => /tier/.test(issue.path))).toBeTrue();
    }
  });

  it('attaches structured issues for parse failures', () => {
    try {
      service.importTechTree('{not-json');
      fail('Expected parse failure to throw');
    } catch (error) {
      expect(error instanceof TechTreeImportError).toBeTrue();
      const typed = error as TechTreeImportError;
      expect(typed.kind).toBe('parse');
      expect(typed.issues.some((issue) => issue.path.startsWith('import'))).toBeTrue();
    }
  });

  it('orders nodes deterministically by tier, display_order, and id', () => {
    const unordered: TechTree = {
      tech_tree_id: 'ordering_harness',
      version: 1,
      default_culture_tags: ['biome_taiga'],
      nodes: [
        {
          id: 'zeta_tail',
          title: 'Zeta Tail',
          summary: 'Trailing entry used to test ordering.',
          tier: 3,
          display_order: 5,
          culture_tags: ['biome_taiga'],
          prerequisites: [],
        },
        {
          id: 'alpha_head',
          title: 'Alpha Head',
          summary: 'Should float to the top within its tier.',
          tier: 3,
          display_order: 1,
          culture_tags: ['biome_taiga'],
          prerequisites: [],
        },
      ],
    };

    const exported = service.exportTechTree(unordered);
    expect(exported.orderedTree.nodes.map((node) => node.id)).toEqual(['alpha_head', 'zeta_tail']);
  });
});
