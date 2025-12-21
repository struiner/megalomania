// Design System Spacing Tokens (TypeScript)
// Centralized spacing and layout configuration for Tech Tree Editor
// Provides runtime access to spacing scale and layout utilities

export interface SpacingScale {
  unit: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
  xxxl: string;
  xxxxl: string;
}

export interface GridSystem {
  columnCount: number;
  gutterWidth: string;
  rowHeight: string;
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  containers: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface DensityTokens {
  compact: {
    rowGap: string;
    columnGap: string;
    nodePadding: string;
  };
  comfortable: {
    rowGap: string;
    columnGap: string;
    nodePadding: string;
  };
  spacious: {
    rowGap: string;
    columnGap: string;
    nodePadding: string;
  };
}

export interface RhythmTokens {
  micro: string;
  tight: string;
  normal: string;
  loose: string;
  spacious: string;
}

export interface ComponentSpacing {
  button: {
    paddingX: string;
    paddingY: string;
    iconGap: string;
  };
  input: {
    paddingX: string;
    paddingY: string;
  };
  card: {
    padding: string;
    gap: string;
  };
  panel: {
    padding: string;
    gap: string;
  };
}

export interface TechTreeSpacing {
  node: {
    margin: string;
    padding: string;
    borderRadius: string;
    iconGap: string;
    gridGap: string;
    connectionOffset: string;
  };
  connection: {
    strokeWidth: string;
    arrowSize: string;
    lineMargin: string;
  };
  preview: {
    padding: string;
    contentGap: string;
    actionsGap: string;
  };
  detail: {
    padding: string;
    sectionGap: string;
    fieldGap: string;
    validationGap: string;
  };
  iconPicker: {
    padding: string;
    gridGap: string;
    previewSize: string;
    labelGap: string;
  };
  validation: {
    padding: string;
    gap: string;
    iconSize: string;
  };
}

export interface SpacingTokens extends SpacingScale, ComponentSpacing, TechTreeSpacing {
  grid: GridSystem;
  density: DensityTokens;
  rhythm: RhythmTokens;
}

/**
 * Design System Spacing Tokens
 * These tokens provide consistent spacing and layout across all Tech Tree Editor components
 * 
 * Usage:
 * ```typescript
 * import { SPACING_TOKENS } from './spacing.tokens';
 * 
 * const style = {
 *   padding: SPACING_TOKENS.node.padding,
 *   margin: SPACING_TOKENS.node.margin
 * };
 * ```
 */
export const SPACING_TOKENS: SpacingTokens = {
  // Base spacing scale
  unit: '4px',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
  xxxl: '48px',
  xxxxl: '64px',
  
  // Component spacing
  button: {
    paddingX: '12px',
    paddingY: '8px',
    iconGap: '4px'
  },
  
  input: {
    paddingX: '8px',
    paddingY: '4px'
  },
  
  card: {
    padding: '16px',
    gap: '12px'
  },
  
  panel: {
    padding: '24px',
    gap: '16px'
  },
  
  // Grid system
  grid: {
    columnCount: 12,
    gutterWidth: '12px',
    rowHeight: '24px',
    breakpoints: {
      sm: '768px',
      md: '1024px',
      lg: '1440px',
      xl: '1920px'
    },
    containers: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    }
  },
  
  // Density tokens
  density: {
    compact: {
      rowGap: '8px',
      columnGap: '8px',
      nodePadding: '8px'
    },
    comfortable: {
      rowGap: '16px',
      columnGap: '16px',
      nodePadding: '12px'
    },
    spacious: {
      rowGap: '24px',
      columnGap: '24px',
      nodePadding: '16px'
    }
  },
  
  // Rhythm tokens
  rhythm: {
    micro: '4px',
    tight: '8px',
    normal: '12px',
    loose: '16px',
    spacious: '24px'
  },
  
  // Tech tree specific spacing
  node: {
    margin: '8px',
    padding: '12px',
    borderRadius: '4px',
    iconGap: '4px',
    gridGap: '8px',
    connectionOffset: '4px'
  },
  
  connection: {
    strokeWidth: '2px',
    arrowSize: '4px',
    lineMargin: '4px'
  },
  
  preview: {
    padding: '24px',
    contentGap: '16px',
    actionsGap: '12px'
  },
  
  detail: {
    padding: '16px',
    sectionGap: '24px',
    fieldGap: '12px',
    validationGap: '8px'
  },
  
  iconPicker: {
    padding: '12px',
    gridGap: '4px',
    previewSize: '48px',
    labelGap: '4px'
  },
  
  validation: {
    padding: '8px',
    gap: '4px',
    iconSize: '8px'
  }
};

/**
 * Spacing utility functions
 */
export class SpacingUtils {
  /**
   * Convert spacing token to number value (for calculations)
   */
  static getNumericValue(spacing: string): number {
    return parseInt(spacing.replace('px', ''), 10);
  }
  
  /**
   * Add spacing values together
   */
  static addSpacing(spacing1: string, spacing2: string): string {
    const value1 = SpacingUtils.getNumericValue(spacing1);
    const value2 = SpacingUtils.getNumericValue(spacing2);
    return `${value1 + value2}px`;
  }
  
  /**
   * Multiply spacing value
   */
  static multiplySpacing(spacing: string, multiplier: number): string {
    const value = SpacingUtils.getNumericValue(spacing);
    return `${value * multiplier}px`;
  }
  
  /**
   * Get responsive spacing based on breakpoint
   */
  static getResponsiveSpacing(
    mobile: string,
    tablet: string,
    desktop: string
  ): Record<string, string> {
    return {
      '': mobile,
      [`@media (min-width: ${SPACING_TOKENS.grid.breakpoints.md})`]: tablet,
      [`@media (min-width: ${SPACING_TOKENS.grid.breakpoints.lg})`]: desktop
    };
  }
  
  /**
   * Apply spacing token to CSS properties
   */
  static applyToStyle(token: string, style: CSSStyleDeclaration, property: string): void {
    (style as any)[property] = token;
  }
  
  /**
   * Get grid column span CSS
   */
  static getGridColumnSpan(span: number): string {
    return `span ${span} / span ${span}`;
  }
  
  /**
   * Get responsive grid columns
   */
  static getResponsiveGridColumns(
    mobile: number,
    tablet: number,
    desktop: number
  ): Record<string, string> {
    return {
      '': `repeat(${mobile}, 1fr)`,
      [`@media (min-width: ${SPACING_TOKENS.grid.breakpoints.md})`]: `repeat(${tablet}, 1fr)`,
      [`@media (min-width: ${SPACING_TOKENS.grid.breakpoints.lg})`]: `repeat(${desktop}, 1fr)`
    };
  }
  
  /**
   * Calculate container padding based on screen size
   */
  static getContainerPadding(size: 'small' | 'medium' | 'large' = 'medium'): string {
    switch (size) {
      case 'small':
        return SPACING_TOKENS.sm;
      case 'large':
        return SPACING_TOKENS.lg;
      default:
        return SPACING_TOKENS.md;
    }
  }
  
  /**
   * Get density-appropriate spacing
   */
  static getDensitySpacing(density: 'compact' | 'comfortable' | 'spacious'): DensityTokens[keyof DensityTokens] {
    return SPACING_TOKENS.density[density];
  }
  
  /**
   * Validate spacing token accessibility (minimum touch targets)
   */
  static validateTouchTarget(size: string): boolean {
    const numericValue = SpacingUtils.getNumericValue(size);
    return numericValue >= 44; // Minimum 44px for touch targets
  }
  
  /**
   * Get spacing for specific use case
   */
  static getSpacingForUseCase(
    useCase: 'button' | 'input' | 'card' | 'panel' | 'node' | 'validation'
  ): Record<string, string> {
    switch (useCase) {
      case 'button':
        return {
          padding: `${SPACING_TOKENS.button.paddingY} ${SPACING_TOKENS.button.paddingX}`,
          gap: SPACING_TOKENS.button.iconGap
        };
      case 'input':
        return {
          padding: `${SPACING_TOKENS.input.paddingY} ${SPACING_TOKENS.input.paddingX}`
        };
      case 'card':
        return {
          padding: SPACING_TOKENS.card.padding,
          gap: SPACING_TOKENS.card.gap
        };
      case 'panel':
        return {
          padding: SPACING_TOKENS.panel.padding,
          gap: SPACING_TOKENS.panel.gap
        };
      case 'node':
        return {
          margin: SPACING_TOKENS.node.margin,
          padding: SPACING_TOKENS.node.padding,
          gap: SPACING_TOKENS.node.gridGap
        };
      case 'validation':
        return {
          padding: SPACING_TOKENS.validation.padding,
          gap: SPACING_TOKENS.validation.gap
        };
      default:
        return {};
    }
  }
}

/**
 * Spacing component mapping for easy access
 */
export const SPACING_COMPONENTS = {
  // Tech Tree Editor components
  'tech-tree-grid': {
    nodeGap: SPACING_TOKENS.node.gridGap,
    nodePadding: SPACING_TOKENS.node.padding,
    rowGap: SPACING_TOKENS.density.compact.rowGap,
    columnGap: SPACING_TOKENS.density.compact.columnGap
  },
  'tech-tree-node': {
    margin: SPACING_TOKENS.node.margin,
    padding: SPACING_TOKENS.node.padding,
    borderRadius: SPACING_TOKENS.node.borderRadius,
    iconGap: SPACING_TOKENS.node.iconGap
  },
  'tech-tree-connection': {
    strokeWidth: SPACING_TOKENS.connection.strokeWidth,
    arrowSize: SPACING_TOKENS.connection.arrowSize,
    lineMargin: SPACING_TOKENS.connection.lineMargin
  },
  'tech-tree-preview': {
    padding: SPACING_TOKENS.preview.padding,
    contentGap: SPACING_TOKENS.preview.contentGap,
    actionsGap: SPACING_TOKENS.preview.actionsGap
  },
  'node-detail-panel': {
    padding: SPACING_TOKENS.detail.padding,
    sectionGap: SPACING_TOKENS.detail.sectionGap,
    fieldGap: SPACING_TOKENS.detail.fieldGap,
    validationGap: SPACING_TOKENS.detail.validationGap
  },
  'icon-picker': {
    padding: SPACING_TOKENS.iconPicker.padding,
    gridGap: SPACING_TOKENS.iconPicker.gridGap,
    previewSize: SPACING_TOKENS.iconPicker.previewSize,
    labelGap: SPACING_TOKENS.iconPicker.labelGap
  },
  
  // General UI components
  'button': {
    padding: `${SPACING_TOKENS.button.paddingY} ${SPACING_TOKENS.button.paddingX}`,
    iconGap: SPACING_TOKENS.button.iconGap
  },
  'input': {
    padding: `${SPACING_TOKENS.input.paddingY} ${SPACING_TOKENS.input.paddingX}`
  },
  'card': {
    padding: SPACING_TOKENS.card.padding,
    gap: SPACING_TOKENS.card.gap
  },
  'panel': {
    padding: SPACING_TOKENS.panel.padding,
    gap: SPACING_TOKENS.panel.gap
  },
  'validation-notice': {
    padding: SPACING_TOKENS.validation.padding,
    gap: SPACING_TOKENS.validation.gap,
    iconSize: SPACING_TOKENS.validation.iconSize
  },
  
  // Layout containers
  'container': {
    padding: SPACING_TOKENS.md,
    maxWidth: SPACING_TOKENS.grid.containers.lg
  },
  'grid-container': {
    columnCount: SPACING_TOKENS.grid.columnCount,
    gutterWidth: SPACING_TOKENS.grid.gutterWidth
  }
} as const;

export type SpacingComponentKey = keyof typeof SPACING_COMPONENTS;

/**
 * Responsive spacing utilities
 */
export class ResponsiveSpacing {
  /**
   * Get mobile-first responsive spacing
   */
  static mobileFirst(mobile: string, tablet?: string, desktop?: string): Record<string, string> {
    const styles: Record<string, string> = {};
    
    // Mobile (default)
    styles[''] = mobile;
    
    // Tablet
    if (tablet) {
      styles[`@media (min-width: ${SPACING_TOKENS.grid.breakpoints.md})`] = tablet;
    }
    
    // Desktop
    if (desktop) {
      styles[`@media (min-width: ${SPACING_TOKENS.grid.breakpoints.lg})`] = desktop;
    }
    
    return styles;
  }
  
  /**
   * Get density-aware spacing
   */
  static withDensity(density: 'compact' | 'comfortable' | 'spacious') {
    const densityTokens = SPACING_TOKENS.density[density];
    
    return {
      rowGap: densityTokens.rowGap,
      columnGap: densityTokens.columnGap,
      nodePadding: densityTokens.nodePadding,
      margin: SPACING_TOKENS.node.margin
    };
  }
  
  /**
   * Get touch-optimized spacing (44px minimum)
   */
  static touchOptimized(baseSpacing: string): string {
    const numericValue = SpacingUtils.getNumericValue(baseSpacing);
    return numericValue < 44 ? '44px' : baseSpacing;
  }
}