/**
 * GOODS LEDGER EVENT MODELS
 * Ledger event definitions for goods catalogue lifecycle management
 * Following established patterns from research and room blueprint ledger events
 */

import { GoodsType } from '../enums/GoodsType';
import { ManagedGood } from '../services/goods-catalog-io.service';
import { PlayerID, Hash128 } from './anna-readme.models';
import { CultureTagId } from './tech-tree.models';
import { LedgerEvent } from './ledger.models';

/**
 * Cross-player validation pattern reused from research events
 */
export interface CrossPlayerValidation {
  validators: PlayerID[];
  expectedCultureTags?: CultureTagId[];
  validationNotes?: string;
}

/**
 * Goods ledger event types for catalogue lifecycle management
 */
export enum GoodsLedgerEventType {
  GOOD_CREATED = 'GOOD_CREATED',
  GOOD_UPDATED = 'GOOD_UPDATED',
  GOOD_DELETED = 'GOOD_DELETED',
  GOOD_EXPORTED = 'GOOD_EXPORTED',
  CATALOG_EXPORTED = 'CATALOG_EXPORTED',
}

/**
 * Base payload for all goods-related events
 * Includes deterministic serialization and minimal actor metadata
 */
export interface GoodsEventBasePayload {
  good: ManagedGood;
  checksum128: string;
  serializationRulesVersion: string; // aligns with GOODS_SERIALIZATION_RULES to enforce determinism
  source: 'sdk' | 'import' | 'system';
  initiatedBy: PlayerID;
  minuteTimestampIso: string; // normalized to the start of the minute for determinism
}

/**
 * Payload for goods creation events
 */
export interface GoodsCreatedPayload extends GoodsEventBasePayload {
  importOrder: number; // stable order within an import batch
  creationNotes?: string;
}

/**
 * Payload for goods update events
 */
export interface GoodsUpdatedPayload extends GoodsEventBasePayload {
  previousGood: ManagedGood;
  changeSummary?: string;
  changeNotes?: string;
}

/**
 * Payload for goods deletion events
 */
export interface GoodsDeletedPayload extends GoodsEventBasePayload {
  reason: 'deprecated' | 'invalidated' | 'duplicate' | 'user_request';
  deletionNotes?: string;
}

/**
 * Payload for individual goods export events
 */
export interface GoodsExportedPayload extends GoodsEventBasePayload {
  exportFormat: 'json' | 'binary' | 'yaml';
  exportHash: Hash128;
  exportNotes?: string;
}

/**
 * Payload for full catalog export events
 * Includes catalogue hash for cross-player verification
 */
export interface CatalogExportedPayload {
  catalogHash: Hash128;
  totalGoodsExported: number;
  exportFormat: 'json' | 'binary' | 'yaml';
  exportedGoods: GoodsType[]; // Reference identifiers only, no duplication
  initiatedBy: PlayerID;
  minuteTimestampIso: string; // normalized to the start of the minute for determinism
  exportRulesVersion: string;
  crossPlayerValidation?: CrossPlayerValidation; // Reuse validation pattern
  exportNotes?: string;
}

/**
 * Union type for all goods ledger events
 */
export type GoodsLedgerEvent =
  | LedgerEvent<GoodsCreatedPayload>
  | LedgerEvent<GoodsUpdatedPayload>
  | LedgerEvent<GoodsDeletedPayload>
  | LedgerEvent<GoodsExportedPayload>
  | LedgerEvent<CatalogExportedPayload>;

/**
 * Serialization rules for deterministic goods event processing
 * Ensures consistent ordering and formatting across different implementations
 */
export const GOODS_SERIALIZATION_RULES = {
  version: '1.0.0',
  rules: {
    // Goods must be sorted by type then name for deterministic serialization
    goodsOrdering: 'type_asc_name_asc',
    
    // Timestamp normalization: round to start of minute for consistency
    timestampPrecision: 'minute',
    
    // Checksum generation: stable hash of good data excluding dynamic fields
    checksumFields: ['type', 'name', 'category', 'description', 'tags', 'rarity', 'complexity', 'basePrice', 'components'],
    
    // Export formatting: consistent JSON with stable key ordering
    exportFormat: 'json_stable_keys',
  }
} as const;

/**
 * Validation rules for goods ledger events
 * Ensures events meet integrity requirements for blockchain recording
 */
export interface GoodsLedgerValidationRules {
  requiredFields: string[];
  checksumValidation: boolean;
  timestampValidation: boolean;
  actorMetadataValidation: boolean;
  crossPlayerValidationOptional: boolean;
}

/**
 * Default validation rules for goods ledger events
 */
export const GOODS_LEDGER_VALIDATION_RULES: GoodsLedgerValidationRules = {
  requiredFields: ['type', 'good', 'initiatedBy', 'minuteTimestampIso'],
  checksumValidation: true,
  timestampValidation: true,
  actorMetadataValidation: true,
  crossPlayerValidationOptional: true,
} as const;