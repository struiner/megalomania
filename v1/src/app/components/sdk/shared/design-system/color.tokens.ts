// Design System Color Tokens (TypeScript)
// Centralized color configuration for Tech Tree Editor
// Provides runtime access to color palette and utilities

export interface ColorScale {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
}

export interface NeutralScale {
  0: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface SemanticColors {
  success: string;
  successLight: string;
  successDark: string;
  warning: string;
  warningLight: string;
  warningDark: string;
  error: string;
  errorLight: string;
  errorDark: string;
  info: string;
  infoLight: string;
  infoDark: string;
}

export interface InteractionColors {
  focus: string;
  focusLight: string;
  focusDark: string;
  hover: string;
  hoverSecondary: string;
  active: string;
  selected: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  muted: string;
  disabled: string;
  inverse: string;
}

export interface BackgroundColors {
  primary: string;
  secondary: string;
  tertiary: string;
  disabled: string;
}

export interface BorderColors {
  primary: string;
  secondary: string;
  focus: string;
  error: string;
}

export interface SurfaceColors {
  raised: string;
  embedded: string;
  overlay: string;
  sunken: string;
}

export interface ComponentColors {
  nodeAvailable: string;
  nodeLocked: string;
  nodeResearching: string;
  nodeComplete: string;
  nodeError: string;
  connectionValid: string;
  connectionInvalid: string;
  connectionPrerequisite: string;
}

export interface StatusColors {
  available: string;
  locked: string;
  researching: string;
  complete: string;
  error: string;
}

export interface FeedbackColors {
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface HierarchyColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface ConnectionColors {
  available: string;
  locked: string;
  researching: string;
}

export interface ColorTokens {
  // Core color scale
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  // Neutral scale
  0: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  
  // Semantic colors
  success: string;
  successLight: string;
  successDark: string;
  warning: string;
  warningLight: string;
  warningDark: string;
  error: string;
  errorLight: string;
  errorDark: string;
  info: string;
  infoLight: string;
  infoDark: string;
  
  // Interaction states
  focus: string;
  focusLight: string;
  focusDark: string;
  hover: string;
  hoverSecondary: string;
  active: string;
  selected: string;
  
  // Flattened text, background, and border properties
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textDisabled: string;
  textInverse: string;
  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  backgroundDisabled: string;
  borderPrimary: string;
  borderSecondary: string;
  borderFocus: string;
  borderError: string;
  surfaceRaised: string;
  surfaceEmbedded: string;
  surfaceOverlay: string;
  surfaceSunken: string;
  
  // Component-specific colors
  nodeAvailable: string;
  nodeLocked: string;
  nodeResearching: string;
  nodeComplete: string;
  nodeError: string;
  connectionValid: string;
  connectionInvalid: string;
  connectionPrerequisite: string;
  
  // Semantic aliases
  statusAvailable: string;
  statusLocked: string;
  statusResearching: string;
  statusComplete: string;
  statusError: string;
  feedbackSuccess: string;
  feedbackWarning: string;
  feedbackError: string;
  feedbackInfo: string;
  hierarchyPrimary: string;
  hierarchySecondary: string;
  hierarchyAccent: string;
  connectionAvailable: string;
  connectionLocked: string;
  connectionResearching: string;
}

/**
 * Design System Color Tokens
 * These tokens provide consistent colors across all Tech Tree Editor components
 * Following Hanseatic fantasy aesthetic with retro pixel heritage
 * 
 * Usage:
 * ```typescript
 * import { COLOR_TOKENS } from './color.tokens';
 * 
 * const style = {
 *   color: COLOR_TOKENS.text.primary,
 *   backgroundColor: COLOR_TOKENS.background.primary
 * };
 * ```
 */
export const COLOR_TOKENS: ColorTokens = {
  // Core color scale
  primary: '#8b4513',
  primaryLight: '#cd853f',
  primaryDark: '#654321',
  secondary: '#daa520',
  secondaryLight: '#ffd700',
  secondaryDark: '#b8860b',
  
  // Neutral scale
  0: '#ffffff',
  50: '#f8f8f8',
  100: '#f0f0f0',
  200: '#e0e0e0',
  300: '#c0c0c0',
  400: '#a0a0a0',
  500: '#808080',
  600: '#606060',
  700: '#404040',
  800: '#202020',
  900: '#000000',
  
  // Semantic colors
  success: '#228b22',
  successLight: '#32cd32',
  successDark: '#006400',
  warning: '#ff8c00',
  warningLight: '#ffa500',
  warningDark: '#cc7000',
  error: '#dc143c',
  errorLight: '#ff4757',
  errorDark: '#b22222',
  info: '#4682b4',
  infoLight: '#6495ed',
  infoDark: '#1e3a5f',
  
  // Interaction states
  focus: '#4169e1',
  focusLight: '#6a8df0',
  focusDark: '#1e40af',
  hover: 'rgba(139, 69, 19, 0.08)',
  hoverSecondary: 'rgba(218, 165, 32, 0.12)',
  active: 'rgba(139, 69, 19, 0.16)',
  selected: 'rgba(218, 165, 32, 0.20)',
  
  textPrimary: '#202020',
  textSecondary: '#606060',
  textMuted: '#808080',
  textDisabled: '#a0a0a0',
  textInverse: '#ffffff',
  
  backgroundPrimary: '#ffffff',
  backgroundSecondary: '#f8f8f8',
  backgroundTertiary: '#f0f0f0',
  backgroundDisabled: '#f0f0f0',
  
  borderPrimary: '#e0e0e0',
  borderSecondary: '#c0c0c0',
  borderFocus: '#4169e1',
  borderError: '#dc143c',
  
  surfaceRaised: '#ffffff',
  surfaceEmbedded: '#f8f8f8',
  surfaceOverlay: '#ffffff',
  surfaceSunken: '#f0f0f0',
  
  // Component-specific colors
  nodeAvailable: '#228b22',
  nodeLocked: '#a0a0a0',
  nodeResearching: '#4682b4',
  nodeComplete: '#daa520',
  nodeError: '#dc143c',
  connectionValid: '#228b22',
  connectionInvalid: '#dc143c',
  connectionPrerequisite: '#606060',
  
  // Semantic aliases - flattened for TypeScript compatibility
  statusAvailable: '#228b22',
  statusLocked: '#a0a0a0',
  statusResearching: '#4682b4',
  statusComplete: '#daa520',
  statusError: '#dc143c',
  feedbackSuccess: '#228b22',
  feedbackWarning: '#ff8c00',
  feedbackError: '#dc143c',
  feedbackInfo: '#4682b4',
  hierarchyPrimary: '#8b4513',
  hierarchySecondary: '#daa520',
  hierarchyAccent: '#4682b4',
  connectionAvailable: '#228b22',
  connectionLocked: '#a0a0a0',
  connectionResearching: '#4682b4'
};

/**
 * Color utility functions for accessibility and validation
 */
export class ColorUtils {
  /**
   * Convert hex color to RGB values
   */
  static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  
  /**
   * Convert RGB to relative luminance (WCAG formula)
   */
  static getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }
  
  /**
   * Calculate contrast ratio between two colors (WCAG 2.1)
   * Returns ratio from 1:1 to 21:1
   */
  static getContrastRatio(foreground: string, background: string): number {
    const fgRgb = this.hexToRgb(foreground);
    const bgRgb = this.hexToRgb(background);
    
    if (!fgRgb || !bgRgb) {
      return 1; // Return minimum ratio for invalid colors
    }
    
    const fgLuminance = this.getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
    const bgLuminance = this.getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
    
    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);
    
    return (lighter + 0.05) / (darker + 0.05);
  }
  
  /**
   * Check if color combination meets WCAG 2.1 AA standards
   * Normal text: 4.5:1, Large text: 3:1, UI components: 3:1
   */
  static meetsWCAGAA(foreground: string, background: string, isLargeText = false): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    const threshold = isLargeText ? 3.0 : 4.5;
    return ratio >= threshold;
  }
  
  /**
   * Check if color combination meets WCAG 2.1 AAA standards
   * Normal text: 7:1, Large text: 4.5:1
   */
  static meetsWCAGAAA(foreground: string, background: string, isLargeText = false): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    const threshold = isLargeText ? 4.5 : 7.0;
    return ratio >= threshold;
  }
  
  /**
   * Get recommended text color for given background
   */
  static getRecommendedTextColor(background: string): string {
    const whiteContrast = this.getContrastRatio('#ffffff', background);
    const blackContrast = this.getContrastRatio('#000000', background);
    
    return whiteContrast >= blackContrast ? '#ffffff' : '#000000';
  }
  
  /**
   * Validate all critical color combinations for accessibility
   */
  static validateAccessibility(): { passed: boolean; failures: string[] } {
    const failures: string[] = [];
    
    // Test primary text combinations
    if (!this.meetsWCAGAA(COLOR_TOKENS.textPrimary, COLOR_TOKENS.backgroundPrimary)) {
      failures.push('Primary text on primary background fails WCAG AA');
    }
    
    if (!this.meetsWCAGAA(COLOR_TOKENS.textSecondary, COLOR_TOKENS.backgroundPrimary)) {
      failures.push('Secondary text on primary background fails WCAG AA');
    }
    
    if (!this.meetsWCAGAA(COLOR_TOKENS.textMuted, COLOR_TOKENS.backgroundPrimary)) {
      failures.push('Muted text on primary background fails WCAG AA');
    }
    
    // Test inverse text combinations
    if (!this.meetsWCAGAA(COLOR_TOKENS.textInverse, COLOR_TOKENS.backgroundSecondary)) {
      failures.push('Inverse text on secondary background fails WCAG AA');
    }
    
    // Test focus indicators
    if (!this.meetsWCAGAA(COLOR_TOKENS.focus, COLOR_TOKENS.backgroundPrimary)) {
      failures.push('Focus indicator fails WCAG AA contrast');
    }
    
    // Test validation colors
    if (!this.meetsWCAGAA(COLOR_TOKENS.error, COLOR_TOKENS.backgroundPrimary)) {
      failures.push('Error color fails WCAG AA contrast');
    }
    
    if (!this.meetsWCAGAA(COLOR_TOKENS.warning, COLOR_TOKENS.backgroundPrimary)) {
      failures.push('Warning color fails WCAG AA contrast');
    }
    
    return {
      passed: failures.length === 0,
      failures
    };
  }
  
  /**
   * Apply color token to CSS properties
   */
  static applyToStyle(colorKey: keyof ColorTokens, style: CSSStyleDeclaration): void {
    const color = COLOR_TOKENS[colorKey];
    if (typeof color === 'string') {
      style.color = color;
    }
  }
  
  /**
   * Get color for specific theme (light/dark)
   */
  static getThemeColor(colorKey: string, theme: 'light' | 'dark' = 'light'): string {
    const color = (COLOR_TOKENS as any)[colorKey];
    if (typeof color !== 'string') {
      return color || '#000000';
    }
    
    // For dark theme, we might need to adjust certain colors
    // This is a simplified implementation
    if (theme === 'dark') {
      // Adjust for dark theme context
      if (colorKey.includes('text')) {
        return COLOR_TOKENS[700]; // Use appropriate neutral for dark theme
      }
    }
    
    return color;
  }
}

/**
 * Color component mapping for easy access
 */
export const COLOR_COMPONENTS = {
  // Tech Tree Editor components
  'tech-tree-grid-available': COLOR_TOKENS.nodeAvailable,
  'tech-tree-grid-locked': COLOR_TOKENS.nodeLocked,
  'tech-tree-grid-researching': COLOR_TOKENS.nodeResearching,
  'tech-tree-grid-complete': COLOR_TOKENS.nodeComplete,
  'tech-tree-grid-error': COLOR_TOKENS.nodeError,
  'tech-tree-connection-valid': COLOR_TOKENS.connectionValid,
  'tech-tree-connection-invalid': COLOR_TOKENS.connectionInvalid,
  'tech-tree-connection-prerequisite': COLOR_TOKENS.connectionPrerequisite,
  'tech-tree-node-title': COLOR_TOKENS.textPrimary,
  'tech-tree-node-description': COLOR_TOKENS.textSecondary,
  'tech-tree-node-meta': COLOR_TOKENS.textMuted,
  'tech-tree-preview-title': COLOR_TOKENS.textPrimary,
  'tech-tree-preview-description': COLOR_TOKENS.textSecondary,
  'icon-picker-label': COLOR_TOKENS.textMuted,
  'icon-picker-search': COLOR_TOKENS.textPrimary,
  'node-detail-title': COLOR_TOKENS.textPrimary,
  'node-detail-description': COLOR_TOKENS.textSecondary,
  'node-detail-effects': COLOR_TOKENS.textSecondary,
  
  // General UI components
  'validation-error': COLOR_TOKENS.error,
  'validation-warning': COLOR_TOKENS.warning,
  'validation-success': COLOR_TOKENS.success,
  'tooltip-background': COLOR_TOKENS.backgroundSecondary,
  'tooltip-text': COLOR_TOKENS.textPrimary,
  'button-primary': COLOR_TOKENS.primary,
  'button-secondary': COLOR_TOKENS.secondary,
  'button-focus': COLOR_TOKENS.focus,
  'link-primary': COLOR_TOKENS.info,
  'link-hover': COLOR_TOKENS.infoLight
} as const;

export type ColorComponentKey = keyof typeof COLOR_COMPONENTS;

/**
 * Color state mapping for interactive components
 */
export const COLOR_STATES = {
  default: {
    background: COLOR_TOKENS.backgroundPrimary,
    border: COLOR_TOKENS.borderPrimary,
    text: COLOR_TOKENS.textPrimary
  },
  hover: {
    background: COLOR_TOKENS.hover,
    border: COLOR_TOKENS.borderPrimary,
    text: COLOR_TOKENS.textPrimary
  },
  focus: {
    background: COLOR_TOKENS.backgroundPrimary,
    border: COLOR_TOKENS.borderFocus,
    text: COLOR_TOKENS.textPrimary
  },
  active: {
    background: COLOR_TOKENS.active,
    border: COLOR_TOKENS.borderPrimary,
    text: COLOR_TOKENS.textPrimary
  },
  disabled: {
    background: COLOR_TOKENS.backgroundDisabled,
    border: COLOR_TOKENS.borderSecondary,
    text: COLOR_TOKENS.textDisabled
  },
  error: {
    background: COLOR_TOKENS.backgroundPrimary,
    border: COLOR_TOKENS.borderError,
    text: COLOR_TOKENS.error
  }
} as const;

export type ColorStateKey = keyof typeof COLOR_STATES;