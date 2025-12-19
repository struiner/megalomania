import { ValidationNotice } from '../../../../models/validation.models';

// Validation Notice Fixtures for SDK Components
// Provides realistic validation scenarios for goods, tech, and room components

// ============================================================================
// GOODS MANAGER VALIDATION FIXTURES
// ============================================================================

export const GOODS_VALIDATION_FIXTURES: ValidationNotice[] = [
  // Critical errors
  {
    path: 'goods/copper-ingot/properties/mass',
    message: 'Mass value must be positive',
    severity: 'error',
    suggestion: 'Set mass to a value greater than 0',
    code: 'GOODS_MASS_INVALID'
  },
  {
    path: 'goods/iron-ore/trade/exchange-rate',
    message: 'Exchange rate missing for tradable good',
    severity: 'error',
    suggestion: 'Add exchange rate to enable trading',
    code: 'GOODS_EXCHANGE_RATE_MISSING'
  },
  
  // Warnings
  {
    path: 'goods/wood/placement/weight-class',
    message: 'Weight class inconsistent with material density',
    severity: 'warning',
    suggestion: 'Review weight class assignment',
    code: 'GOODS_WEIGHT_CLASS_MISMATCH'
  },
  {
    path: 'goods/cloth/properties/durability',
    message: 'Durability seems low for industrial use',
    severity: 'warning',
    suggestion: 'Consider increasing durability value',
    code: 'GOODS_DURABILITY_LOW'
  },
  
  // Information
  {
    path: 'goods/steel/placement/stacking',
    message: 'Consider enabling stacking for bulk storage',
    severity: 'info',
    suggestion: 'Add stacking configuration for better inventory management',
    code: 'GOODS_STACKING_SUGGESTION'
  }
];

// ============================================================================
// TECH TREE VALIDATION FIXTURES
// ============================================================================

export const TECH_VALIDATION_FIXTURES: ValidationNotice[] = [
  // Critical errors
  {
    path: 'tech/advanced-metallurgy/prerequisites/bronze-working',
    message: 'Circular dependency detected in tech tree',
    severity: 'error',
    suggestion: 'Remove circular reference between prerequisites',
    code: 'TECH_CIRCULAR_DEPENDENCY'
  },
  {
    path: 'tech/precision-tools/effects/upgrade-rate',
    message: 'Invalid upgrade rate value',
    severity: 'error',
    suggestion: 'Set upgrade rate between 0.1 and 2.0',
    code: 'TECH_UPGRADE_RATE_INVALID'
  },
  
  // Warnings
  {
    path: 'tech/basic-agriculture/costs/research-points',
    message: 'Research cost seems low for tier 2 technology',
    severity: 'warning',
    suggestion: 'Consider increasing research point cost',
    code: 'TECH_COST_LOW'
  },
  {
    path: 'tech/irrigation/effects/food-production',
    message: 'Effect magnitude may cause imbalance',
    severity: 'warning',
    suggestion: 'Review food production multiplier',
    code: 'TECH_EFFECT_IMBALANCE'
  },
  
  // Information
  {
    path: 'tech/mining/description',
    message: 'Consider adding more detailed description',
    severity: 'info',
    suggestion: 'Expand description to include automation benefits',
    code: 'TECH_DESCRIPTION_INCOMPLETE'
  }
];

// ============================================================================
// ROOM BLUEPRINT VALIDATION FIXTURES
// ============================================================================

export const ROOM_BLUEPRINT_VALIDATION_FIXTURES: ValidationNotice[] = [
  // Critical errors
  {
    path: 'blueprint/dimensions/width',
    message: 'Width must be between 3 and 50 tiles',
    severity: 'error',
    suggestion: 'Adjust width to valid range',
    code: 'ROOM_WIDTH_INVALID'
  },
  {
    path: 'blueprint/features/hearth/position',
    message: 'Hearth must be placed within room boundaries',
    severity: 'error',
    suggestion: 'Relocate hearth to valid position',
    code: 'ROOM_FEATURE_OUT_OF_BOUNDS'
  },
  
  // Warnings
  {
    path: 'blueprint/features/storage/capacity',
    message: 'Storage capacity may be insufficient for room size',
    severity: 'warning',
    suggestion: 'Consider adding additional storage features',
    code: 'ROOM_STORAGE_INSUFFICIENT'
  },
  {
    path: 'blueprint/lighting/light-sources',
    message: 'Room may be too dark for optimal worker performance',
    severity: 'warning',
    suggestion: 'Add more light sources or windows',
    code: 'ROOM_LIGHTING_POOR'
  },
  
  // Information
  {
    path: 'blueprint/aesthetics/decoration',
    message: 'Consider adding decorative elements for worker morale',
    severity: 'info',
    suggestion: 'Add paintings, plants, or other decorative items',
    code: 'ROOM_AESTHETICS_SUGGESTION'
  }
];

// ============================================================================
// IMPORT/EXPORT VALIDATION FIXTURES
// ============================================================================

export const IMPORT_EXPORT_VALIDATION_FIXTURES: ValidationNotice[] = [
  // File format errors
  {
    path: 'import/file/schema',
    message: 'Invalid file format detected',
    severity: 'error',
    suggestion: 'Ensure file matches expected JSON schema',
    code: 'IMPORT_INVALID_FORMAT'
  },
  {
    path: 'import/data/integrity',
    message: 'Data integrity check failed',
    severity: 'error',
    suggestion: 'Verify data consistency and retry import',
    code: 'IMPORT_INTEGRITY_FAILED'
  },
  
  // Import warnings
  {
    path: 'import/blueprints/count',
    message: 'Large number of blueprints may impact performance',
    severity: 'warning',
    suggestion: 'Consider importing in smaller batches',
    code: 'IMPORT_PERFORMANCE_WARNING'
  },
  {
    path: 'import/dependencies/missing',
    message: 'Some referenced items may be missing',
    severity: 'warning',
    suggestion: 'Review dependency resolution',
    code: 'IMPORT_DEPENDENCIES_MISSING'
  },
  
  // Export information
  {
    path: 'export/settings/compression',
    message: 'Compression can reduce file size significantly',
    severity: 'info',
    suggestion: 'Enable compression for large exports',
    code: 'EXPORT_COMPRESSION_SUGGESTION'
  }
];

// ============================================================================
// MIXED SEVERITY VALIDATION FIXTURES
// ============================================================================

export const MIXED_VALIDATION_FIXTURES: ValidationNotice[] = [
  {
    path: 'system/configuration',
    message: 'Critical configuration missing',
    severity: 'error',
    code: 'CONFIG_MISSING'
  },
  {
    path: 'system/performance',
    message: 'Performance threshold exceeded',
    severity: 'warning',
    code: 'PERFORMANCE_THRESHOLD'
  },
  {
    path: 'system/compatibility',
    message: 'Minor version compatibility note',
    severity: 'info',
    code: 'VERSION_COMPATIBILITY'
  }
];

// ============================================================================
// VALIDATION SUMMARY HELPERS
// ============================================================================

export interface ValidationSummary {
  errorCount: number;
  warningCount: number;
  infoCount: number;
  totalCount: number;
  highestSeverity: ValidationNotice['severity'];
}

export function createValidationSummary(notices: ValidationNotice[]): ValidationSummary {
  const errorCount = notices.filter(n => n.severity === 'error').length;
  const warningCount = notices.filter(n => n.severity === 'warning').length;
  const infoCount = notices.filter(n => n.severity === 'info').length;
  
  const severityOrder: Record<ValidationNotice['severity'], number> = { error: 0, warning: 1, info: 2 };
  const highestSeverity = notices.reduce((highest, notice) => 
    severityOrder[notice.severity] < severityOrder[highest] ? notice.severity : highest
  , 'info' as ValidationNotice['severity']);
  
  return {
    errorCount,
    warningCount,
    infoCount,
    totalCount: notices.length,
    highestSeverity
  };
}

// ============================================================================
// TEST FIXTURES BY COMPONENT
// ============================================================================

export const COMPONENT_VALIDATION_FIXTURES = {
  goods: GOODS_VALIDATION_FIXTURES,
  tech: TECH_VALIDATION_FIXTURES,
  room: ROOM_BLUEPRINT_VALIDATION_FIXTURES,
  importExport: IMPORT_EXPORT_VALIDATION_FIXTURES,
  mixed: MIXED_VALIDATION_FIXTURES
} as const;