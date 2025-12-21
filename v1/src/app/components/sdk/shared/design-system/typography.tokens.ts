// Design System Typography Tokens (TypeScript)
// Centralized typography configuration for Tech Tree Editor
// Provides runtime access to typography scale

export interface TypographyScale {
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
    xxxl: string;
    display: string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  fontFamily: {
    base: string;
    mono: string;
  };
}

export interface TypographyToken {
  size: string;
  weight: number;
  lineHeight: number;
}

export interface TypographyHierarchy {
  heading1: TypographyToken;
  heading2: TypographyToken;
  heading3: TypographyToken;
  heading4: TypographyToken;
  heading5: TypographyToken;
  bodyLarge: TypographyToken;
  body: TypographyToken;
  bodySmall: TypographyToken;
  bodyTiny: TypographyToken;
}

export interface SpecializedTypography {
  nodeTitle: TypographyToken;
  nodeDescription: TypographyToken;
  nodeMeta: TypographyToken;
  nodePrerequisite: TypographyToken;
  validation: TypographyToken;
  tooltip: TypographyToken;
  iconLabel: TypographyToken;
  caption: TypographyToken;
  code: TypographyToken;
}

export interface TypographyTokens extends TypographyScale, TypographyHierarchy, SpecializedTypography {}

/**
 * Design System Typography Tokens
 * These tokens provide consistent typography across all Tech Tree Editor components
 * 
 * Usage:
 * ```typescript
 * import { TYPOGRAPHY_TOKENS } from './typography.tokens';
 * 
 * const style = {
 *   fontSize: TYPOGRAPHY_TOKENS.nodeTitle.size,
 *   fontWeight: TYPOGRAPHY_TOKENS.nodeTitle.weight
 * };
 * ```
 */
export const TYPOGRAPHY_TOKENS: TypographyTokens = {
  // Base typography scale
  fontSize: {
    xs: '10px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    xxl: '22px',
    xxxl: '28px',
    display: '36px'
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6
  },
  
  fontFamily: {
    base: "'Inter', 'Segoe UI', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace"
  },
  
  // Heading hierarchy
  heading1: {
    size: '36px',
    weight: 700,
    lineHeight: 1.2
  },
  
  heading2: {
    size: '28px',
    weight: 600,
    lineHeight: 1.2
  },
  
  heading3: {
    size: '22px',
    weight: 600,
    lineHeight: 1.2
  },
  
  heading4: {
    size: '18px',
    weight: 500,
    lineHeight: 1.4
  },
  
  heading5: {
    size: '16px',
    weight: 500,
    lineHeight: 1.4
  },
  
  // Body text hierarchy
  bodyLarge: {
    size: '16px',
    weight: 400,
    lineHeight: 1.4
  },
  
  body: {
    size: '14px',
    weight: 400,
    lineHeight: 1.4
  },
  
  bodySmall: {
    size: '12px',
    weight: 400,
    lineHeight: 1.4
  },
  
  bodyTiny: {
    size: '10px',
    weight: 400,
    lineHeight: 1.6
  },
  
  // Specialized typography for tech tree components
  nodeTitle: {
    size: '16px',
    weight: 600,
    lineHeight: 1.2
  },
  
  nodeDescription: {
    size: '12px',
    weight: 400,
    lineHeight: 1.6
  },
  
  nodeMeta: {
    size: '10px',
    weight: 500,
    lineHeight: 1.4
  },
  
  nodePrerequisite: {
    size: '12px',
    weight: 500,
    lineHeight: 1.4
  },
  
  validation: {
    size: '12px',
    weight: 500,
    lineHeight: 1.4
  },
  
  tooltip: {
    size: '12px',
    weight: 400,
    lineHeight: 1.6
  },
  
  iconLabel: {
    size: '10px',
    weight: 500,
    lineHeight: 1.4
  },
  
  caption: {
    size: '10px',
    weight: 400,
    lineHeight: 1.6
  },
  
  code: {
    size: '12px',
    weight: 400,
    lineHeight: 1.4
  }
};

/**
 * Typography utility functions
 */
export class TypographyUtils {
  /**
   * Get CSS font string for a typography token
   */
  static getFontString(token: TypographyToken): string {
    return `${token.weight} ${token.size}`;
  }
  
  /**
   * Get CSS font-family string
   */
  static getFontFamily(family: 'base' | 'mono' = 'base'): string {
    return TYPOGRAPHY_TOKENS.fontFamily[family];
  }
  
  /**
   * Apply typography token to CSS properties
   */
  static applyToStyle(token: TypographyToken, style: CSSStyleDeclaration): void {
    style.fontSize = token.size;
    style.fontWeight = token.weight.toString();
    style.lineHeight = token.lineHeight.toString();
  }
  
  /**
   * Get typography contrast ratio (for accessibility validation)
   * This is a simplified calculation for internal use
   */
  static getContrastRatio(foreground: string, background: string): number {
    // This would need a proper color contrast calculator implementation
    // For now, return a placeholder
    return 4.5; // WCAG AA threshold
  }
}

/**
 * Typography component mapping for easy access
 */
export const TYPOGRAPHY_COMPONENTS = {
  // Tech Tree Editor components
  'tech-tree-grid': TYPOGRAPHY_TOKENS.nodeTitle,
  'tech-tree-grid-description': TYPOGRAPHY_TOKENS.nodeDescription,
  'tech-tree-grid-meta': TYPOGRAPHY_TOKENS.nodeMeta,
  'tech-tree-node-title': TYPOGRAPHY_TOKENS.nodeTitle,
  'tech-tree-node-description': TYPOGRAPHY_TOKENS.nodeDescription,
  'tech-tree-node-prerequisite': TYPOGRAPHY_TOKENS.nodePrerequisite,
  'tech-tree-node-validation': TYPOGRAPHY_TOKENS.validation,
  'tech-tree-preview-title': TYPOGRAPHY_TOKENS.heading3,
  'tech-tree-preview-description': TYPOGRAPHY_TOKENS.body,
  'tech-tree-preview-validation': TYPOGRAPHY_TOKENS.validation,
  'icon-picker-label': TYPOGRAPHY_TOKENS.iconLabel,
  'icon-picker-search': TYPOGRAPHY_TOKENS.body,
  'node-detail-title': TYPOGRAPHY_TOKENS.heading2,
  'node-detail-description': TYPOGRAPHY_TOKENS.body,
  'node-detail-effects': TYPOGRAPHY_TOKENS.bodySmall,
  'node-detail-validation': TYPOGRAPHY_TOKENS.validation,
  
  // General UI components
  'validation-notice': TYPOGRAPHY_TOKENS.validation,
  'tooltip': TYPOGRAPHY_TOKENS.tooltip,
  'caption': TYPOGRAPHY_TOKENS.caption,
  'code': TYPOGRAPHY_TOKENS.code
} as const;

export type TypographyComponentKey = keyof typeof TYPOGRAPHY_COMPONENTS;