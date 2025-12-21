import { TechEnumOption } from '../../../../services/tech-enum-adapter.service';
import { TechNodeEffects, TechTreeValidationIssue } from '../../../../models/tech-tree.models';

/**
 * Abstract base class for all effect editors
 */
export abstract class BaseEffectEditor {
  /**
   * Unique identifier for this effect type
   */
  abstract readonly effectType: string;
  
  /**
   * Display label for the effect type
   */
  abstract readonly label: string;
  
  /**
   * Description of what this effect type does
   */
  abstract readonly description: string;
  
  /**
   * Validate the current effect configuration
   */
  abstract validate(effects: Partial<TechNodeEffects>): TechTreeValidationIssue[];
  
  /**
   * Get available options for this effect type
   */
  abstract getOptions(): TechEnumOption[];
  
  /**
   * Check if this effect type is enabled/available
   */
  abstract isEnabled(): boolean;
}

/**
 * Input configuration for effect editors
 */
export interface EffectEditorInput {
  /**
   * Current effect value(s)
   */
  value: any;
  
  /**
   * Available options for selection
   */
  options: TechEnumOption[];
  
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  
  /**
   * Placeholder text for empty state
   */
  placeholder?: string;
  
  /**
   * Help text to guide users
   */
  helpText?: string;
}

/**
 * Output configuration for effect editors
 */
export interface EffectEditorOutput {
  /**
   * The updated effect value
   */
  value: any;
  
  /**
   * Validation issues for this specific effect
   */
  validationIssues: TechTreeValidationIssue[];
}

/**
 * Factory interface for creating effect editors
 */
export interface EffectEditorFactory {
  /**
   * Create an effect editor for the given type
   */
  createEditor(effectType: string): BaseEffectEditor | null;
  
  /**
   * Get all available effect types
   */
  getAvailableEffectTypes(): string[];
  
  /**
   * Check if an effect type is supported
   */
  supportsEffectType(effectType: string): boolean;
}

/**
 * Registry for effect editors
 */
export interface EffectEditorRegistry {
  /**
   * Register an effect editor
   */
  registerEditor(editor: BaseEffectEditor): void;
  
  /**
   * Get an editor by type
   */
  getEditor(effectType: string): BaseEffectEditor | null;
  
  /**
   * Get all registered editors
   */
  getAllEditors(): BaseEffectEditor[];
  
  /**
   * Get editors that can handle the given effects object
   */
  getApplicableEditors(effects: Partial<TechNodeEffects>): BaseEffectEditor[];
}

/**
 * Validation context for effect editors
 */
export interface EffectValidationContext {
  /**
   * Current node ID being validated
   */
  nodeId: string;
  
  /**
   * Full effects object being validated
   */
  effects: Partial<TechNodeEffects>;
  
  /**
   * Path to this effect in the node structure
   */
  path: string;
  
  /**
   * Whether to perform strict validation
   */
  strict: boolean;
}

/**
 * Configuration for compositional effects system
 */
export interface EffectsConfiguration {
  /**
   * Whether to show advanced effects
   */
  showAdvanced: boolean;
  
  /**
   * Whether to group effects by category
   */
  groupByCategory: boolean;
  
  /**
   * Default validation mode
   */
  validationMode: 'strict' | 'lenient' | 'off';
  
  /**
   * Custom effect type configurations
   */
  customEffectTypes?: Record<string, {
    enabled: boolean;
    priority: number;
    category: string;
  }>;
}