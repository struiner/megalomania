// Design System Focus State Tokens - TypeScript Definitions
// Comprehensive focus state system for Tech Tree Editor
// Complies with UI & Ergonomics Charter principles
// Type-safe focus state configuration for component development

export interface FocusRingConfig {
  width: string | number;
  style: string;
  color: string;
  offset: string | number;
}

export interface FocusBorderConfig {
  width: string | number;
  style: string;
  color: string;
}

export interface FocusShadowConfig {
  blur: string | number;
  spread: string | number;
  color: string;
  x: string | number;
  y: string | number;
}

export interface FocusBackgroundConfig {
  color: string;
}

export interface FocusAnimationConfig {
  duration: string;
  timing: string;
  properties: string;
}

export interface FocusStateConfig {
  ring: FocusRingConfig;
  border: FocusBorderConfig;
  shadow: FocusShadowConfig;
  background: FocusBackgroundConfig;
  animation: FocusAnimationConfig;
}

// Focus state types
export type FocusStateType = 'default' | 'enhanced' | 'subtle' | 'error' | 'success';

// Component focus types
export type ComponentFocusType = 'button' | 'input' | 'node' | 'link' | 'modal' | 'skip-link';

// Focus management types
export type FocusTrapType = 'modal' | 'dropdown' | 'menu' | 'tabs';

// Keyboard navigation key types
export type NavigationKey = 'Tab' | 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'Enter' | 'Escape' | 'Space';

// ============================================================================
// FOCUS STATE TOKEN DEFINITIONS
// ============================================================================

export const FOCUS_STATE_TOKENS = {
  // Standard focus state
  default: {
    ring: {
      width: '2px',
      style: 'solid',
      color: '#4169e1', // Royal blue from color tokens
      offset: '2px'
    },
    border: {
      width: '1px',
      style: 'solid',
      color: '#4169e1'
    },
    shadow: {
      blur: 0,
      spread: '2px',
      color: 'rgba(65, 105, 225, 0.3)',
      x: 0,
      y: 0
    },
    background: {
      color: 'rgba(65, 105, 225, 0.08)'
    },
    animation: {
      duration: '150ms',
      timing: 'ease-out',
      properties: 'outline, border, background-color, box-shadow'
    }
  } as FocusStateConfig,

  // Enhanced focus state for high-priority elements
  enhanced: {
    ring: {
      width: '3px',
      style: 'solid',
      color: '#1e40af', // Dark focus color
      offset: '3px'
    },
    border: {
      width: '2px',
      style: 'solid',
      color: '#1e40af'
    },
    shadow: {
      blur: 0,
      spread: '3px',
      color: 'rgba(30, 64, 175, 0.4)',
      x: 0,
      y: 0
    },
    background: {
      color: 'rgba(65, 105, 225, 0.12)'
    },
    animation: {
      duration: '150ms',
      timing: 'ease-out',
      properties: 'outline, border, background-color, box-shadow'
    }
  } as FocusStateConfig,

  // Subtle focus state for secondary elements
  subtle: {
    ring: {
      width: '1px',
      style: 'solid',
      color: '#6a8df0', // Light focus color
      offset: '2px'
    },
    border: {
      width: '1px',
      style: 'solid',
      color: '#6a8df0'
    },
    shadow: {
      blur: 0,
      spread: '1px',
      color: 'rgba(106, 141, 240, 0.2)',
      x: 0,
      y: 0
    },
    background: {
      color: 'rgba(65, 105, 225, 0.04)'
    },
    animation: {
      duration: '100ms',
      timing: 'ease-out',
      properties: 'outline, border, background-color, box-shadow'
    }
  } as FocusStateConfig,

  // Error focus state for form validation
  error: {
    ring: {
      width: '2px',
      style: 'solid',
      color: '#dc143c', // Crimson from color tokens
      offset: '2px'
    },
    border: {
      width: '2px',
      style: 'solid',
      color: '#dc143c'
    },
    shadow: {
      blur: 0,
      spread: '2px',
      color: 'rgba(220, 20, 60, 0.3)',
      x: 0,
      y: 0
    },
    background: {
      color: 'rgba(220, 20, 60, 0.08)'
    },
    animation: {
      duration: '150ms',
      timing: 'ease-out',
      properties: 'outline, border, background-color, box-shadow'
    }
  } as FocusStateConfig,

  // Success focus state for completed actions
  success: {
    ring: {
      width: '2px',
      style: 'solid',
      color: '#228b22', // Forest green from color tokens
      offset: '2px'
    },
    border: {
      width: '1px',
      style: 'solid',
      color: '#228b22'
    },
    shadow: {
      blur: 0,
      spread: '2px',
      color: 'rgba(34, 139, 34, 0.3)',
      x: 0,
      y: 0
    },
    background: {
      color: 'rgba(34, 139, 34, 0.08)'
    },
    animation: {
      duration: '150ms',
      timing: 'ease-out',
      properties: 'outline, border, background-color, box-shadow'
    }
  } as FocusStateConfig
} as const;

// CSS Custom Properties mapping
export const FOCUS_CSS_PROPERTIES = {
  '--ds-focus-ring-width': '2px',
  '--ds-focus-ring-offset': '2px',
  '--ds-focus-ring-color': '#4169e1',
  '--ds-focus-ring-color-light': '#6a8df0',
  '--ds-focus-ring-color-dark': '#1e40af',
  '--ds-focus-border-width': '1px',
  '--ds-focus-border-color': '#4169e1',
  '--ds-focus-shadow-blur': '0',
  '--ds-focus-shadow-spread': '2px',
  '--ds-focus-shadow-color': 'rgba(65, 105, 225, 0.3)',
  '--ds-focus-background-color': 'rgba(65, 105, 225, 0.08)',
  '--ds-focus-background-light': 'rgba(65, 105, 225, 0.04)',
  '--ds-focus-background-dark': 'rgba(65, 105, 225, 0.12)',
  '--ds-focus-transition-duration': '150ms',
  '--ds-focus-transition-timing': 'ease-out',
  '--ds-focus-transition-properties': 'outline, border, background-color, box-shadow',
  '--ds-focus-button-padding-adjustment': '0px',
  '--ds-focus-input-padding-adjustment': '0px',
  '--ds-focus-node-padding-adjustment': '0px'
} as const;

// Component-specific focus configurations
export const COMPONENT_FOCUS_CONFIGS = {
  button: {
    state: 'enhanced' as FocusStateType,
    management: {
      tabIndex: 0,
      ariaLabel: 'Focusable button element',
      role: 'button'
    }
  },
  input: {
    state: 'enhanced' as FocusStateType,
    management: {
      tabIndex: 0,
      ariaLabel: 'Focusable input element',
      role: 'textbox'
    }
  },
  node: {
    state: 'enhanced' as FocusStateType,
    management: {
      tabIndex: 0,
      ariaLabel: 'Focusable tech tree node',
      role: 'button'
    }
  },
  link: {
    state: 'subtle' as FocusStateType,
    management: {
      tabIndex: 0,
      ariaLabel: 'Focusable link element',
      role: 'link'
    }
  },
  modal: {
    state: 'enhanced' as FocusStateType,
    management: {
      tabIndex: 0,
      ariaLabel: 'Focusable modal element',
      role: 'dialog'
    }
  },
  'skip-link': {
    state: 'enhanced' as FocusStateType,
    management: {
      tabIndex: 0,
      ariaLabel: 'Skip to main content',
      role: 'link'
    }
  }
} as const;

// Keyboard navigation patterns
export const KEYBOARD_NAVIGATION_PATTERNS = {
  // Standard tab navigation
  tabSequence: {
    keys: ['Tab', 'Shift+Tab'] as const,
    behavior: 'sequential',
    description: 'Standard forward/backward tab navigation through interactive elements'
  },
  
  // Arrow key navigation for specific components
  arrowNavigation: {
    keys: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'] as const,
    behavior: 'directional',
    description: 'Directional navigation for grids, lists, and spatial layouts'
  },
  
  // Action keys
  actionKeys: {
    keys: ['Enter', 'Space'] as const,
    behavior: 'activate',
    description: 'Activation keys for buttons and interactive elements'
  },
  
  // Escape key for modals/dropdowns
  escapeKey: {
    keys: ['Escape'] as const,
    behavior: 'dismiss',
    description: 'Dismiss modals, dropdowns, and close dialogs'
  },
  
  // Home/End for container navigation
  containerNavigation: {
    keys: ['Home', 'End'] as const,
    behavior: 'container-bounds',
    description: 'Jump to first/last element in container'
  }
} as const;

// Focus trap configurations
export const FOCUS_TRAP_CONFIGS = {
  modal: {
    trapSelector: '[role="dialog"], .modal',
    focusableSelector: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    initialFocus: 'button, [role="button"], input, select, textarea',
    returnFocusTo: null // Will be set dynamically
  },
  dropdown: {
    trapSelector: '[role="menu"], .dropdown-menu',
    focusableSelector: '[role="menuitem"], button, a, input, select',
    initialFocus: '[role="menuitem"], button',
    returnFocusTo: null
  },
  tabs: {
    trapSelector: '[role="tablist"]',
    focusableSelector: '[role="tab"], [role="tabpanel"]',
    initialFocus: '[role="tab"][aria-selected="true"]',
    returnFocusTo: null
  }
} as const;

// Accessibility focus requirements
export const FOCUS_ACCESSIBILITY_REQUIREMENTS = {
  // WCAG 2.1 AA compliance
  wcagCompliance: {
    contrastRatio: '3:1', // Minimum contrast for focus indicators
    minimumSize: '44px', // Minimum touch target size
    visibleFocus: true, // Focus must be visible
    nonColorOnly: true // Focus cannot rely solely on color
  },
  
  // Focus order requirements
  focusOrder: {
    logical: true, // Focus should follow logical reading order
    noKeyboardTraps: true, // No keyboard-only traps
    predictable: true // Focus movement should be predictable
  },
  
  // Screen reader compatibility
  screenReader: {
    announceFocus: true, // Focus changes should be announced
    describePurpose: true, // Elements should describe their purpose
    stateAnnouncements: true // State changes should be announced
  }
} as const;

// Focus validation utilities
export class FocusStateValidator {
  /**
   * Validates if a focus state configuration meets accessibility requirements
   */
  static validateFocusState(config: FocusStateConfig): {
    isValid: boolean;
    issues: string[];
    warnings: string[];
  } {
    const issues: string[] = [];
    const warnings: string[] = [];
    
    // Check contrast ratio (simplified check)
    const ringColor = config.ring.color;
    if (!this.isValidCssColor(ringColor)) {
      issues.push('Invalid focus ring color format');
    }
    
    // Check minimum visibility requirements
    if (parseInt(config.ring.width.toString()) < 1) {
      issues.push('Focus ring width below minimum (1px)');
    }
    
    // Check for color-only indication
    const hasNonColorIndicator = 
      parseInt(config.ring.width.toString()) > 0 || 
      config.shadow.spread !== 0 ||
      config.background.color !== 'transparent';
    
    if (!hasNonColorIndicator) {
      warnings.push('Focus state relies only on color - consider adding non-color indicators');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      warnings
    };
  }
  
  /**
   * Validates CSS color format
   */
  private static isValidCssColor(color: string): boolean {
    const cssColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\(|^rgba\(/;
    return cssColorRegex.test(color) || 
           ['red', 'blue', 'green', 'black', 'white', 'transparent'].includes(color.toLowerCase());
  }
  
  /**
   * Validates focus order in a container
   */
  static validateFocusOrder(container: Element): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    // Check for proper tabindex usage
    focusableElements.forEach((element, index) => {
      const tabindex = element.getAttribute('tabindex');
      if (tabindex && parseInt(tabindex) < 0) {
        issues.push(`Element at index ${index} has invalid tabindex: ${tabindex}`);
      }
    });
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

// Focus state utilities
export class FocusStateUtils {
  /**
   * Generate CSS custom properties for a focus state
   */
  static generateCssProperties(stateType: FocusStateType): Record<string, string> {
    const config = FOCUS_STATE_TOKENS[stateType];
    
    return {
      '--focus-ring-width': config.ring.width.toString(),
      '--focus-ring-color': config.ring.color,
      '--focus-border-color': config.border.color,
      '--focus-shadow-color': config.shadow.color,
      '--focus-background-color': config.background.color,
      '--focus-transition-duration': config.animation.duration
    };
  }
  
  /**
   * Get appropriate focus state for component type
   */
  static getFocusStateForComponent(componentType: ComponentFocusType): FocusStateType {
    const config = COMPONENT_FOCUS_CONFIGS[componentType];
    return config?.state || 'default';
  }
  
  /**
   * Check if element should receive focus
   */
  static shouldReceiveFocus(element: Element): boolean {
    const disabled = element.hasAttribute('disabled');
    const hidden = element.getAttribute('aria-hidden') === 'true';
    const tabindex = element.getAttribute('tabindex');
    const invalidTabindex = tabindex && parseInt(tabindex) < 0;
    
    return !disabled && !hidden && !invalidTabindex;
  }
  
  /**
   * Find next focusable element in a container
   */
  static findNextFocusable(container: Element, currentElement: Element | null, direction: 'forward' | 'backward'): Element | null {
    const focusableElements = Array.from(container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(this.shouldReceiveFocus) as Element[];
    
    if (focusableElements.length === 0) return null;
    
    const currentIndex = currentElement ? focusableElements.indexOf(currentElement) : -1;
    let nextIndex: number;
    
    if (direction === 'forward') {
      nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
    }
    
    return focusableElements[nextIndex] || null;
  }
}

export default FOCUS_STATE_TOKENS;