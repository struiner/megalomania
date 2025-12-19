# Room World Context Validation Service Documentation

**Status:** ✅ COMPLETED - Structural fidelity achieved  
**Implementation Date:** 2025-12-19  
**Related Files:** `v1/src/app/services/room-world-context-validation.service.ts`, `v1/src/app/services/room-world-context-validation.service.spec.ts`

## Overview

The Room World Context Validation Service provides cross-validation between room blueprints and world context data (biomes, settlement types, structure types). It ensures hazards, purposes, and dimensions remain coherent with world truths using authoritative enums to prevent drift.

## Core Functionality

### Primary Validation Method

#### `validatePlacement(blueprint, context)`

Validates room blueprint placement against world context data and returns context-aware notices.

**Parameters:**
- `blueprint` (RoomBlueprint): The room blueprint to validate
- `context` (RoomWorldContext): World context data including biome, settlement type, and structure type

**Returns:** `RoomWorldValidationResult`
- `notices`: Array of context notices with severity levels and diagnostic information

**Example:**
```typescript
import { RoomWorldContextValidationService } from './services/room-world-context-validation.service';

const service = new RoomWorldContextValidationService();

const blueprint: RoomBlueprint = {
  id: 'underwater_lab',
  name: 'Underwater Research Lab',
  purpose: 'Marine biology research',
  width: 24,
  height: 16,
  hazards: [HazardType.Pressure, HazardType.Corrosion],
  features: ['Sealed chambers', 'Sample analysis equipment']
};

const context: RoomWorldContext = {
  biome: Biome.Ocean,
  settlementType: SettlementType.UndergroundCity,
  structureType: StructureType.Laboratory
};

const result = service.validatePlacement(blueprint, context);

if (result.notices.length === 0) {
  console.log('Blueprint is contextually appropriate');
} else {
  console.log('Context issues found:');
  result.notices.forEach(notice => {
    console.log(`${notice.severity.toUpperCase()}: ${notice.message}`);
  });
}
```

## Context Validation Rules

### Structure-Biome Compatibility

#### Water-Dependent Structures
Water-dependent structures (docks, harbors, lighthouses, fisheries) must be placed in water biomes (Ocean, Water, Beach).

```typescript
// Valid placement
const context = {
  biome: Biome.Ocean,
  structureType: StructureType.Harbor
};

// Invalid placement - generates 'structure-biome-mismatch' warning
const context = {
  biome: Biome.Desert,
  structureType: StructureType.Harbor
};
```

#### Mine Flooding Risk
Mines placed in water biomes generate informational notices about constant flooding pressure.

```typescript
const context = {
  biome: Biome.Ocean,
  structureType: StructureType.Mine
};
// Generates: 'Mine-adjacent rooms near coastlines will face constant flooding pressure'
```

### Hazard-Biome Alignment

#### Vacuum Mitigation Constraints
Vacuum hazards are only appropriate in specific biome contexts:
- **Limited to:** Beach, Ocean, Water, Alpine, AlpineGrassland, Rock
- **Warning generated** when used in other biomes

```typescript
// Valid vacuum hazard context
const context = {
  biome: Biome.Alpine,
  hazards: [HazardType.Vacuum]
};

// Invalid vacuum hazard context - generates warning
const context = {
  biome: Biome.Forest,
  hazards: [HazardType.Vacuum]
};
```

#### Flood vs Arid Biome Mismatch
Flood hazards in arid biomes generate informational notices about suboptimal hazard selection.

```typescript
const context = {
  biome: Biome.Desert,
  hazards: [HazardType.Flood]
};
// Generates: 'Floodproofing is rarely needed in arid biomes'
```

#### Fire vs Water Biome Mismatch
Fire hazards in water biomes generate informational notices about low-probability scenarios.

```typescript
const context = {
  biome: Biome.Ocean,
  hazards: [HazardType.Fire]
};
// Generates: 'Open water biomes make fire a low-probability hazard'
```

### Hazard-Settlement Alignment

#### Vacuum in Sealed Settlements
Vacuum hazards are only appropriate in sealed settlements:
- **Allowed settlements:** FloatingCity, PhasingCity, UndergroundCity
- **Warning generated** when used in surface settlements

```typescript
// Valid vacuum hazard settlement
const context = {
  settlementType: SettlementType.UndergroundCity,
  hazards: [HazardType.Vacuum]
};

// Invalid vacuum hazard settlement - generates warning
const context = {
  settlementType: SettlementType.Hamlet,
  hazards: [HazardType.Vacuum]
};
```

#### Electrical Hazards in Low-Tech Settlements
Electrical hazards in low-tech settlements generate informational notices about infrastructure assumptions.

```typescript
const context = {
  settlementType: SettlementType.Hamlet,
  hazards: [HazardType.Electrical]
};
// Generates: 'Electrical hazards assume stable grids. Low-tech settlements rarely sustain them'
```

#### Intrusion in Fortified Settlements
Intrusion countermeasures are most effective in fortified settlements.

```typescript
const context = {
  settlementType: SettlementType.Capital,
  hazards: [HazardType.Intrusion]
};
// Generates: 'Intrusion countermeasures shine in fortified capitals or strongholds'
```

### Room Scale Validation

#### Settlement Area Ceilings
Room sizes are validated against settlement type scale constraints:

| Settlement Type | Area Ceiling | Tolerance (115%) |
|-----------------|--------------|------------------|
| Hamlet | 96 tiles | 110 tiles |
| Village | 144 tiles | 165 tiles |
| Trading Post | 160 tiles | 184 tiles |
| Tribe | 120 tiles | 138 tiles |
| Town | 220 tiles | 253 tiles |
| City | 320 tiles | 368 tiles |
| Metropolis | 420 tiles | 483 tiles |
| Capital | 512 tiles | 588 tiles |
| Fortress | 260 tiles | 299 tiles |
| Trade Hub | 260 tiles | 299 tiles |
| Lighthouse | 120 tiles | 138 tiles |
| Ruins | 200 tiles | 230 tiles |
| Ancient Ruins | 220 tiles | 253 tiles |
| Underground City | 320 tiles | 368 tiles |
| Floating City | 320 tiles | 368 tiles |
| Phasing City | 320 tiles | 368 tiles |

```typescript
const blueprint = {
  width: 40,
  height: 12,  // 480 tiles total
  // ...
};

const context = {
  settlementType: SettlementType.Village  // 144 tile ceiling
};

// Generates: 'Room area 480 exceeds the Village scale guardrail (144)'
```

## Notice Structure

### `RoomContextNotice`

```typescript
export interface RoomContextNotice {
  code: string;                    // Unique error/warning code
  severity: 'info' | 'warning';    // Notice severity level
  message: string;                 // Descriptive message
  context: Partial<RoomWorldContext>; // Context data that triggered notice
}
```

### Notice Codes Reference

| Code | Severity | Description |
|------|----------|-------------|
| `structure-biome-mismatch` | warning | Structure type incompatible with biome |
| `structure-biome-flooding` | info | Mine near water bodies faces flooding risk |
| `hazard-biome-vacuum` | warning | Vacuum hazard inappropriate for biome |
| `hazard-biome-arid` | info | Flood hazard suboptimal in arid biomes |
| `hazard-biome-water` | info | Fire hazard low-probability in water biomes |
| `hazard-settlement-vacuum` | warning | Vacuum hazard requires sealed settlement |
| `hazard-settlement-electrical` | info | Electrical hazard mismatched with settlement tech level |
| `hazard-settlement-intrusion` | info | Intrusion countermeasures optimal for fortified settlements |
| `room-size-out-of-scale` | warning | Room exceeds settlement scale limits |
| `room-size-near-limit` | info | Room approaches settlement scale limits |

## Severity Levels

### Warning (Action Required)
- **Structure-biome mismatches**: Water-dependent structures on land
- **Scale violations**: Rooms too large for settlement type
- **Critical hazard mismatches**: Vacuum hazards in inappropriate contexts

### Info (Advisory)
- **Suboptimal selections**: Hazard choices that work but aren't ideal
- **Scale approaching limits**: Rooms near but not exceeding scale limits
- **Contextual advice**: Suggestions for better hazard/structure alignment

## Deterministic Ordering

The service ensures consistent validation result ordering for identical inputs:

### Ordering Rules
1. **Severity first**: Warnings → Info
2. **Code second**: Alphabetical by notice code
3. **Message third**: Alphabetical by message content

**Example ordering:**
```typescript
[
  { code: 'hazard-biome-vacuum', severity: 'warning', message: '...' },
  { code: 'hazard-settlement-vacuum', severity: 'warning', message: '...' },
  { code: 'room-size-near-limit', severity: 'info', message: '...' }
]
```

## Integration Patterns

### With Room Blueprint Editor

```typescript
export class BlueprintEditorComponent {
  private contextValidation: RoomWorldContextValidationService;
  
  onContextChange(context: RoomWorldContext): void {
    const result = this.contextValidation.validatePlacement(this.currentBlueprint, context);
    
    // Display context-specific warnings
    this.displayContextNotices(result.notices);
    
    // Highlight problematic blueprint elements
    this.highlightMismatchedHazards(result.notices);
  }
  
  private displayContextNotices(notices: RoomContextNotice[]): void {
    notices.forEach(notice => {
      this.showContextWarning(notice.code, notice.message, notice.severity);
    });
  }
}
```

### With Import/Export Service

```typescript
export class BlueprintImportComponent {
  private contextValidation: RoomWorldContextValidationService;
  
  onImportBlueprint(blueprint: RoomBlueprint, worldContext: RoomWorldContext): void {
    // Standard validation first
    const structuralResult = this.validationService.validateBlueprint(blueprint);
    
    // Context validation second
    const contextResult = this.contextValidation.validatePlacement(blueprint, worldContext);
    
    // Combine results
    const combinedNotices = [
      ...structuralResult.notices,
      ...contextResult.notices.map(notice => ({
        path: 'context',
        message: notice.message,
        severity: notice.severity === 'warning' ? 'warning' : 'info',
        suggestion: this.getContextSuggestion(notice.code)
      }))
    ];
    
    this.displayCombinedValidation(combinedNotices);
  }
  
  private getContextSuggestion(code: string): string {
    const suggestions: Record<string, string> = {
      'hazard-biome-vacuum': 'Consider pressure or intrusion hazards instead',
      'room-size-out-of-scale': 'Split into multiple rooms or target larger settlement',
      'structure-biome-mismatch': 'Relocate to appropriate biome or change structure type'
    };
    return suggestions[code] || 'Review context alignment';
  }
}
```

### With World Generator

```typescript
export class WorldGenerator {
  private contextValidation: RoomWorldContextValidationService;
  
  validateRoomPlacement(blueprint: RoomBlueprint, worldCell: WorldCell): ValidationResult {
    const context = this.deriveContextFromWorldCell(worldCell);
    const result = this.contextValidation.validatePlacement(blueprint, context);
    
    return {
      isValid: !result.notices.some(n => n.severity === 'warning'),
      notices: result.notices,
      suggestedAlternatives: this.generateAlternatives(result.notices, blueprint)
    };
  }
  
  private generateAlternatives(notices: RoomContextNotice[], blueprint: RoomBlueprint): RoomBlueprint[] {
    const alternatives: RoomBlueprint[] = [];
    
    notices.forEach(notice => {
      switch (notice.code) {
        case 'hazard-biome-vacuum':
          alternatives.push({
            ...blueprint,
            hazards: blueprint.hazards.filter(h => h !== HazardType.Vacuum)
              .concat([HazardType.Pressure, HazardType.Intrusion])
          });
          break;
          
        case 'room':
          // Suggest splitting into smaller rooms
          const area = blueprint.width * blueprint.height;
         -size-out-of-scale const suggestedSize = Math.floor(Math.sqrt(area / 2));
          alternatives.push({
            ...blueprint,
            width: suggestedSize,
            height: suggestedSize
          });
          break;
      }
    });
    
    return alternatives;
  }
}
```

## Best Practices

### 1. Validate Context Early
```typescript
// Good - validate context before processing
const contextResult = this.contextValidation.validatePlacement(blueprint, context);
if (contextResult.notices.some(n => n.severity === 'warning')) {
  this.requestContextAdjustment(blueprint, context);
  return;
}

// Bad - processing without context validation
processBlueprint(blueprint); // May result in implausible placements
```

### 2. Provide Contextual Suggestions
```typescript
// Good - offer specific alternatives
const result = this.contextValidation.validatePlacement(blueprint, context);
result.notices.forEach(notice => {
  this.displayNoticeWithAlternatives(notice, this.getAlternativesForNotice(notice));
});

// Bad - showing notices without guidance
result.notices.forEach(notice => this.displayNotice(notice.message));
```

### 3. Handle Scale Constraints Proactively
```typescript
// Good - check scale before placement
const area = blueprint.width * blueprint.height;
const maxArea = this.getMaxAreaForSettlement(settlementType);

if (area > maxArea * 1.15) {
  this.suggestRoomSplit(blueprint, settlementType);
  return;
}

// Bad - letting validation catch scale issues
const result = this.contextValidation.validatePlacement(blueprint, context);
// Now user needs to resize manually
```

### 4. Use Deterministic Validation
```typescript
// Good - cache validation results for identical inputs
const cacheKey = this.generateCacheKey(blueprint, context);
if (this.validationCache.has(cacheKey)) {
  return this.validationCache.get(cacheKey);
}

const result = this.contextValidation.validatePlacement(blueprint, context);
this.validationCache.set(cacheKey, result);
return result;

// Bad - repeated validation of same inputs
const result = this.contextValidation.validatePlacement(blueprint, context);
```

## Common Validation Scenarios

### Scenario 1: Underwater Research Facility
```typescript
const blueprint = {
  id: 'underwater_research',
  name: 'Underwater Research Lab',
  purpose: 'Marine biology research',
  width: 32,
  height: 20,
  hazards: [HazardType.Pressure, HazardType.Corrosion],
  features: ['Sealed chambers', 'Sample analysis equipment']
};

const context = {
  biome: Biome.Ocean,
  settlementType: SettlementType.UndergroundCity,
  structureType: StructureType.Laboratory
};

const result = service.validatePlacement(blueprint, context);
// Expected: No notices (appropriate context alignment)
```

### Scenario 2: Surface Settlement with Inappropriate Hazards
```typescript
const blueprint = {
  id: 'surface_vacuum_lab',
  name: 'Vacuum Lab',
  purpose: 'Physics research',
  width: 24,
  height: 16,
  hazards: [HazardType.Vacuum],
  features: ['Vacuum chambers', 'Particle accelerators']
};

const context = {
  biome: Biome.Grassland,
  settlementType: SettlementType.Hamlet,
  structureType: StructureType.Laboratory
};

const result = service.validatePlacement(blueprint, context);
// Expected: 
// - 'hazard-biome-vacuum' (warning)
// - 'hazard-settlement-vacuum' (warning)
```

### Scenario 3: Oversized Room for Settlement Type
```typescript
const blueprint = {
  id: 'massive_hangar',
  name: 'Massive Aircraft Hangar',
  purpose: 'Aircraft storage and maintenance',
  width: 80,
  height: 60,  // 4800 tiles
  hazards: [HazardType.Fire],
  features: ['Aircraft parking', 'Maintenance bays', 'Control tower']
};

const context = {
  biome: Biome.Grassland,
  settlementType: SettlementType.Village,  // 144 tile ceiling
  structureType: StructureType.Hangar
};

const result = service.validatePlacement(blueprint, context);
// Expected: 'room-size-out-of-scale' (warning)
```

### Scenario 4: Coastal Structure Misplacement
```typescript
const blueprint = {
  id: 'harbor_facility',
  name: 'Harbor Management',
  purpose: 'Maritime logistics',
  width: 20,
  height: 12,
  hazards: [HazardType.Storm],
  features: ['Cargo handling', 'Administrative offices']
};

const context = {
  biome: Biome.Mountain,
  settlementType: SettlementType.Town,
  structureType: StructureType.Harbor
};

const result = service.validatePlacement(blueprint, context);
// Expected: 'structure-biome-mismatch' (warning)
```

## Error Handling

### Graceful Degradation
```typescript
validatePlacementWithFallback(blueprint: RoomBlueprint, context: RoomWorldContext): RoomWorldValidationResult {
  try {
    return this.contextValidation.validatePlacement(blueprint, context);
  } catch (error) {
    // Fallback to basic validation if context validation fails
    console.warn('Context validation failed, using fallback:', error);
    return {
      notices: [{
        code: 'validation-fallback',
        severity: 'warning',
        message: 'Context validation unavailable - manual review recommended',
        context: {}
      }]
    };
  }
}
```

### Partial Context Handling
```typescript
// Handle cases where not all context data is available
const result = this.contextValidation.validatePlacement(blueprint, {
  biome: context.biome,        // May be undefined
  settlementType: context.settlementType,  // May be undefined
  structureType: context.structureType     // May be undefined
});

// Service gracefully handles missing context data
// Only validates against provided context elements
```

## Testing

The service includes comprehensive unit tests covering:

- ✅ Structure-biome compatibility validation
- ✅ Hazard-biome alignment validation
- ✅ Hazard-settlement alignment validation
- ✅ Room scale validation against settlement constraints
- ✅ Deterministic ordering verification
- ✅ Edge cases and null/undefined handling
- ✅ Context normalization and type safety

Run tests with:
```bash
npm test -- --include='**/room-world-context-validation.service.spec.ts'
```

## Conclusion

The Room World Context Validation Service ensures room blueprints maintain coherence with world truths while providing clear, actionable feedback. It enables SDK tools to surface context warnings without owning world truth data, supporting the structural fidelity requirements of the UI & Ergonomics Charter.