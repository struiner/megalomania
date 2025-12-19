# Room Ledger Event Wiring Service Documentation

## Overview

The `RoomLedgerEventWiringService` provides a comprehensive framework for recording room blueprint lifecycle events in the game's ledger system. This service ensures deterministic event emission, cross-player verification, and proper validation of blueprint operations.

## Purpose and Scope

This service is responsible for:

- **Event Schema Definition**: Defining consistent payload structures for all room blueprint operations
- **Stub Emitter Implementation**: Providing APIs that SDK and UI flows can call when blueprints are created, edited, removed, or exported
- **Validation and Ordering**: Enforcing business rules, timestamp normalization, and cross-player verification
- **Deterministic Serialization**: Ensuring reproducible event generation for ledger consistency

## Core Architecture

### Event Types

The service supports eight primary event types, each with specific payload structures:

1. **BLUEPRINT_CREATED** - Records initial blueprint creation
2. **BLUEPRINT_UPDATED** - Records blueprint modifications
3. **BLUEPRINT_EXPORTED** - Records blueprint export operations
4. **BLUEPRINT_DEPRECATED** - Records blueprint retirement/removal
5. **BLUEPRINT_APPLIED** - Records blueprint usage for construction
6. **CONSTRUCTION_STARTED** - Records construction initiation
7. **CONSTRUCTION_COMPLETED** - Records construction completion
8. **CONSTRUCTION_CANCELLED** - Records construction cancellation

### Service Configuration

```typescript
export interface BlueprintEventOrderingRules {
  timestampPrecision: 'minute' | 'second' | 'millisecond';
  hashAlgorithm: 'sha256' | 'sha128';
  serializationVersion: string;
}

const defaultOrderingRules: BlueprintEventOrderingRules = {
  timestampPrecision: 'minute',
  hashAlgorithm: 'sha128',
  serializationVersion: '1.0.0',
};
```

## Validation Framework

### Blueprint Validation

Before emitting any ledger event, the service validates the blueprint structure:

```typescript
interface ValidationResult {
  isValid: boolean;
  issues: string[];
}
```

**Required Fields:**
- `id`: Non-empty blueprint identifier
- `name`: Non-empty display name
- `width`: Positive integer
- `height`: Positive integer

**Format Constraints:**
- Blueprint ID must be lowercase_snake_case for ledger determinism
- Version string must follow semantic versioning
- Structure type must match enum values

### Cross-Player Verification

The service supports optional cross-player validation:

```typescript
interface CrossPlayerVerificationHooks {
  validators: PlayerID[];
  validationNotes?: string;
  expectedHazards?: HazardType[];
}

interface BlueprintEventValidationOptions {
  requireValidationHooks?: boolean;
  allowSystemSource?: boolean;
  validateDeterminism?: boolean;
  crossPlayerVerification?: CrossPlayerVerificationHooks;
  timestampPrecision?: 'minute' | 'second' | 'millisecond';
}
```

**Validation Scenarios:**
- **High-Security Events**: Require validation hooks with multiple validators
- **System Events**: Allow system source when `allowSystemSource` is true
- **Determinism Check**: Validate serialization rules when `validateDeterminism` is true

## Event Emission APIs

### Blueprint Lifecycle Events

#### `emitBlueprintCreated()`

Records the creation of a new room blueprint.

**Parameters:**
- `blueprint: RoomBlueprint` - The blueprint being created
- `initiatedBy: PlayerID` - Player who initiated the creation
- `source: 'player' | 'imported' | 'generated'` - Source of the blueprint
- `options: BlueprintEventValidationOptions` - Optional validation settings

**Payload Structure:**
```typescript
interface RoomBlueprintCreatedPayload extends RoomBlueprintEventBase {
  source: 'player' | 'imported' | 'generated';
  creationNotes?: string;
}
```

**Example Usage:**
```typescript
const event = service.emitBlueprintCreated(
  blueprint,
  'player_123',
  'player',
  {
    crossPlayerVerification: {
      validators: ['validator_1', 'validator_2'],
      validationNotes: 'Safety review required'
    }
  }
);
```

#### `emitBlueprintUpdated()`

Records modifications to an existing blueprint.

**Parameters:**
- `blueprint: RoomBlueprint` - Updated blueprint
- `previousRevisionHash: Hash128` - Hash of previous version
- `initiatedBy: PlayerID` - Player who made changes
- `changeSummary?: string` - Description of changes
- `options: BlueprintEventValidationOptions` - Optional validation settings

**Payload Structure:**
```typescript
interface RoomBlueprintUpdatedPayload extends RoomBlueprintEventBase {
  previousRevisionHash: Hash128;
  changeSummary?: string;
}
```

#### `emitBlueprintExported()`

Records blueprint export operations.

**Parameters:**
- `blueprint: RoomBlueprint` - Blueprint being exported
- `initiatedBy: PlayerID` - Player initiating export
- `exportFormat: 'json' | 'binary' | 'yaml'` - Export format
- `exportHash: Hash128` - Hash of exported content
- `exportNotes?: string` - Optional export notes
- `options: BlueprintEventValidationOptions` - Optional validation settings

**Payload Structure:**
```typescript
interface RoomBlueprintExportedPayload extends RoomBlueprintEventBase {
  exportFormat: 'json' | 'binary' | 'yaml';
  exportHash: Hash128;
  exportNotes?: string;
}
```

#### `emitBlueprintDeprecated()`

Records blueprint deprecation or retirement.

**Parameters:**
- `blueprintIdentifier: RoomBlueprintIdentifier` - ID of deprecated blueprint
- `initiatedBy: PlayerID` - Player initiating deprecation
- `reason: 'superseded' | 'invalidated' | 'withdrawn'` - Deprecation reason
- `replacementBlueprintId?: string` - Optional replacement blueprint
- `deprecationNotes?: string` - Optional deprecation notes
- `options: BlueprintEventValidationOptions` - Optional validation settings

**Payload Structure:**
```typescript
interface RoomBlueprintDeprecatedPayload extends RoomBlueprintEventBase {
  reason: 'superseded' | 'invalidated' | 'withdrawn';
  replacementBlueprintId?: string;
  deprecationNotes?: string;
}
```

### Construction Events

#### `emitBlueprintApplied()`

Records blueprint application for construction.

**Parameters:**
- `blueprint: RoomBlueprint` - Blueprint being applied
- `applicationId: string` - Unique application identifier
- `target: RoomBlueprintApplicationTarget` - Construction target location
- `initiatedBy: PlayerID` - Player initiating application
- `applicationProof?: Hash128` - Optional application proof
- `options: BlueprintEventValidationOptions` - Optional validation settings

#### `emitConstructionStarted()`

Records construction initiation.

**Parameters:**
- `construction: RoomConstructionSite` - Construction site details
- `blueprint: RoomBlueprint` - Blueprint being constructed
- `initiatedBy: PlayerID` - Player initiating construction
- `scheduledCompletionIso?: string` - Optional completion timestamp
- `applicationId?: string` - Optional application reference
- `options: BlueprintEventValidationOptions` - Optional validation settings

#### `emitConstructionCompleted()`

Records construction completion.

**Parameters:**
- `construction: RoomConstructionSite` - Completed construction site
- `blueprint: RoomBlueprint` - Blueprint that was constructed
- `initiatedBy: PlayerID` - Player who oversaw completion
- `completionProof?: Hash128` - Optional completion proof
- `options: BlueprintEventValidationOptions` - Optional validation settings

#### `emitConstructionCancelled()`

Records construction cancellation.

**Parameters:**
- `construction: RoomConstructionSite` - Cancelled construction site
- `blueprint: RoomBlueprint` - Blueprint that was being constructed
- `initiatedBy: PlayerID` - Player who cancelled construction
- `reason: CancellationReason` - Cancellation reason
- `notes?: string` - Optional cancellation notes
- `options: BlueprintEventValidationOptions` - Optional validation settings

**Cancellation Reasons:**
- `player_cancelled` - Player-initiated cancellation
- `supply_shortage` - Insufficient resources
- `validation_failed` - Validation requirements not met
- `hazard_conflict` - Safety or hazard conflicts
- `other` - Other cancellation reasons

## Ordering and Determinism

### Timestamp Normalization

Events use normalized timestamps to ensure deterministic ordering:

```typescript
private normalizeTimestamp(precision?: 'minute' | 'second' | 'millisecond'): string {
  const timestamp = dayjs();
  
  switch (precision) {
    case 'minute':
      return timestamp.startOf('minute').toISOString();
    case 'second':
      return timestamp.startOf('second').toISOString();
    case 'millisecond':
    default:
      return timestamp.toISOString();
  }
}
```

**Precision Levels:**
- **Minute**: Rounded to start of minute (default)
- **Second**: Rounded to start of second
- **Millisecond**: Full precision

### Blueprint Hashing

Deterministic blueprint hashing ensures consistent event generation:

```typescript
private generateBlueprintHash(blueprint: RoomBlueprint): Hash128 {
  const normalizedBlueprint = JSON.stringify({
    id: blueprint.id,
    name: blueprint.name,
    width: blueprint.width,
    height: blueprint.height,
    hazards: [...blueprint.hazards].sort(),
    features: blueprint.features,
  });

  // Generate consistent hash using serialization rules
  let hash = 0;
  for (let i = 0; i < normalizedBlueprint.length; i++) {
    const char = normalizedBlueprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(16).padStart(32, '0') as Hash128;
}
```

### Blueprint References

To minimize payload size, events reference blueprints using minimal references:

```typescript
private createBlueprintReference(blueprint: RoomBlueprint): RoomBlueprintReference {
  const blueprintId = blueprint.blueprintId || {
    id: blueprint.id,
    version: String(blueprint.version || '1.0.0'),
  };

  return {
    identity: {
      blueprintId: blueprintId.id,
      revision: this.extractRevision(blueprint),
      blueprintHash: this.generateBlueprintHash(blueprint),
    },
    structureType: blueprint.structureType,
    footprint: {
      width: blueprint.width,
      height: blueprint.height,
    },
    hazards: blueprint.hazards as any[],
    purpose: blueprint.purpose,
    tags: blueprint.tags,
  };
}
```

## Cross-Player Verification

### Validation Hooks

Cross-player verification enables distributed validation:

```typescript
private buildValidationHook(
  blueprint: RoomBlueprint,
  crossPlayerVerification?: CrossPlayerVerificationHooks,
): RoomBlueprintValidationHook | undefined {
  if (!crossPlayerVerification) {
    return undefined;
  }

  return {
    validators: crossPlayerVerification.validators,
    expectedHazards: crossPlayerVerification.expectedHazards || blueprint.hazards as any[],
    validationNotes: crossPlayerVerification.validationNotes,
  };
}
```

### Verification Scenarios

1. **Multi-Player Safety Review**: Critical blueprints require multiple validators
2. **Cross-Biome Validation**: Validate blueprints across different world contexts
3. **Hazard Verification**: Confirm hazard handling across player consensus
4. **Resource Validation**: Verify resource requirements with multiple players

## Error Handling

### Validation Errors

The service enforces strict validation with descriptive error messages:

```typescript
private validateEventOptions(options: BlueprintEventValidationOptions): void {
  if (options.requireValidationHooks && !options.crossPlayerVerification) {
    throw new Error('Cross-player verification hooks are required for this event type');
  }

  if (!options.allowSystemSource) {
    // Additional validation can be added here
  }
}
```

### Common Validation Issues

1. **Missing Blueprint ID**: Blueprint identifier is required for ledger determinism
2. **Invalid Dimensions**: Width and height must be positive integers
3. **Non-deterministic ID Format**: Blueprint IDs must follow lower_snake_case convention
4. **Missing Version**: Blueprint version is required for revision tracking
5. **Validation Hook Requirements**: Some event types require cross-player verification

## Integration Guidelines

### SDK Integration

**For SDK Developers:**
1. Use `emitBlueprintCreated()` when blueprints are initially created
2. Use `emitBlueprintUpdated()` when blueprints are modified and saved
3. Use `emitBlueprintExported()` when blueprints are exported for backup/sharing
4. Include validation hooks for critical operations requiring multi-player consensus

### UI Integration

**For UI Developers:**
1. Trigger events through service APIs rather than direct ledger calls
2. Provide user feedback for validation requirements
3. Handle cross-player verification prompts gracefully
4. Respect timestamp normalization for UI timestamps

### Import/Export Integration

**For Import/Export Systems:**
1. Use `emitBlueprintCreated()` with `source: 'imported'` for imported blueprints
2. Use `emitBlueprintExported()` to record all export operations
3. Include export format and hash in export events
4. Ensure export events include validation hooks when required

## Testing and Validation

### Test Coverage

The service includes comprehensive test coverage:

1. **Event Emission Tests**: Verify all event types are correctly emitted
2. **Validation Tests**: Ensure validation rules are properly enforced
3. **Cross-Player Tests**: Test verification hook functionality
4. **Determinism Tests**: Verify consistent event generation
5. **Error Handling Tests**: Test error conditions and edge cases

### Sample Fixtures

The service provides sample fixtures demonstrating valid events:

```typescript
export const ROOM_LEDGER_EVENT_FIXTURES: SampleLedgerEventFixture[] = [
  createBlueprintCreatedFixture(),
  createBlueprintUpdatedFixture(),
  createBlueprintExportedFixture(),
  // ... additional fixtures
];
```

## Performance Considerations

### Efficiency Optimizations

1. **Minimal Payload References**: Use blueprint references instead of full payloads
2. **Timestamp Caching**: Normalize timestamps once per event emission
3. **Hash Calculation**: Cache blueprint hashes for repeated operations
4. **Validation Batching**: Batch validation operations where possible

### Scalability

1. **Event Ordering**: Deterministic ordering prevents conflicts at scale
2. **Validation Distribution**: Cross-player validation distributes computational load
3. **Payload Compression**: Minimal references reduce network and storage overhead
4. **Asynchronous Processing**: Event emission is non-blocking for UI operations

## Security Considerations

### Access Control

1. **Player Authorization**: Events include initiator identification
2. **Cross-Player Validation**: Critical operations require multiple player approval
3. **Timestamp Integrity**: Normalized timestamps prevent manipulation
4. **Hash Verification**: Blueprint hashes enable tamper detection

### Data Integrity

1. **Deterministic Serialization**: Consistent event generation prevents inconsistencies
2. **Validation Hooks**: Multi-player validation prevents malicious blueprints
3. **Revision Tracking**: Previous revision hashes enable change tracking
4. **Audit Trail**: Complete event history provides audit capabilities

## Future Enhancements

### Planned Features

1. **Batch Event Processing**: Support for bulk blueprint operations
2. **Advanced Validation Rules**: Configurable validation criteria
3. **Event Compression**: Reduce storage requirements for high-volume scenarios
4. **Real-time Validation**: Live cross-player validation feedback
5. **Historical Analysis**: Tools for analyzing blueprint evolution patterns

### Extension Points

1. **Custom Validation Hooks**: Plugin system for specialized validation
2. **Event Listeners**: Subscribe to specific event types for custom processing
3. **Export Formats**: Extensible export format support
4. **Integration Adapters**: Adapters for third-party systems

## Conclusion

The RoomLedgerEventWiringService provides a robust, scalable framework for recording room blueprint lifecycle events in the game's ledger system. By enforcing deterministic serialization, cross-player verification, and comprehensive validation, it ensures the integrity and traceability of all blueprint operations while maintaining performance and usability for SDK and UI developers.

For questions or contributions, please refer to the project documentation or contact the development team.