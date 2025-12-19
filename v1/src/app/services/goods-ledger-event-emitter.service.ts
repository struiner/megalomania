/**
 * GOODS LEDGER EVENT EMITTER SERVICE
 * Stub emitters for SDK tools to record goods catalogue changes in the PBC
 * 
 * This service provides side-effect minimal event emission hooks that SDK tools
 * can call when goods are added/edited/removed/exported, without embedding
 * economic logic or storage concerns.
 */

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ManagedGood } from '../services/goods-catalog-io.service';
import { PlayerID, Hash128 } from '../models/anna-readme.models';
import {
  GoodsLedgerEventType,
  GoodsCreatedPayload,
  GoodsUpdatedPayload,
  GoodsDeletedPayload,
  GoodsExportedPayload,
  CatalogExportedPayload,
  CrossPlayerValidation,
  GOODS_SERIALIZATION_RULES,
  GOODS_LEDGER_VALIDATION_RULES,
} from '../models/goods-ledger.models';

/**
 * Event emission result with validation status
 */
export interface GoodsLedgerEventResult {
  success: boolean;
  eventId?: Hash128;
  checksum?: Hash128;
  validationIssues?: string[];
  timestampIso: string;
}

/**
 * Configuration for event emission
 */
export interface GoodsLedgerEmitterConfig {
  playerId: PlayerID;
  enableCrossPlayerValidation: boolean;
  validationRules?: typeof GOODS_LEDGER_VALIDATION_RULES;
  serializationRules?: typeof GOODS_SERIALIZATION_RULES;
}

/**
 * Stub emitter service for goods ledger events
 * SDK tools should call these methods when performing goods operations
 */
@Injectable({
  providedIn: 'root'
})
export class GoodsLedgerEventEmitterService {
  
  private config: GoodsLedgerEmitterConfig;
  private eventSubject = new Subject<any>();
  
  // Events observable for monitoring/debugging
  public events$ = this.eventSubject.asObservable();
  
  constructor(config?: Partial<GoodsLedgerEmitterConfig>) {
    this.config = {
      playerId: config?.playerId || 'system',
      enableCrossPlayerValidation: config?.enableCrossPlayerValidation ?? false,
      validationRules: config?.validationRules ?? GOODS_LEDGER_VALIDATION_RULES,
      serializationRules: config?.serializationRules ?? GOODS_SERIALIZATION_RULES,
    };
  }
  
  /**
   * Emit event when a new good is created/added to the catalogue
   * SDK tools should call this after successfully adding a good
   */
  emitGoodCreated(
    good: ManagedGood,
    options?: {
      importOrder?: number;
      source?: 'sdk' | 'import' | 'system';
      creationNotes?: string;
      checksum128?: Hash128;
    }
  ): Observable<GoodsLedgerEventResult> {
    return new Observable(observer => {
      try {
        const payload: GoodsCreatedPayload = {
          good,
          checksum128: options?.checksum128 || this.generateChecksum(good),
          serializationRulesVersion: this.config.serializationRules!.version,
          source: options?.source || 'sdk',
          initiatedBy: this.config.playerId,
          minuteTimestampIso: this.normalizeTimestamp(),
          importOrder: options?.importOrder || 0,
          creationNotes: options?.creationNotes,
        };
        
        const event = {
          type: GoodsLedgerEventType.GOOD_CREATED,
          description: `Good created: ${good.name} (${good.type})`,
          payload,
          resourceDelta: {}, // No resource changes for catalogue operations
          apply: () => {
            // Stub: In real implementation, this would apply the good to the catalogue
            console.log(`[Ledger] Applying good creation: ${good.name}`);
          },
          reverse: () => {
            // Stub: In real implementation, this would remove the good from catalogue
            console.log(`[Ledger] Reversing good creation: ${good.name}`);
          }
        };
        
        // Emit event for processing
        this.eventSubject.next(event);
        
        observer.next({
          success: true,
          eventId: this.generateEventId(),
          checksum: payload.checksum128,
          timestampIso: payload.minuteTimestampIso,
        });
        observer.complete();
        
      } catch (error) {
        observer.next({
          success: false,
          validationIssues: [error instanceof Error ? error.message : 'Unknown error'],
          timestampIso: this.normalizeTimestamp(),
        });
        observer.complete();
      }
    });
  }
  
  /**
   * Emit event when a good is updated/modified in the catalogue
   * SDK tools should call this after successfully updating a good
   */
  emitGoodUpdated(
    currentGood: ManagedGood,
    previousGood: ManagedGood,
    options?: {
      source?: 'sdk' | 'import' | 'system';
      changeSummary?: string;
      changeNotes?: string;
    }
  ): Observable<GoodsLedgerEventResult> {
    return new Observable(observer => {
      try {
        const payload: GoodsUpdatedPayload = {
          good: currentGood,
          previousGood,
          checksum128: this.generateChecksum(currentGood),
          serializationRulesVersion: this.config.serializationRules!.version,
          source: options?.source || 'sdk',
          initiatedBy: this.config.playerId,
          minuteTimestampIso: this.normalizeTimestamp(),
          changeSummary: options?.changeSummary,
          changeNotes: options?.changeNotes,
        };
        
        const event = {
          type: GoodsLedgerEventType.GOOD_UPDATED,
          description: `Good updated: ${currentGood.name} (${currentGood.type})`,
          payload,
          resourceDelta: {}, // No resource changes for catalogue operations
          apply: () => {
            console.log(`[Ledger] Applying good update: ${currentGood.name}`);
          },
          reverse: () => {
            console.log(`[Ledger] Reversing good update: ${currentGood.name}`);
          }
        };
        
        this.eventSubject.next(event);
        
        observer.next({
          success: true,
          eventId: this.generateEventId(),
          checksum: payload.checksum128,
          timestampIso: payload.minuteTimestampIso,
        });
        observer.complete();
        
      } catch (error) {
        observer.next({
          success: false,
          validationIssues: [error instanceof Error ? error.message : 'Unknown error'],
          timestampIso: this.normalizeTimestamp(),
        });
        observer.complete();
      }
    });
  }
  
  /**
   * Emit event when a good is deleted/removed from the catalogue
   * SDK tools should call this after successfully removing a good
   */
  emitGoodDeleted(
    good: ManagedGood,
    options?: {
      source?: 'sdk' | 'import' | 'system';
      reason?: 'deprecated' | 'invalidated' | 'duplicate' | 'user_request';
      deletionNotes?: string;
    }
  ): Observable<GoodsLedgerEventResult> {
    return new Observable(observer => {
      try {
        const payload: GoodsDeletedPayload = {
          good,
          checksum128: this.generateChecksum(good),
          serializationRulesVersion: this.config.serializationRules!.version,
          source: options?.source || 'sdk',
          initiatedBy: this.config.playerId,
          minuteTimestampIso: this.normalizeTimestamp(),
          reason: options?.reason || 'user_request',
          deletionNotes: options?.deletionNotes,
        };
        
        const event = {
          type: GoodsLedgerEventType.GOOD_DELETED,
          description: `Good deleted: ${good.name} (${good.type})`,
          payload,
          resourceDelta: {}, // No resource changes for catalogue operations
          apply: () => {
            console.log(`[Ledger] Applying good deletion: ${good.name}`);
          },
          reverse: () => {
            console.log(`[Ledger] Reversing good deletion: ${good.name}`);
          }
        };
        
        this.eventSubject.next(event);
        
        observer.next({
          success: true,
          eventId: this.generateEventId(),
          checksum: payload.checksum128,
          timestampIso: payload.minuteTimestampIso,
        });
        observer.complete();
        
      } catch (error) {
        observer.next({
          success: false,
          validationIssues: [error instanceof Error ? error.message : 'Unknown error'],
          timestampIso: this.normalizeTimestamp(),
        });
        observer.complete();
      }
    });
  }
  
  /**
   * Emit event when a good is exported from the catalogue
   * SDK tools should call this when exporting individual goods
   */
  emitGoodExported(
    good: ManagedGood,
    options?: {
      exportFormat?: 'json' | 'binary' | 'yaml';
      exportHash?: Hash128;
      exportNotes?: string;
    }
  ): Observable<GoodsLedgerEventResult> {
    return new Observable(observer => {
      try {
        const payload: GoodsExportedPayload = {
          good,
          checksum128: this.generateChecksum(good),
          serializationRulesVersion: this.config.serializationRules!.version,
          source: 'sdk',
          initiatedBy: this.config.playerId,
          minuteTimestampIso: this.normalizeTimestamp(),
          exportFormat: options?.exportFormat || 'json',
          exportHash: options?.exportHash || this.generateEventId(),
          exportNotes: options?.exportNotes,
        };
        
        const event = {
          type: GoodsLedgerEventType.GOOD_EXPORTED,
          description: `Good exported: ${good.name} (${good.type})`,
          payload,
          resourceDelta: {}, // No resource changes for export operations
          apply: () => {
            console.log(`[Ledger] Recording good export: ${good.name}`);
          },
          reverse: () => {
            console.log(`[Ledger] Invalidating good export record: ${good.name}`);
          }
        };
        
        this.eventSubject.next(event);
        
        observer.next({
          success: true,
          eventId: this.generateEventId(),
          checksum: payload.checksum128,
          timestampIso: payload.minuteTimestampIso,
        });
        observer.complete();
        
      } catch (error) {
        observer.next({
          success: false,
          validationIssues: [error instanceof Error ? error.message : 'Unknown error'],
          timestampIso: this.normalizeTimestamp(),
        });
        observer.complete();
      }
    });
  }
  
  /**
   * Emit event when the entire goods catalogue is exported
   * Includes catalogue hash for cross-player verification
   */
  emitCatalogExported(
    exportedGoods: ManagedGood[],
    options?: {
      exportFormat?: 'json' | 'binary' | 'yaml';
      catalogHash?: Hash128;
      crossPlayerValidation?: CrossPlayerValidation;
      exportNotes?: string;
    }
  ): Observable<GoodsLedgerEventResult> {
    return new Observable(observer => {
      try {
        const catalogHash = options?.catalogHash || this.generateCatalogHash(exportedGoods);
        const payload: CatalogExportedPayload = {
          catalogHash,
          totalGoodsExported: exportedGoods.length,
          exportFormat: options?.exportFormat || 'json',
          exportedGoods: exportedGoods.map(g => g.type), // Reference identifiers only
          initiatedBy: this.config.playerId,
          minuteTimestampIso: this.normalizeTimestamp(),
          exportRulesVersion: this.config.serializationRules!.version,
          crossPlayerValidation: this.config.enableCrossPlayerValidation ? options?.crossPlayerValidation : undefined,
          exportNotes: options?.exportNotes,
        };
        
        const event = {
          type: GoodsLedgerEventType.CATALOG_EXPORTED,
          description: `Catalog exported: ${exportedGoods.length} goods`,
          payload,
          resourceDelta: {}, // No resource changes for export operations
          apply: () => {
            console.log(`[Ledger] Recording catalog export: ${exportedGoods.length} goods`);
          },
          reverse: () => {
            console.log(`[Ledger] Invalidating catalog export record: ${exportedGoods.length} goods`);
          }
        };
        
        this.eventSubject.next(event);
        
        observer.next({
          success: true,
          eventId: this.generateEventId(),
          checksum: catalogHash,
          timestampIso: payload.minuteTimestampIso,
        });
        observer.complete();
        
      } catch (error) {
        observer.next({
          success: false,
          validationIssues: [error instanceof Error ? error.message : 'Unknown error'],
          timestampIso: this.normalizeTimestamp(),
        });
        observer.complete();
      }
    });
  }
  
  // Private helper methods for deterministic event generation
  
  private normalizeTimestamp(): string {
    const now = new Date();
    // Round to start of minute for determinism
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now.toISOString();
  }
  
  private generateChecksum(good: ManagedGood): Hash128 {
    // Simplified checksum generation - in real implementation would use stable hashing
    const stableData = JSON.stringify({
      type: good.type,
      name: good.name,
      category: good.category,
      description: good.description,
      tags: [...good.tags].sort(),
      rarity: good.rarity,
      complexity: good.complexity,
      basePrice: good.basePrice,
      components: good.components?.map(c => ({ type: c.type, amount: c.amount })).sort((a, b) => a.type.localeCompare(b.type)),
    });
    
    // Simple hash function for demonstration - replace with proper crypto hash
    let hash = 0;
    for (let i = 0; i < stableData.length; i++) {
      const char = stableData.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(32, '0') as Hash128;
  }
  
  private generateCatalogHash(goods: ManagedGood[]): Hash128 {
    // Generate hash from sorted goods list for determinism
    const sortedGoods = [...goods].sort((a, b) => {
      const typeCompare = a.type.localeCompare(b.type);
      if (typeCompare !== 0) return typeCompare;
      return a.name.localeCompare(b.name);
    });
    
    const catalogData = JSON.stringify(sortedGoods.map(g => ({
      type: g.type,
      name: g.name,
      checksum: this.generateChecksum(g),
    })));
    
    // Simple hash function for demonstration
    let hash = 0;
    for (let i = 0; i < catalogData.length; i++) {
      const char = catalogData.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(32, '0') as Hash128;
  }
  
  private generateEventId(): Hash128 {
    // Generate unique event ID - in real implementation would use proper UUID/timestamp combination
    return `${Date.now()}-${Math.random().toString(16).substr(2, 8)}` as Hash128;
  }
}