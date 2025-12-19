# Room Blueprint Validation Service Documentation

**Status:** ✅ COMPLETED - Structural fidelity achieved  
**Implementation Date:** 2025-12-19  
**Related Files:** `v1/src/app/services/room-blueprint-validation.service.ts`, `v1/src/app/services/room-blueprint-validation.service.spec.ts`

## Overview

The Room Blueprint Validation Service provides comprehensive validation for room blueprints, enforcing dimension bounds, required fields, hazard logic, and structural integrity. It produces deterministic validation results with clear error and warning messages suitable for consumption by the editor UI and import/export flows.

## Core Functionality

### Primary Validation Methods

#### `validateBlueprint(blueprint, options?)`

Validates a single room blueprint and returns structured validation results.

**Parameters:**
- `blueprint` (RoomBlueprint): The blueprint to validate
- `options` (RoomBlueprintValidationOptions, optional): Validation configuration options

**Returns:** `RoomBlueprintValidationResult`
- `blueprintId`: ID of the validated blueprint
- `blueprintName`: Name of the validated blueprint
- `notices`: Array of validation notices with severity levels

**Example:**
```typescript
import { RoomBlueprintValidationService } from './services/room-blueprint-validation.service';

const service = new RoomBlueprintValidationService();
const blueprint: RoomBlueprint = {
  id: 'workshop_01',
  name: 'Basic Workshop',
  purpose: 'Crafting and repair',
  width: 20,
  height: 15,
  hazards: [HazardType.Fire],
  features: ['Workbench', 'Tool storage']
};

const result = service.validateBlueprint(blueprint);

if (result.notices.length === 0) {
  console.log('Blueprint is valid');
} else {
  console.log('Validation issues found:');
  result.notices.forEach(notice => {
    console.log(`${notice.severity.toUpperCase()}: ${notice.message}`);
  });
}
```

#### `validateBlueprints(blueprints, options?)`

Validates multiple room blueprints in batch, with cross-reference validation.

**Parameters:**
- `blueprints` (RoomBlueprint[]): Array of blueprints to validate
- `options` (RoomBlueprintValidationOptions, optional): Validation configuration options

**Returns:** `RoomBlueprintValidationResult[]`

**Example:**
```typescript
const blueprints = [blueprint1, blueprint2, blueprint3];
const results = service.validateBlueprints(blueprints);

results.forEach((result, index) => {
  console.log(`Blueprint ${index + 1} (${result.blueprintId}):`);
  if (result.notices.length === 0) {
    console.log('  ✓ Valid');
  } else {
    result.notices.forEach(notice => {
      console.log(`  ${notice.severity}: ${notice.message}`);
    });
  }
});
```

### Validation Options

#### `RoomBlueprintValidationOptions`

```typescript
export interface RoomBlueprintValidationOptions {
  hazardVocabulary?: RoomHazard[];
  socketKinds?: RoomSocketKind[];
  knownBlueprintIds?: ReadonlySet<ID> | ID[];
  enforceUniqueBlueprintIds?: boolean;
  width?: number;
  height?: number;
  purpose?: string;
  hazards?: RoomHazardType[];
  features?: string[];
  structureType?: StructureType;
  anchor?: Position;
  metadata?: Record<string, unknown>;
  version?: number;
}
```

**Usage Examples:**
```typescript
// Validate against specific hazard vocabulary
const options = {
  hazardVocabulary: [HazardType.Fire, HazardType.Flood, HazardType.Electrical]
};

// Validate with custom socket kinds
const options = {
  socketKinds: ['power', 'data', 'structural', 'fluid', 'custom_kind']
};

// Validate blueprints with known IDs for cross-reference
const options = {
  knownBlueprintIds: ['workshop_01', 'storage_02', 'lab_03']
};

// Disable duplicate ID enforcement
const options = {
  enforceUniqueBlueprintIds: false
};
```

## Validation Rules

### Identity Validation

#### Required Fields
- **ID**: Must be non-empty string for deterministic references
- **Name**: Must be non-empty string (minimum 3 characters recommended)
- **Purpose**: Must be non-empty string describing intended use

#### Name Quality Checks
- **Short names**: Warnings for names less than 3 characters
- **Whitespace**: Warnings for leading/trailing whitespace (suggests auto-trimming)

### Dimension Validation

#### Bounds Enforcement
- **Minimum**: 16×16 (width and height must be ≥ 16)
- **Maximum**: 512×512 (width and height must be ≤ 512)
- **Type**: Width and height must be finite numbers and integers

#### Dimension Rules
```typescript
// Valid dimensions
width: 16, height: 16     // Minimum boundary
width: 256, height: 256   // Typical size
width: 512, height: 512   // Maximum boundary

// Invalid dimensions
width: 15,  height: 16    // Below minimum
width: 256, height: 513   // Above maximum
width: 10.5, height: 16   // Non-integer
width: Infinity, height: 16  // Non-finite
```

### Features Validation

#### Feature Requirements
- **Minimum count**: At least one feature required
- **Content quality**: Empty features generate warnings
- **Whitespace**: Features with leading/trailing whitespace generate warnings

#### Feature Rules
```typescript
// Valid features
features: ['Workbench', 'Tool storage', 'Good lighting']

// Invalid features
features: []                    // No features - ERROR
features: ['', '  ', 'Valid']   // Empty entries - WARNING
features: ['  Tool  ', 'Light'] // Whitespace - WARNING
```

### Hazards Validation

#### Hazard Constraints
- **Vocabulary validation**: Hazards must be in provided vocabulary (if specified)
- **Duplicate detection**: Warning for duplicate hazard entries
- **Type checking**: Hazard types must be valid `HazardType` enum values

#### Hazard Rules
```typescript
// Valid hazards
hazards: [HazardType.Fire, HazardType.Electrical]

// Invalid hazards
hazards: ['fire', 'electrical']           // String values - depends on vocabulary
hazards: [HazardType.Fire, HazardType.Fire]  // Duplicates - WARNING
hazards: ['nonexistent_hazard']           // Unknown type - ERROR (if vocabulary specified)
```

### Sockets Validation

#### Socket Requirements
- **ID uniqueness**: Socket IDs must be unique within blueprint
- **Position bounds**: Socket positions must be within room dimensions
- **Coordinate validation**: X and Y coordinates must be finite numbers
- **Kind validation**: Socket kinds must be in supported set (if specified)

#### Socket Types Supported
```typescript
// RoomSocket format
{
  id: 'main_door',
  kind: 'structural',
  position: { x: 5, y: 0 },
  label: 'Main entrance'
}

// AdvancedRoomSocket format
{
  socketId: 'power_main',
  type: RoomSocketType.Power,
  position: { x: 10, y: 5 },
  orientation: 'east',
  required: true
}
```

#### Socket Validation Rules
```typescript
// Valid socket
{
  id: 'unique_socket',
  kind: 'power',
  position: { x: 5, y: 5 }
}

// Invalid sockets
{
  id: '',                          // Empty ID - ERROR
  kind: 'power',
  position: { x: 5, y: 5 }
}

{
  id: 'duplicate_id',             // Duplicate ID - ERROR
  kind: 'power',
  position: { x: 5, y: 5 }
}

{
  id: 'out_of_bounds',
  kind: 'power',
  position: { x: 25, y: 5 }       // X out of bounds - ERROR (if width=20)
}
```

### Prerequisites Validation

#### Prerequisite Structure
- **ID requirement**: Each prerequisite must have a unique ID
- **Blueprint references**: Referenced blueprints must exist (if known IDs provided)
- **Socket references**: Referenced sockets must exist within the blueprint

#### Prerequisite Rules
```typescript
// Valid prerequisite
{
  id: 'power_req',
  requiresBlueprintId: 'power_plant_01',
  requiresSockets: ['main_power', 'backup_power'],
  description: 'Requires main power connection'
}

// Invalid prerequisites
{
  id: '',                          // Empty ID - ERROR
  requiresBlueprintId: 'missing',
  description: 'Requires missing blueprint' - ERROR (if known IDs provided)
}

{
  id: 'socket_req',
  requiresSockets: ['nonexistent_socket'],  // ERROR - socket doesn't exist
  description: 'Requires missing socket'
}
```

## Validation Notice Structure

### `ValidationNotice`

```typescript
export interface ValidationNotice {
  path: string;           // Field path where issue occurred
  message: string;        // Descriptive error/warning message
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;    // Optional suggestion for resolution
  code?: string;          // Optional error code
}
```

### Notice Path Examples

| Field | Path | Example Notice |
|-------|------|----------------|
| Name | `name` | "Room name is required" |
| Width | `dimensions.width` | "Width must be an integer" |
| Feature[2] | `features[2]` | "Feature has leading or trailing whitespace" |
| Socket[1] Position | `sockets[1].position` | "Socket position must include numeric coordinates" |
| Hazard[0] | `hazards[0]` | "Unknown hazard type" |
| Prerequisites[0] ID | `prerequisites[0].id` | "Prerequisite id is required" |

## Severity Levels

### Error (Blocking)
- **Required fields missing**: ID, name, purpose, features
- **Invalid data types**: Non-integer dimensions, invalid coordinates
- **Out of bounds**: Dimensions below minimum or above maximum
- **Structural issues**: Duplicate IDs, missing references

### Warning (Non-blocking)
- **Quality issues**: Short names, whitespace, empty features
- **Best practices**: Missing sockets, duplicate hazards
- **Minor issues**: Unknown socket kinds (if vocabulary specified)

### Info (Informational)
- **Future compatibility**: Reserved for future use
- **Performance hints**: Currently not used

## Deterministic Ordering

The service ensures consistent validation result ordering for identical inputs:

### Ordering Rules
1. **Severity first**: Errors → Warnings → Info
2. **Path second**: Alphabetical by field path
3. **Message third**: Alphabetical by message content

**Example ordering:**
```typescript
[
  { path: 'dimensions.width', severity: 'error', message: 'Width must be an integer' },
  { path: 'features', severity: 'error', message: 'At least one feature is required' },
  { path: 'name', severity: 'warning', message: 'Room name has leading whitespace' },
  { path: 'sockets', severity: 'warning', message: 'No sockets defined' }
]
```

## Integration Patterns

### With Editor UI

```typescript
export class BlueprintEditorComponent {
  private validationService: RoomBlueprintValidationService;
  
  onBlueprintChange(blueprint: RoomBlueprint): void {
    const result = this.validationService.validateBlueprint(blueprint);
    
    // Update UI with validation feedback
    this.displayValidationErrors(result.notices);
    
    // Enable/disable save based on errors
    this.saveButton.disabled = result.notices.some(n => n.severity === 'error');
  }
  
  private displayValidationErrors(notices: ValidationNotice[]): void {
    notices.forEach(notice => {
      this.showNotice(notice.path, notice.message, notice.severity, notice.suggestion);
    });
  }
}
```

### With Import/Export Service

```typescript
export class BlueprintImportComponent {
  private validationService: RoomBlueprintValidationService;
  private importService: RoomBlueprintImportExportService;
  
  async onImportFile(file: File): Promise<void> {
    try {
      const content = await file.text();
      const importResult = this.importService.importRoomBlueprint(content);
      
      // Validate imported blueprint
      const validationResult = this.validationService.validateBlueprint(importResult.blueprint);
      
      if (validationResult.notices.length > 0) {
        this.showValidationDialog(validationResult.notices);
        return;
      }
      
      this.acceptImportedBlueprint(importResult.blueprint);
    } catch (error) {
      this.showImportError(error);
    }
  }
}
```

### Batch Validation Pipeline

```typescript
export class BlueprintValidationPipeline {
  constructor(
    private validationService: RoomBlueprintValidationService,
    private importService: RoomBlueprintImportExportService
  ) {}
  
  async validateBlueprintFiles(files: File[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    for (const file of files) {
      try {
        // Import to normalize and validate structure
        const importResult = this.importService.importRoomBlueprint(await file.text());
        
        // Perform additional validation
        const validationResult = this.validationService.validateBlueprint(importResult.blueprint);
        
        results.push({
          fileName: file.name,
          blueprintId: importResult.blueprint.id,
          isValid: validationResult.notices.length === 0,
          notices: validationResult.notices
        });
      } catch (error) {
        results.push({
          fileName: file.name,
          blueprintId: 'unknown',
          isValid: false,
          notices: [{
            path: 'import',
            message: `Failed to import: ${error.message}`,
            severity: 'error'
          }]
        });
      }
    }
    
    return results;
  }
}
```

## Best Practices

### 1. Always Validate Before Processing
```typescript
// Good - validate before using blueprint
const result = service.validateBlueprint(blueprint);
if (result.notices.some(n => n.severity === 'error')) {
  console.error('Cannot process invalid blueprint');
  return;
}
processBlueprint(blueprint);

// Bad - processing without validation
processBlueprint(blueprint); // May fail with unclear errors
```

### 2. Handle Validation Results Appropriately
```typescript
// Good - separate error and warning handling
const errors = result.notices.filter(n => n.severity === 'error');
const warnings = result.notices.filter(n => n.severity === 'warning');

if (errors.length > 0) {
  displayErrors(errors);
  return; // Don't proceed with errors
}

if (warnings.length > 0) {
  displayWarnings(warnings); // Show warnings but continue
}

// Bad - treating all notices the same
if (result.notices.length > 0) {
  displayAllNotices(result.notices);
}
```

### 3. Use Appropriate Validation Options
```typescript
// Good - provide context for better validation
const options = {
  hazardVocabulary: availableHazards,
  socketKinds: supportedSockets,
  knownBlueprintIds: existingBlueprints
};
const result = service.validateBlueprint(blueprint, options);

// Bad - validating without context
const result = service.validateBlueprint(blueprint);
```

### 4. Leverage Batch Validation for Multiple Blueprints
```typescript
// Good - efficient batch processing
const results = service.validateBlueprints(blueprints);
const validBlueprints = blueprints.filter((bp, index) => 
  results[index].notices.length === 0
);

// Bad - individual processing
const validBlueprints = [];
for (const blueprint of blueprints) {
  const result = service.validateBlueprint(blueprint);
  if (result.notices.length === 0) {
    validBlueprints.push(blueprint);
  }
}
```

## Common Validation Scenarios

### Scenario 1: Basic Blueprint Validation
```typescript
const blueprint: RoomBlueprint = {
  id: 'workshop_basic',
  name: 'Basic Workshop',
  purpose: 'Crafting and repair',
  width: 20,
  height: 15,
  hazards: [HazardType.Fire],
  features: ['Workbench', 'Tool storage']
};

const result = service.validateBlueprint(blueprint);
// Expected: No notices (valid blueprint)
```

### Scenario 2: Missing Required Fields
```typescript
const blueprint = {
  id: '',
  name: '',
  purpose: '',
  width: 20,
  height: 15,
  hazards: [],
  features: []
};

const result = service.validateBlueprint(blueprint);
// Expected: Errors for id, name, purpose, features
```

### Scenario 3: Invalid Dimensions
```typescript
const blueprint = {
  id: 'invalid_dims',
  name: 'Invalid Dimensions',
  purpose: 'Testing',
  width: 10,    // Below minimum
  height: 1000, // Above maximum
  hazards: [],
  features: ['Test feature']
};

const result = service.validateBlueprint(blueprint);
// Expected: Errors for both dimensions
```

### Scenario 4: Duplicate IDs in Batch
```typescript
const blueprints = [
  { id: 'workshop', name: 'Workshop', purpose: 'Crafting', width: 20, height: 15, hazards: [], features: ['Workbench'] },
  { id: 'workshop', name: 'Workshop Copy', purpose: 'Crafting', width: 20, height: 15, hazards: [], features: ['Workbench'] }
];

const results = service.validateBlueprints(blueprints);
// Expected: Duplicate ID error on second blueprint
```

## Error Messages Reference

### Identity Errors
| Message | Path | Description |
|---------|------|-------------|
| "Blueprint id is required for deterministic references" | `id` | ID field is empty |
| "Room name is required" | `name` | Name field is empty |
| "Room purpose is required" | `purpose` | Purpose field is empty |
| "Room name is very short; minimum length is 3 characters" | `name` | Name less than 3 chars |
| "Room name has leading or trailing whitespace" | `name` | Name has whitespace |

### Dimension Errors
| Message | Path | Description |
|---------|------|-------------|
| "Width must be a finite number" | `dimensions.width` | Width is NaN or Infinity |
| "Height must be a finite number" | `dimensions.height` | Height is NaN or Infinity |
| "Width must be an integer" | `dimensions.width` | Width has decimal places |
| "Height must be an integer" | `dimensions.height` | Height has decimal places |
| "Width X is below the minimum of 16" | `dimensions.width` | Width < 16 |
| "Height X is below the minimum of 16" | `dimensions.height` | Height < 16 |
| "Width X exceeds the maximum of 512" | `dimensions.width` | Width > 512 |
| "Height X exceeds the maximum of 512" | `dimensions.height` | Height > 512 |

### Features Errors
| Message | Path | Description |
|---------|------|-------------|
| "At least one feature is required for a blueprint" | `features` | Empty features array |
| "Feature entry is empty" | `features[i]` | Feature string is empty/whitespace |
| "Feature has leading or trailing whitespace" | `features[i]` | Feature has whitespace |
| "All feature entries are empty after trimming" | `features` | All features empty after trim |

### Hazards Warnings
| Message | Path | Description |
|---------|------|-------------|
| "Hazard 'X' is listed multiple times" | `hazards` | Duplicate hazard detected |
| "'X' is not in the provided hazard vocabulary" | `hazards[i]` | Unknown hazard type |

### Socket Errors
| Message | Path | Description |
|---------|------|-------------|
| "No sockets defined; placement and connections may be ambiguous" | `sockets` | Empty sockets array |
| "Socket id is required" | `sockets[i].id` | Empty socket ID |
| "Socket id 'X' is duplicated" | `sockets[i].id` | Duplicate socket ID |
| "Socket kind is missing" | `sockets[i].kind` | Empty socket kind |
| "Socket position must include numeric x and y coordinates" | `sockets[i].position` | Invalid position object |
| "Socket 'X' lies outside the width bounds" | `sockets[i].position.x` | X coordinate out of bounds |
| "Socket 'X' lies outside the height bounds" | `sockets[i].position.y` | Y coordinate out of bounds |

## Testing

The service includes comprehensive unit tests covering:

- ✅ Identity validation (ID, name, purpose)
- ✅ Dimension validation (bounds, types)
- ✅ Features validation (requirements, quality)
- ✅ Hazards validation (vocabulary, duplicates)
- ✅ Sockets validation (structure, positions, uniqueness)
- ✅ Prerequisites validation (references, uniqueness)
- ✅ Batch validation with duplicate detection
- ✅ Deterministic ordering verification
- ✅ Edge cases and null/undefined handling

Run tests with:
```bash
npm test -- --include='**/room-blueprint-validation.service.spec.ts'
```

## Conclusion

The Room Blueprint Validation Service provides a robust, deterministic validation framework for room blueprints. It ensures data integrity while providing clear, actionable feedback for both automated systems and human users. The service integrates seamlessly with other SDK components and maintains consistency across the entire blueprint management workflow.