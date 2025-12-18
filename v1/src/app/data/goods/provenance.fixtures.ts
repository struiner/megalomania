import { BiomeType } from '../../enums/BiomeType';
import { FloraType } from '../../enums/FloraType';
import { GoodsType } from '../../enums/GoodsType';
import { StructureType } from '../../enums/StructureType';
import {
  DEFAULT_GOODS_PROVENANCE_NORMALIZATION,
  GoodsProvenanceLookup,
  GoodsProvenanceRecord,
  GoodsProvenanceValidationResult,
  GoodsProvenanceNormalizationRules,
  validateGoodsProvenanceRecord,
} from '../../models/goods-provenance.model';

export const GOODS_PROVENANCE_NORMALIZATION_RULES: GoodsProvenanceNormalizationRules =
  DEFAULT_GOODS_PROVENANCE_NORMALIZATION;

export const GOODS_PROVENANCE_FIXTURES: GoodsProvenanceRecord[] = [
  {
    good: GoodsType.Wood,
    primaryBiome: BiomeType.Forest,
    secondaryBiomes: [BiomeType.Woodland, BiomeType.Taiga],
    floraSources: [FloraType.Spruce, FloraType.Pine, FloraType.Fir],
    extractionStructures: [StructureType.Woodcutter, StructureType.Lumberyard],
    refinementStructures: [StructureType.Lumberyard],
    regionTags: ['northern_forest_band', 'taiga_frontier'],
    ledgerRefs: [
      {
        stream: 'worldgen',
        eventType: 'world.resource.sited',
        schemaRef: 'ledger.world.resource.v1',
        hashPointer: 'genesis:forest-wood',
      },
      {
        stream: 'catalogue',
        eventType: 'goods.catalogued',
        schemaRef: 'ledger.goods.catalogue.v1',
      },
    ],
    normalization: GOODS_PROVENANCE_NORMALIZATION_RULES,
    notes: 'Wood tracks forest and taiga stands; ledger tags point to siting and catalogue events.',
  },
  {
    good: GoodsType.Iron,
    primaryBiome: BiomeType.Alpine,
    secondaryBiomes: [BiomeType.AlpineGrassland],
    floraSources: [FloraType.Lichen, FloraType.AlpineMoss],
    extractionStructures: [StructureType.Mine],
    refinementStructures: [StructureType.Forge, StructureType.Steelworks],
    regionTags: ['ridge_cap_outcrops', 'foothill_streambeds'],
    ledgerRefs: [
      {
        stream: 'worldgen',
        eventType: 'world.ore.vein_sited',
        schemaRef: 'ledger.world.resource.v1',
        hashPointer: 'genesis:iron-veins',
      },
      {
        stream: 'catalogue',
        eventType: 'goods.catalogued',
        schemaRef: 'ledger.goods.catalogue.v1',
      },
    ],
    normalization: GOODS_PROVENANCE_NORMALIZATION_RULES,
    notes: 'Iron binds to alpine ore veins; refinement is tracked separately via forge/steelworks ledger hooks.',
  },
  {
    good: GoodsType.Beer,
    primaryBiome: BiomeType.Grassland,
    secondaryBiomes: [BiomeType.Woodland, BiomeType.Beach],
    floraSources: [FloraType.FescueGrass, FloraType.SeaOats, FloraType.Reeds],
    extractionStructures: [StructureType.GrainFarm],
    refinementStructures: [StructureType.Brewery],
    regionTags: ['grain_belt', 'coastal_malt_marches'],
    ledgerRefs: [
      {
        stream: 'worldgen',
        eventType: 'world.crop.planted',
        schemaRef: 'ledger.world.crop.v1',
        hashPointer: 'genesis:grain-belts',
      },
      {
        stream: 'trade',
        eventType: 'goods.batch_brewed',
        schemaRef: 'ledger.goods.production.v1',
      },
    ],
    normalization: GOODS_PROVENANCE_NORMALIZATION_RULES,
    notes: 'Beer aligns to deterministic grain belts and brew runs; ledger refs cover planting and batch records.',
  },
];

export interface GoodsProvenanceBuildResult {
  lookup: GoodsProvenanceLookup;
  validation: GoodsProvenanceValidationResult[];
}

export function buildGoodsProvenanceLookup(
  fixtures: GoodsProvenanceRecord[] = GOODS_PROVENANCE_FIXTURES,
  rules: GoodsProvenanceNormalizationRules = GOODS_PROVENANCE_NORMALIZATION_RULES,
): GoodsProvenanceBuildResult {
  const lookup: GoodsProvenanceLookup = new Map();
  const validation: GoodsProvenanceValidationResult[] = [];

  fixtures.forEach(entry => {
    const result = validateGoodsProvenanceRecord(entry, rules);
    lookup.set(entry.good, result.normalized);
    if (result.errors.length) {
      validation.push(result);
    }
  });

  return { lookup, validation };
}
