/**
 * Goods provenance alignment — structural fidelity
 *
 * Provides deterministic metadata describing how managed goods tie back to
 * world biomes, flora and extraction/refinement structures. This module
 * documents ordering/normalization rules and ledger references without
 * introducing any simulation logic.
 */

import { BiomeType } from '../enums/BiomeType';
import { FloraType } from '../enums/FloraType';
import { GoodsType } from '../enums/GoodsType';
import { StructureType } from '../enums/StructureType';

export interface GoodsProvenanceNormalizationRules {
  biomeOrdering: 'alphabetical';
  floraOrdering: 'alphabetical';
  structureOrdering: 'alphabetical';
  ledgerOrdering: 'stream-event-schema';
  casing: 'lower-snake';
}

export const DEFAULT_GOODS_PROVENANCE_NORMALIZATION: GoodsProvenanceNormalizationRules = {
  biomeOrdering: 'alphabetical',
  floraOrdering: 'alphabetical',
  structureOrdering: 'alphabetical',
  ledgerOrdering: 'stream-event-schema',
  casing: 'lower-snake',
};

export interface GoodsProvenanceLedgerRef {
  /** Ledger stream that owns the canonical record (e.g., worldgen, catalogue). */
  stream: 'worldgen' | 'catalogue' | 'trade';
  /** Event type or topic in the ledger schema. */
  eventType: string;
  /** Schema reference used to validate payload structure. */
  schemaRef: string;
  /** Optional hash, merkle pointer or chunk tag for audit. */
  hashPointer?: string;
}

export interface GoodsProvenanceRecord {
  good: GoodsType;
  primaryBiome: BiomeType;
  secondaryBiomes: BiomeType[];
  floraSources: FloraType[];
  extractionStructures: StructureType[];
  refinementStructures: StructureType[];
  regionTags: string[];
  ledgerRefs: GoodsProvenanceLedgerRef[];
  normalization: GoodsProvenanceNormalizationRules;
  notes?: string;
}

export interface GoodsProvenanceValidationResult {
  normalized: GoodsProvenanceRecord;
  errors: string[];
}

export type GoodsProvenanceLookup = Map<GoodsType, GoodsProvenanceRecord>;

const goodsValues = new Set(Object.values(GoodsType));
const biomeValues = new Set(Object.values(BiomeType));
const floraValues = new Set(Object.values(FloraType));
const structureValues = new Set(Object.values(StructureType));

const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const asc = (a: string, b: string) => a.localeCompare(b);

export function normalizeProvenanceRecord(
  record: GoodsProvenanceRecord,
  rules: GoodsProvenanceNormalizationRules = DEFAULT_GOODS_PROVENANCE_NORMALIZATION,
): GoodsProvenanceRecord {
  const { secondaryBiomes, floraSources, extractionStructures, refinementStructures, regionTags, ledgerRefs } = record;

  return {
    ...record,
    secondaryBiomes: [...secondaryBiomes].sort(asc),
    floraSources: [...floraSources].sort(asc),
    extractionStructures: [...extractionStructures].sort(asc),
    refinementStructures: [...refinementStructures].sort(asc),
    regionTags: [...regionTags].map(slugify).sort(asc),
    ledgerRefs: [...ledgerRefs].sort((a, b) =>
      `${a.stream}:${a.eventType}:${a.schemaRef}`.localeCompare(`${b.stream}:${b.eventType}:${b.schemaRef}`)
    ),
    normalization: rules,
  };
}

export function validateGoodsProvenanceRecord(
  record: GoodsProvenanceRecord,
  rules: GoodsProvenanceNormalizationRules = DEFAULT_GOODS_PROVENANCE_NORMALIZATION,
): GoodsProvenanceValidationResult {
  const normalized = normalizeProvenanceRecord(record, rules);
  const errors: string[] = [];

  if (!goodsValues.has(normalized.good)) {
    errors.push(`Unknown good: ${normalized.good}`);
  }

  if (!biomeValues.has(normalized.primaryBiome)) {
    errors.push(`Unknown primary biome: ${normalized.primaryBiome}`);
  }

  normalized.secondaryBiomes.forEach(biome => {
    if (!biomeValues.has(biome)) {
      errors.push(`Unknown secondary biome: ${biome}`);
    }
  });

  normalized.floraSources.forEach(flora => {
    if (!floraValues.has(flora)) {
      errors.push(`Unknown flora source: ${flora}`);
    }
  });

  normalized.extractionStructures.forEach(structure => {
    if (!structureValues.has(structure)) {
      errors.push(`Unknown extraction structure: ${structure}`);
    }
  });

  normalized.refinementStructures.forEach(structure => {
    if (!structureValues.has(structure)) {
      errors.push(`Unknown refinement structure: ${structure}`);
    }
  });

  normalized.ledgerRefs.forEach(ref => {
    if (!ref.eventType) {
      errors.push('Missing ledger eventType');
    }
    if (!ref.schemaRef) {
      errors.push('Missing ledger schemaRef');
    }
  });

  return { normalized, errors };
}
