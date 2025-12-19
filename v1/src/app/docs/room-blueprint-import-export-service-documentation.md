# Room Blueprint Import/Export Service Documentation

**Status:** ✅ COMPLETED - Structural fidelity achieved  
**Implementation Date:** 2025-12-19  
**Related Files:** `v1/src/app/services/room-blueprint-import-export.service.ts`, `v1/src/app/services/room-blueprint-import-export.service.spec.ts`, `v1/src/app/services/room-blueprint-import-export-fixtures.ts`

## Overview

The Room Blueprint Import/Export Service provides deterministic JSON serialization and validation for room blueprints, supporting both single blueprint operations and batch processing. The service ensures reproducible imports/exports while maintaining strict validation against the blueprint schema and shared enums.

## Core Functionality

### Import Operations

#### `importRoomBlueprint(jsonString, options?)`

Imports a single room blueprint from JSON string with comprehensive validation and normalization.

**Parameters:**
- `jsonString` (string): JSON string containing the room blueprint data
- `options` (RoomBlueprintImportOptions, optional): Import configuration options

**Returns:** `RoomBlueprintImportResult`
- `blueprint`: Normalized RoomBlueprint object
- `orderedBlueprint`: Deterministic ordering applied
- `validation`: Validation summary with issues
- `normalizedFrom`: Original parsed input

**Example:**
```typescript
import { RoomBlueprintImportExportService } from './services/room-blueprint-import-export.service';

// Basic import
const service = new RoomBlueprintImportExportService();
const result = service.importRoomBlueprint(blueprintJson);

// Import with options
const result = service.importRoomBlueprint(blueprintJson, {
  deduplicateHazards: true
});

console.log(`Imported: ${result.blueprint.name}`);
if (result.validation.hasErrors) {
  console.log('Validation issues:', result.validation.issues);
}
```

#### `importRoomBlueprints(jsonArrayString, options?)`

Imports multiple room blueprints from JSON array.

**Parameters:**
- `jsonArrayString` (string): JSON string containing array of blueprints
- `options` (RoomBlueprintImportOptions, optional): Import configuration options

**Returns:** `RoomBlueprintImportResult[]`

**Example:**
```typescript
// Import multiple blueprints
const results = service.importRoomBlueprints(blueprintsArrayJson);

results.forEach((result, index) => {
  if (result.validation.hasErrors) {
    console.log(`Blueprint ${index} has validation errors:`, result.validation.issues);
  } else {
    console.log(`Successfully imported: ${result.blueprint.id}`);
  }
});
```

### Export Operations

#### `exportRoomBlueprint(blueprint)`

Exports a single room blueprint to JSON string with deterministic ordering.

**Parameters:**
- `blueprint` (RoomBlueprint): Room blueprint to export

**Returns:** `RoomBlueprintExportResult`
- `json`: Formatted JSON string
- `orderedBlueprint`: Blueprint with deterministic ordering applied
- `validation`: Validation summary

**Example:**
```typescript
const blueprint: RoomBlueprint = {
  id: 'my_workshop',
  name: 'My Workshop',
  purpose: 'Crafting and production',
  width: 12,
  height: 10,
  hazards: [HazardType.Fire, HazardType.Electrical],
  features: ['Workbench', 'Tool storage', 'Storage'],
  tags: ['crafting', 'production']
};

try {
  const result = service.exportRoomBlueprint(blueprint);
  console.log('Exported JSON:', result.json);
  
  if (result.validation.hasErrors) {
    console.log('Export validation issues:', result.validation.issues);
  }
} catch (error) {
  console.error('Export failed:', error);
}
```

#### `exportRoomBlueprints(blueprints)`

Exports multiple room blueprints to JSON array string.

**Parameters:**
- `blueprints` (RoomBlueprint[]): Array of room blueprints to export

**Returns:** `string` - JSON array string

**Example:**
```typescript
const blueprints = [blueprint1, blueprint2, blueprint3];
const jsonArray = service.exportRoomBlueprints(blueprints);

// Save to file or send to API
console.log('Exported blueprints:', jsonArray);
```

### Migration Support

#### `migrateBlueprintIfNeeded(blueprint, targetVersion)`

Validates blueprint version and applies migration hooks if needed.

**Parameters:**
- `blueprint` (any): Blueprint to migrate (any format)
- `targetVersion` (string, optional): Target version (defaults to '1.0.0')

**Returns:** `{ migrated: boolean; blueprint: RoomBlueprint; appliedMigrations: string[] }`

**Example:**
```typescript
const result = service.migrateBlueprintIfNeeded(oldBlueprint, '2.0.0');

if (result.migrated) {
  console.log('Applied migrations:', result.appliedMigrations);
  console.log('Migrated to version:', result.blueprint.version);
} else {
  console.log('No migration needed');
}
```

## Import Options

### `RoomBlueprintImportOptions`

```typescript
export interface RoomBlueprintImportOptions {
  /**
   * Deduplicate hazards during normalization. Defaults to `true` to keep deterministic exports.
   */
  deduplicateHazards?: boolean;
}
```

**Usage Examples:**
```typescript
// Default behavior - deduplicate hazards
const result1 = service.importRoomBlueprint(json);

// Keep duplicate hazards
const result2 = service.importRoomBlueprint(json, {
  deduplicateHazards: false
});
```

## Validation and Error Handling

### Validation Summary Structure

```typescript
export interface RoomBlueprintValidationSummary {
  hasErrors: boolean;
  issues: RoomBlueprintValidationIssue[];
  issuesByPath: Record<string, RoomBlueprintValidationIssue[]>;
}

export interface RoomBlueprintValidationIssue {
  path: string;
  message: string;
  severity: 'warning' | 'error';
}
```

### Error Handling Examples

#### Handling Import Errors

```typescript
try {
  const result = service.importRoomBlueprint(jsonString);
  
  if (result.validation.hasErrors) {
    // Handle validation errors
    result.validation.issues.forEach(issue => {
      if (issue.severity === 'error') {
        console.error(`Error at ${issue.path}: ${issue.message}`);
      } else {
        console.warn(`Warning at ${issue.path}: ${issue.message}`);
      }
    });
  } else {
    console.log('Import successful:', result.blueprint.id);
  }
} catch (error) {
  if (error instanceof RoomBlueprintValidationError) {
    console.error('Validation failed:', error.summary.issues);
  } else {
    console.error('Import failed:', error);
  }
}
```

#### Handling Export Errors

```typescript
try {
  const result = service.exportRoomBlueprint(blueprint);
  console.log('Export successful:', result.json);
} catch (error) {
  if (error instanceof RoomBlueprintValidationError) {
    console.error('Blueprint validation failed:');
    error.summary.issues.forEach(issue => {
      console.error(`${issue.severity.toUpperCase()}: ${issue.message}`);
    });
  } else {
    console.error('Export failed:', error);
  }
}
```

## Deterministic Ordering Rules

The service applies consistent ordering rules to ensure reproducible exports:

### Hazard Ordering
- Hazards are sorted alphabetically by string value
- Duplicates are removed when `deduplicateHazards` is true

### Socket Ordering
- Primary sort: position.y (top to bottom)
- Secondary sort: position.x (left to right)
- Tertiary sort: socket type/kind
- Final sort: socket ID

### Cost Ordering
- Primary sort: resourceId alphabetically
- Secondary sort: phase (build before maintenance)

### Constraint Ordering
- Primary sort: constraint type
- Secondary sort: constraint ID

### Tag Ordering
- Tags are normalized to lower_snake_case
- Sorted lexicographically

### Feature Ordering
- **Features preserve author/UI order exactly** - no automatic reordering

## Sample Blueprint JSON

### Basic Blueprint
```json
{
  "id": "basic_workshop",
  "name": "Basic Workshop",
  "purpose": "Simple crafting and repair",
  "width": 10,
  "height": 8,
  "hazards": ["fire", "electrical"],
  "features": ["Workbench", "Tool storage", "Good lighting"],
  "tags": ["crafting", "workshop"]
}
```

### Advanced Blueprint
```json
{
  "blueprintId": {
    "id": "advanced_laboratory",
    "version": "2.1.0",
    "namespace": "research_facility"
  },
  "name": "Advanced Laboratory",
  "purpose": "High-tech research and experimentation",
  "width": 16,
  "height": 12,
  "depth": 2,
  "dimensions": {
    "width": 16,
    "height": 12,
    "depth": 2,
    "origin": { "x": 5, "y": 5 },
    "gridUnit": 1.5
  },
  "hazards": ["radiation", "toxic_spill", "electrical"],
  "features": [
    "Sterile workbenches",
    "Chemical storage vault",
    "Radiation shielding",
    "Emergency shower",
    "Data collection terminals"
  ],
  "structureType": "tower",
  "sockets": [
    {
      "id": "main_entrance",
      "kind": "structural",
      "position": { "x": 0, "y": 6 },
      "label": "Main entrance"
    },
    {
      "socketId": "power_main",
      "type": "power",
      "position": { "x": 15, "y": 6 },
      "orientation": "east",
      "required": true,
      "label": "Main power feed"
    }
  ],
  "costs": [
    { "resourceId": "electronics", "amount": 75, "phase": "build" },
    { "resourceId": "steel", "amount": 50, "phase": "build" },
    { "resourceId": "paper", "amount": 5, "phase": "maintenance", "notes": "Research logs" }
  ],
  "constraints": [
    {
      "constraintId": "max_hazards",
      "type": "max_hazard_count",
      "value": 3,
      "rationale": "Safety protocols"
    }
  ],
  "tags": ["research", "advanced", "hazmat", "sterile"],
  "metadata": {
    "author": "research_team_lead",
    "source": "sdk",
    "createdAtIso": "2025-12-19T16:00:00.000Z",
    "department": "R&D",
    "classification": "Level 3"
  },
  "version": "2.1.0",
  "notes": "Requires Level 3 hazmat certification"
}
```

## Validation Rules

### Required Fields
- `id`: Must be non-empty string
- `name`: Must be non-empty string (minimum 3 characters recommended)
- `purpose`: Must be non-empty string
- `width`: Must be integer ≥ 1
- `height`: Must be integer ≥ 1
- `features`: Must be non-empty array

### Dimension Constraints
- **Minimum**: 1×1
- **Maximum**: 512×512
- **Depth**: Optional, must be ≥ 0 when provided
- **Grid Unit**: Defaults to 1, must be positive

### Hazard Validation
- Hazards must reference valid `HazardType` enum values
- Duplicate hazards generate warnings (removed when `deduplicateHazards: true`)

### Socket Validation
- Socket IDs must be unique within blueprint
- Socket positions must be within room bounds
- Required sockets must be defined
- Support both `RoomSocket` and `AdvancedRoomSocket` formats

### Cost Validation
- Resource IDs must reference valid `GoodsType` enum values
- Amounts must be non-negative
- Phases must be 'build' or 'maintenance'

### Constraint Validation
- Constraint types must be valid `RoomConstraintType` enum values
- Constraint values must match expected types for each constraint type

## Common Use Cases

### 1. Loading Blueprint from File

```typescript
import { readFileSync } from 'fs';

const jsonContent = readFileSync('blueprint.json', 'utf8');
const result = service.importRoomBlueprint(jsonContent);

if (result.validation.hasErrors) {
  console.error('Blueprint validation failed:', result.validation.issues);
  process.exit(1);
}

console.log('Loaded blueprint:', result.blueprint.name);
```

### 2. Saving Blueprint to File

```typescript
import { writeFileSync } from 'fs';

const result = service.exportRoomBlueprint(blueprint);

if (result.validation.hasErrors) {
  console.error('Cannot export invalid blueprint:', result.validation.issues);
  return;
}

writeFileSync('exported_blueprint.json', result.json);
console.log('Blueprint exported successfully');
```

### 3. Batch Processing Blueprints

```typescript
const inputFiles = ['blueprint1.json', 'blueprint2.json', 'blueprint3.json'];
const blueprints = [];

for (const file of inputFiles) {
  try {
    const jsonContent = readFileSync(file, 'utf8');
    const result = service.importRoomBlueprint(jsonContent);
    
    if (!result.validation.hasErrors) {
      blueprints.push(result.blueprint);
      console.log(`✓ Loaded: ${result.blueprint.id}`);
    } else {
      console.error(`✗ Validation failed for ${file}:`, result.validation.issues);
    }
  } catch (error) {
    console.error(`✗ Failed to load ${file}:`, error);
  }
}

// Export all valid blueprints
if (blueprints.length > 0) {
  const exported = service.exportRoomBlueprints(blueprints);
  writeFileSync('combined_blueprints.json', exported);
  console.log(`Exported ${blueprints.length} blueprints`);
}
```

### 4. Blueprint Migration

```typescript
// Load legacy blueprint
const legacyJson = readFileSync('legacy_blueprint.json', 'utf8');
const result = service.importRoomBlueprint(legacyJson);

// Check if migration is needed
const migration = service.migrateBlueprintIfNeeded(result.blueprint, '2.0.0');

if (migration.migrated) {
  console.log('Applied migrations:', migration.appliedMigrations);
  
  // Export migrated blueprint
  const exported = service.exportRoomBlueprint(migration.blueprint);
  writeFileSync('migrated_blueprint.json', exported.json);
  console.log('Migrated blueprint exported');
} else {
  console.log('No migration needed, blueprint already current');
}
```

### 5. Validation Pipeline

```typescript
function validateBlueprintForProduction(blueprint: RoomBlueprint): boolean {
  // Export to trigger validation
  try {
    const result = service.exportRoomBlueprint(blueprint);
    
    if (result.validation.hasErrors) {
      console.error('Blueprint validation failed for production:');
      result.validation.issues.forEach(issue => {
        const prefix = issue.severity === 'error' ? 'ERROR' : 'WARNING';
        console.error(`  ${prefix}: ${issue.path} - ${issue.message}`);
      });
      return false;
    }
    
    // Additional business logic validation
    if (blueprint.hazards.length > 5) {
      console.warn('Blueprint has more than 5 hazards - consider review');
    }
    
    return true;
  } catch (error) {
    console.error('Validation pipeline failed:', error);
    return false;
  }
}
```

## Integration Examples

### With Room Blueprint Editor

```typescript
export class RoomBlueprintEditorComponent {
  private importExportService: RoomBlueprintImportExportService;
  
  async onImportBlueprint(file: File) {
    const content = await file.text();
    
    try {
      const result = this.importExportService.importRoomBlueprint(content);
      
      if (result.validation.hasErrors) {
        this.showValidationErrors(result.validation.issues);
        return;
      }
      
      // Load into editor
      this.loadBlueprintIntoEditor(result.blueprint);
      this.showSuccessMessage(`Imported ${result.blueprint.name}`);
    } catch (error) {
      this.showErrorMessage(`Import failed: ${error.message}`);
    }
  }
  
  async onExportBlueprint() {
    const blueprint = this.getBlueprintFromEditor();
    
    try {
      const result = this.importExportService.exportRoomBlueprint(blueprint);
      
      if (result.validation.hasErrors) {
        this.showValidationErrors(result.validation.issues);
        return;
      }
      
      // Download file
      this.downloadFile(result.json, `${blueprint.id}.json`);
      this.showSuccessMessage(`Exported ${blueprint.name}`);
    } catch (error) {
      this.showErrorMessage(`Export failed: ${error.message}`);
    }
  }
}
```

### With REST API

```typescript
@Injectable()
export class BlueprintApiService {
  constructor(private http: HttpClient, private importExport: RoomBlueprintImportExportService) {}
  
  async uploadBlueprint(file: File): Promise<RoomBlueprint> {
    const formData = new FormData();
    formData.append('blueprint', file);
    
    const response = await this.http.post<any>('/api/blueprints/import', formData).toPromise();
    
    // Import to validate and normalize
    const result = this.importExport.importRoomBlueprint(response.json);
    
    if (result.validation.hasErrors) {
      throw new Error(`Validation failed: ${result.validation.issues.map(i => i.message).join(', ')}`);
    }
    
    return result.blueprint;
  }
  
  async downloadBlueprint(id: string): Promise<Blob> {
    const blueprint = await this.http.get<RoomBlueprint>(`/api/blueprints/${id}`).toPromise();
    
    const result = this.importExport.exportRoomBlueprint(blueprint);
    
    if (result.validation.hasErrors) {
      throw new Error(`Export validation failed: ${result.validation.issues.map(i => i.message).join(', ')}`);
    }
    
    return new Blob([result.json], { type: 'application/json' });
  }
}
```

## Best Practices

### 1. Always Handle Validation Errors
```typescript
// Good
try {
  const result = service.importRoomBlueprint(json);
  if (result.validation.hasErrors) {
    handleValidationErrors(result.validation.issues);
    return;
  }
  processValidBlueprint(result.blueprint);
} catch (error) {
  handleImportError(error);
}

// Bad - ignoring validation
const result = service.importRoomBlueprint(json);
processBlueprint(result.blueprint); // May process invalid data
```

### 2. Use Appropriate Error Handling
```typescript
// Good - specific error handling
try {
  const result = service.importRoomBlueprint(json);
} catch (error) {
  if (error instanceof RoomBlueprintValidationError) {
    // Handle validation errors specifically
    displayValidationErrors(error.summary.issues);
  } else {
    // Handle other errors
    displayGenericError(error.message);
  }
}
```

### 3. Leverage Batch Operations for Multiple Blueprints
```typescript
// Good - efficient batch processing
const results = service.importRoomBlueprints(jsonArray);
const validBlueprints = results.filter(r => !r.validation.hasErrors).map(r => r.blueprint);

// Bad - individual processing
const validBlueprints = [];
for (const json of jsonArray) {
  const result = service.importRoomBlueprint(json);
  if (!result.validation.hasErrors) {
    validBlueprints.push(result.blueprint);
  }
}
```

### 4. Validate Before Export
```typescript
// Good - validate before expensive operations
try {
  const result = service.exportRoomBlueprint(blueprint);
  if (result.validation.hasErrors) {
    console.warn('Exporting blueprint with validation issues:', result.validation.issues);
  }
  saveToDatabase(result.json);
} catch (error) {
  console.error('Export failed:', error);
}
```

### 5. Use Migration Support for Version Compatibility
```typescript
// Good - ensure compatibility
const migration = service.migrateBlueprintIfNeeded(inputBlueprint, '2.0.0');
const blueprint = migration.blueprint;

// Continue with normalized blueprint
processBlueprint(blueprint);
```

## Error Codes and Messages

### Common Validation Errors

| Error Code | Message | Description |
|------------|---------|-------------|
| `VALIDATION_FAILED` | Blueprint validation failed | General validation failure |
| `MISSING_REQUIRED_FIELD` | Required field '{field}' is missing | Essential field not provided |
| `INVALID_DIMENSIONS` | Invalid room dimensions | Width/height outside allowed range |
| `INVALID_HAZARD_TYPE` | Unknown hazard type '{hazard}' | Hazard not in HazardType enum |
| `DUPLICATE_SOCKET_ID` | Duplicate socket id '{id}' | Socket ID not unique |
| `SOCKET_OUT_OF_BOUNDS` | Socket position outside room bounds | Socket coordinate validation |
| `INVALID_RESOURCE_TYPE` | Unknown resource type '{resource}' | Resource not in GoodsType enum |
| `INVALID_CONSTRAINT_TYPE` | Unknown constraint type '{constraint}' | Constraint not in RoomConstraintType enum |

### Usage Recommendations

1. **Always validate** blueprints before using them in production
2. **Handle warnings** appropriately - they indicate non-critical issues
3. **Use batch operations** for processing multiple blueprints efficiently
4. **Implement proper error handling** with user-friendly error messages
5. **Test with the provided fixtures** to ensure compatibility
6. **Leverage migration support** for version compatibility

## Testing

The service includes comprehensive unit tests covering:

- ✅ Valid blueprint import/export
- ✅ Invalid blueprint rejection with proper error messages
- ✅ Hazard normalization options
- ✅ Batch operations
- ✅ Deterministic ordering verification
- ✅ Migration hook scaffolding
- ✅ Edge cases and boundary conditions
- ✅ Error handling and recovery

Run tests with:
```bash
npm test -- --include='**/room-blueprint-import-export.service.spec.ts'
```

## Conclusion

The Room Blueprint Import/Export Service provides a robust, type-safe foundation for blueprint serialization in the SDK. It ensures deterministic behavior, comprehensive validation, and migration support while maintaining ease of use for both simple and complex blueprint scenarios.