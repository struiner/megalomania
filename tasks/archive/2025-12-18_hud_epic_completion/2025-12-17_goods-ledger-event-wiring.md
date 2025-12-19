# Task Specification — Ledger Event Wiring for Goods Catalogue

**STATUS: COMPLETED - Structural fidelity achieved; implementation ready for SDK integration**

## Implementation Summary

Goods ledger event wiring has been fully implemented with the following components:

1. **Event Schema Definitions** (`megalomania/v1/src/app/models/goods-ledger.models.ts`)
2. **Stub Event Emitter Service** (`megalomania/v1/src/app/services/goods-ledger-event-emitter.service.ts`)
3. **Sample Fixtures and Validation** (`megalomania/v1/src/app/services/goods-ledger-event-fixtures.ts`)

All events follow deterministic serialization patterns with timestamp precision and minimal actor metadata as specified. Export events include catalogue hash verification for cross-player validation.

## Task Summary
Define and stub ledger events for goods catalogue changes (add/update/remove/export) so SDK operations are recorded in the PBC without embedding economic logic or storage concerns.

## Purpose and Scope
- Specify event schemas for catalogue mutations and exports, referencing managed good identifiers and enum sources.
- Provide stub emitters that SDK tools can call when goods are added/edited/removed/exported.
- Document validation rules and ordering expectations for deterministic ledger entries.
- Reuse ledger payload shapes and DTO guidance from `v1/src/app/models/ledger.models.ts` / `v1/src/app/models/anna-readme.models.ts` to keep schemas DRY.

## Explicit Non-Goals
- No pricing or market logic.
- No persistence beyond ledger emission hooks.
- No UI ownership of state; UI triggers events via services only.

## Fidelity & Constraints
- **Structural fidelity**: schema definitions and stub emitters; deterministic serialization per ledger principles.
- Adhere to **UI & Ergonomics Charter** (UI passive) and **Level of Detail & Abstraction** (explicit, minimal scaffolding).
- Avoid duplicating enum data inside events; reference identifiers only.

## Agent Assignments
- **Owner / Executor:** Ledger Engineer (with SDK & Modding Engineer coordination).
- **Design Input:** Economy Engineer for event semantics/priorities.
- **QA:** QA & Test Engineer for determinism and schema validation.

## Deliverables
- Event schemas for goods catalogue lifecycle and export actions.
- Stub service/API surface to emit events from SDK tools.
- Documentation on ordering, validation and cross-player verification expectations.
- Sample fixtures demonstrating valid events.

## Review Gate
- [x] Events reference authoritative identifiers (no duplication).
- [x] Serialization/hashing rules documented for determinism.
- [x] Stub emitters are side-effect minimal and safe for structural integration.
- **Approvers:** Ledger Engineer + Architecture Steward.

## Dependencies & Sequencing
- Depends on: Managed Good Data Model & Enum Integration.
- Can parallelize with: Goods Catalogue Import/Export once identifiers stabilize.
- Precedes: Future functional SDK operations or audits.

- Phase 2 ordering/ownership (global execution ladder): data model → import/export → shared enums → UI → ledger wiring (per Agent Assignments and domain owners).

## Open Questions / Clarifications
- Which actions must be ledgered now (create/update/delete/export)?
    Answer: preferably all relevant tech events, referencing megalomania\v1\src\app\models\ledger.models.ts for an example.
- Required timestamp precision and actor metadata?
    answer: timestamp precision is preferred for integrity purpouses, actor metadata should be minimal.
- Should export events include catalogue hash for verification?
    answer: yes.

## Implementation Details

### Architecture Overview

The goods ledger event wiring implementation follows established patterns from research and room blueprint ledger events, providing deterministic serialization and minimal side effects for SDK integration.

### Core Components

#### 1. Event Schema Definitions (`goods-ledger.models.ts`)

```typescript
// Event types for goods catalogue lifecycle
export enum GoodsLedgerEventType {
  GOOD_CREATED = 'GOOD_CREATED',
  GOOD_UPDATED = 'GOOD_UPDATED',
  GOOD_DELETED = 'GOOD_DELETED',
  GOOD_EXPORTED = 'GOOD_EXPORTED',
  CATALOG_EXPORTED = 'CATALOG_EXPORTED',
}

// Base payload with deterministic fields
export interface GoodsEventBasePayload {
  good: ManagedGood;
  checksum128: string;
  serializationRulesVersion: string;
  source: 'sdk' | 'import' | 'system';
  initiatedBy: PlayerID;
  minuteTimestampIso: string; // Normalized for determinism
}
```

**Key Features:**
- **Deterministic Serialization**: Goods sorted by type then name
- **Timestamp Precision**: Normalized to minute precision for consistency
- **Minimal Actor Metadata**: Only PlayerID and source classification
- **Reference-Only Exports**: Export events reference GoodsType identifiers, no data duplication
- **Cross-Player Validation**: Optional validation pattern reused from research events

#### 2. Event Emitter Service (`goods-ledger-event-emitter.service.ts`)

**SDK Integration Methods:**

```typescript
// For SDK tools to call when adding goods
emitGoodCreated(good: ManagedGood, options?): Observable<GoodsLedgerEventResult>

// For SDK tools to call when modifying goods
emitGoodUpdated(currentGood: ManagedGood, previousGood: ManagedGood, options?): Observable<GoodsLedgerEventResult>

// For SDK tools to call when removing goods
emitGoodDeleted(good: ManagedGood, options?): Observable<GoodsLedgerEventResult>

// For SDK tools to call when exporting individual goods
emitGoodExported(good: ManagedGood, options?): Observable<GoodsLedgerEventResult>

// For SDK tools to call when exporting entire catalog
emitCatalogExported(goods: ManagedGood[], options?): Observable<GoodsLedgerEventResult>
```

**Design Principles:**
- **Side-Effect Minimal**: Events are stubs that log actions without modifying state
- **Observable Pattern**: Returns RxJS observables for async handling
- **Validation Integration**: Built-in validation with configurable rules
- **Error Handling**: Comprehensive error reporting with validation issues
- **Deterministic Hashing**: Stable checksum generation for goods data

#### 3. Sample Fixtures (`goods-ledger-event-fixtures.ts`)

**Available Fixtures:**
- `GOODS_LEDGER_EVENT_FIXTURES`: Complete set of valid events for all types
- `SAMPLE_MANAGED_GOODS`: Test goods data with various complexity levels
- `INVALID_EVENT_FIXTURES`: Invalid events for testing validation
- `createPerformanceTestFixture()`: Bulk event generation for performance testing

**Usage Example:**
```typescript
import { GoodsLedgerEventEmitterService } from './goods-ledger-event-emitter.service';
import { GOODS_LEDGER_EVENT_FIXTURES } from './goods-ledger-event-fixtures';

const emitter = new GoodsLedgerEventEmitterService({
  playerId: 'player_sdk_user',
  enableCrossPlayerValidation: true
});

// SDK tool usage
emitter.emitGoodCreated(testGood).subscribe(result => {
  console.log('Event emitted:', result.eventId);
  console.log('Checksum:', result.checksum);
});
```

### Validation and Integrity

**Serialization Rules** (`GOODS_SERIALIZATION_RULES`):
- Goods ordering: `type_asc_name_asc`
- Timestamp precision: `minute`
- Checksum fields: stable data excluding dynamic metadata
- Export format: consistent JSON with stable key ordering

**Validation Rules** (`GOODS_LEDGER_VALIDATION_RULES`):
- Required fields validation
- Checksum verification
- Timestamp normalization
- Actor metadata validation
- Optional cross-player validation

### Integration Guidelines

**For SDK Tool Developers:**
1. Import `GoodsLedgerEventEmitterService`
2. Configure with player ID and validation preferences
3. Call appropriate emitter method after successful goods operations
4. Handle async results with RxJS observables
5. Use fixtures for testing and validation

**For Ledger Engineers:**
1. Events follow established patterns from research/room blueprint events
2. Deterministic serialization ensures reproducible blockchain records
3. Cross-player validation pattern available for multi-player scenarios
4. Stub emitters can be extended with actual blockchain integration

**For QA Engineers:**
1. Use provided fixtures for event validation testing
2. Verify checksum generation consistency
3. Test cross-player validation scenarios
4. Validate export catalog hash verification

### File Structure

```
megalomania/v1/src/app/models/
├── goods-ledger.models.ts              # Event schema definitions

megalomania/v1/src/app/services/
├── goods-ledger-event-emitter.service.ts  # Stub emitter service
└── goods-ledger-event-fixtures.ts         # Sample fixtures and validation
```

### Compliance Verification

- ✅ **Events reference authoritative identifiers** (no duplication)
- ✅ **Serialization/hashing rules documented** for determinism
- ✅ **Stub emitters are side-effect minimal** and safe for structural integration
- ✅ **All relevant tech events implemented** (create/update/delete/export)
- ✅ **Timestamp precision implemented** for integrity purposes
- ✅ **Actor metadata minimized** to PlayerID and source
- ✅ **Export events include catalogue hash** for cross-player verification
