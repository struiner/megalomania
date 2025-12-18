# Goods Catalog Import/Export Service

## Overview

The `GoodsCatalogIoService` provides deterministic JSON import/export functionality for the goods catalog, validating `ManagedGood` entries against shared enums and numeric bounds while preserving ordering for reproducible SDK workflows.

## Features

- **Deterministic Import/Export**: Ensures identical output for identical input
- **Comprehensive Validation**: Validates against authoritative enums and numeric bounds
- **Structured Error Reporting**: Provides actionable error messages with context
- **Version Migration Support**: Built-in hooks for schema evolution
- **Localization Ready**: Supports unicode characters and locale-aware formatting
- **Performance Optimized**: Efficient validation with early exit on critical errors

## Usage

### Importing Goods Catalog

```typescript
import { GoodsCatalogIoService } from './goods-catalog-io.service';

constructor(private goodsIo: GoodsCatalogIoService) {}

async importFromFile(file: File): Promise<GoodsCatalogResult> {
  const text = await file.text();
  return this.goodsIo.importCatalog(text);
}

// Example usage
const result = this.goodsIo.importCatalog(jsonString);

if (result.success) {
  console.log(`Imported ${result.goods.length} goods successfully`);
  this.goods = result.goods;
} else {
  console.error('Import failed:', result.issues);
  // Display issues to user
  this.displayValidationIssues(result.issues);
}
```

### Exporting Goods Catalog

```typescript
// Basic export with defaults
const exportData = this.goodsIo.exportCatalog(this.goods);

// Custom options
const customExport = this.goodsIo.exportCatalog(this.goods, {
  version: '1.2.0',
  includeMetadata: true,
  prettyPrint: true
});

// Download as file
const blob = new Blob([exportData], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'goods-catalog.json';
a.click();
```

## Data Model

### ManagedGood Interface

```typescript
interface ManagedGood {
  type: GoodsType;                    // Required: Valid GoodsType enum
  name: string;                       // Required: 1-100 characters
  category: GoodCategory | string;    // Required: Valid category or string
  description: string;                // Required: 1-500 characters
  tags: string[];                     // Optional: Max 20 items, 50 chars each
  
  // Core properties
  rarity: Rarity | number;           // Required: 1-5 or Rarity enum
  complexity: number;                // Required: 1-5
  basePrice: number;                 // Required: >= 0
  
  // Flora/provenance data
  floraSources?: FloraType[];        // Optional: Valid FloraType enums
  
  // Metadata
  tier?: number;                     // Optional: Tier classification
  unitType?: UnitType;               // Optional: Unit of measurement
  isSynthetic?: boolean;             // Optional: Synthetic goods flag
  eraOrigin?: string;                // Optional: Era information
  
  // Components/recipe data
  components?: {                     // Optional: Recipe components
    type: GoodsType;
    amount: number;
  }[];
}
```

## Validation Rules

### Required Fields
- `type`: Must be a valid `GoodsType` enum value
- `name`: Non-empty string (1-100 characters)
- `category`: Valid `GoodCategory` enum or string
- `description`: Non-empty string (1-500 characters)
- `rarity`: Number 1-5 or valid `Rarity` enum value
- `complexity`: Number 1-5
- `basePrice`: Number >= 0

### Numeric Bounds
- `rarity`: 1 to 5 (inclusive)
- `complexity`: 1 to 5 (inclusive)
- `basePrice`: 0 to 100,000 (inclusive)

### Array Constraints
- `tags`: Maximum 20 items, each <= 50 characters
- `floraSources`: Valid `FloraType` enum values only
- `components`: Each component must have valid `type` and positive `amount`

## Error Handling

### Structured Error Format

```typescript
interface GoodsCatalogIssue {
  path: string;           // JSON path to the error location
  message: string;        // Human-readable error description
  severity: 'error' | 'warning';
  code: string;          // Machine-readable error code
  context?: Record<string, unknown>; // Additional context information
}
```

### Error Codes

| Code | Description | Example |
|------|-------------|---------|
| `MISSING_FIELD` | Required field is missing | `goods[0].name` |
| `INVALID_ENUM_VALUE` | Invalid enum value | `goods[0].type: 'INVALID_TYPE'` |
| `INVALID_NUMBER` | Expected number, got other type | `goods[0].rarity: 'invalid'` |
| `OUT_OF_BOUNDS` | Numeric value outside allowed range | `goods[0].complexity: 10` |
| `TOO_SHORT` | String too short | `goods[0].name: ''` |
| `TOO_LONG` | String too long | `goods[0].description: 600 chars` |
| `INVALID_ARRAY_ITEM_TYPE` | Array contains invalid item type | `tags[1]: 123` |
| `INVALID_FLORA_TYPE` | Invalid FloraType enum value | `floraSources[0]: 'INVALID_FLORA'` |
| `INVALID_COMPONENT_TYPE` | Component has invalid GoodsType | `components[0].type: 'INVALID'` |
| `INVALID_COMPONENT_AMOUNT` | Component amount invalid | `components[0].amount: -1` |
| `PARSE_ERROR` | JSON parsing failed | Root level syntax error |

### Example Error Display

```typescript
displayValidationIssues(issues: GoodsCatalogIssue[]): void {
  const errorList = issues
    .filter(issue => issue.severity === 'error')
    .map(issue => `${issue.path}: ${issue.message}`)
    .join('\\n');
    
  if (errorList) {
    alert(`Validation failed:\\n${errorList}`);
  }
}
```

## Version Migration

### Adding Migrations

```typescript
// Example migration from version 1.0.0 to 1.1.0
const migration: GoodsCatalogMigration = {
  fromVersion: '1.0.0',
  toVersion: '1.1.0',
  migrate: (data: unknown) => {
    const migrated = { ...data };
    
    // Example: Convert old rarity format to new format
    if (migrated.goods) {
      migrated.goods = migrated.goods.map((good: any) => {
        if (typeof good.rarity === 'number') {
          // Convert numeric rarity to enum
          const rarityMap = { 1: 'Common', 2: 'Uncommon', 3: 'Rare', 4: 'Exotic', 5: 'Legendary' };
          good.rarity = rarityMap[good.rarity] || 'Common';
        }
        return good;
      });
    }
    
    return migrated;
  }
};

service.addMigration(migration);
```

### Migration Hook Registration

Migrations are automatically applied during import based on the version field in the imported data. The service compares the data version with available migrations and applies them in order.

## Performance Considerations

### Large Catalog Handling
- Service processes items sequentially for memory efficiency
- Validation stops on first critical error to provide fast feedback
- Export operations are optimized for deterministic ordering

### Memory Usage
- Import: Processes data in streaming fashion when possible
- Export: Generates JSON with minimal memory overhead
- Validation: Uses early exit strategies for invalid data

## Testing

### Unit Tests
The service includes comprehensive unit tests covering:
- Valid import/export scenarios
- Error handling and validation
- Round-trip data integrity
- Performance and memory usage
- Unicode and localization support

### Test Data
Use the provided fixtures for testing:
- `VALID_GOODS_CATALOG_FIXTURES`: Valid goods for positive testing
- `INVALID_GOODS_CATALOG_FIXTURES`: Invalid goods for error testing
- `SAMPLE_IMPORT_PAYLOADS`: Complete import scenarios

### Running Tests
```bash
ng test --include='**/goods-catalog-io.service.spec.ts'
```

## Integration Examples

### With Angular Forms
```typescript
import { FormBuilder, Validators } from '@angular/forms';

this.goodsForm = this.fb.group({
  type: ['', Validators.required],
  name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
  category: ['', Validators.required],
  description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
  rarity: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
  complexity: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
  basePrice: [0, [Validators.required, Validators.min(0)]]
});

validateWithService(): boolean {
  const formData = this.goodsForm.value;
  const testGood: ManagedGood = {
    ...formData,
    tags: this.tagsControl.value || []
  } as ManagedGood;
  
  const result = this.goodsIo.importCatalog(JSON.stringify([testGood]));
  return result.success;
}
```

### With File Upload
```typescript
async handleFileUpload(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (!file) return;
  
  try {
    const text = await file.text();
    const result = this.goodsIo.importCatalog(text);
    
    if (result.success) {
      this.catalog = result.goods;
      this.snackbar.open(`Imported ${result.goods.length} goods`, 'Success');
    } else {
      this.showValidationErrors(result.issues);
    }
  } catch (error) {
    this.snackbar.open('Failed to read file', 'Error');
  }
}
```

## Best Practices

### Data Integrity
1. Always validate before saving imported data
2. Use deterministic ordering for consistent exports
3. Include metadata for audit trails
4. Test round-trip scenarios regularly

### Error Handling
1. Display structured error messages to users
2. Log detailed errors for debugging
3. Provide actionable guidance for fixing issues
4. Handle partial imports gracefully

### Performance
1. Process large catalogs in chunks when possible
2. Use streaming for file operations
3. Cache validation results when appropriate
4. Monitor memory usage with large datasets

### Localization
1. Support unicode in names and descriptions
2. Use consistent encoding (UTF-8)
3. Consider locale-specific number formatting
4. Test with various character sets

## API Reference

### Methods

#### `importCatalog(jsonPayload: string): GoodsCatalogResult`
Imports goods catalog from JSON string.
- **Parameters**: `jsonPayload` - JSON string containing goods data
- **Returns**: `GoodsCatalogResult` with success status, validated goods, and issues

#### `exportCatalog(goods: ManagedGood[], options?: ExportOptions): string`
Exports goods catalog to JSON string.
- **Parameters**: 
  - `goods` - Array of ManagedGood objects
  - `options` - Export configuration options
- **Returns**: JSON string with exported catalog

### Types

#### `GoodsCatalogResult`
```typescript
{
  success: boolean;
  goods: ManagedGood[];
  issues: GoodsCatalogIssue[];
  version?: string;
  metadata?: Record<string, unknown>;
}
```

#### `ExportOptions`
```typescript
{
  version?: string;
  includeMetadata?: boolean;
  prettyPrint?: boolean;
}
```

## Troubleshooting

### Common Issues

**Import fails with "Invalid enum value"**
- Ensure `type` field uses valid `GoodsType` enum values
- Check for typos in enum value names
- Verify enum imports are correct

**Export produces different results each time**
- Check that input array is consistently ordered
- Verify no random data in export process
- Ensure deterministic sorting is working

**Memory issues with large catalogs**
- Process catalogs in smaller chunks
- Use streaming import when available
- Monitor memory usage during operations

**Validation errors not showing context**
- Check error code and severity levels
- Verify error context is properly populated
- Ensure all required fields are present

### Debug Mode
Enable debug logging by setting:
```typescript
// In development environment
localStorage.setItem('goods-catalog-debug', 'true');
```

This will log detailed validation information to the console.