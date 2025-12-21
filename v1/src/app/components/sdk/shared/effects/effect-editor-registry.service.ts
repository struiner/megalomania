import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseEffectEditor, EffectEditorRegistry } from './effect-editor.types';
import { TechNodeEffects } from '../../../../models/tech-tree.models';

/**
 * Service for managing effect editor registration and discovery
 */
@Injectable({
  providedIn: 'root'
})
export class EffectEditorRegistryService implements EffectEditorRegistry {
  private editors = new Map<string, BaseEffectEditor>();
  private editorsSubject = new BehaviorSubject<BaseEffectEditor[]>([]);

  /**
   * Observable of all registered editors
   */
  editors$: Observable<BaseEffectEditor[]> = this.editorsSubject.asObservable();

  /**
   * Register an effect editor
   */
  registerEditor(editor: BaseEffectEditor): void {
    if (this.editors.has(editor.effectType)) {
      console.warn(`Effect editor for type '${editor.effectType}' is already registered. Replacing...`);
    }
    
    this.editors.set(editor.effectType, editor);
    this.updateEditorsList();
  }

  /**
   * Get an editor by type
   */
  getEditor(effectType: string): BaseEffectEditor | null {
    return this.editors.get(effectType) || null;
  }

  /**
   * Get all registered editors
   */
  getAllEditors(): BaseEffectEditor[] {
    return Array.from(this.editors.values());
  }

  /**
   * Get editors that can handle the given effects object
   */
  getApplicableEditors(effects: Partial<TechNodeEffects>): BaseEffectEditor[] {
    return this.getAllEditors().filter(editor => {
      const value = (effects as any)[editor.effectType];
      return value !== undefined && value !== null && 
             (Array.isArray(value) ? value.length > 0 : true);
    });
  }

  /**
   * Check if an effect type is supported
   */
  supportsEffectType(effectType: string): boolean {
    return this.editors.has(effectType);
  }

  /**
   * Unregister an editor by type
   */
  unregisterEditor(effectType: string): boolean {
    const removed = this.editors.delete(effectType);
    if (removed) {
      this.updateEditorsList();
    }
    return removed;
  }

  /**
   * Clear all registered editors
   */
  clearEditors(): void {
    this.editors.clear();
    this.updateEditorsList();
  }

  /**
   * Get editors by category
   */
  getEditorsByCategory(category: string): BaseEffectEditor[] {
    // This would be implemented if we add category support to the BaseEffectEditor
    return this.getAllEditors();
  }

  /**
   * Get enabled editors only
   */
  getEnabledEditors(): BaseEffectEditor[] {
    return this.getAllEditors().filter(editor => editor.isEnabled());
  }

  /**
   * Get editors with validation issues for the given effects
   */
  getEditorsWithValidationIssues(effects: Partial<TechNodeEffects>): Array<{
    editor: BaseEffectEditor;
    issues: any[];
  }> {
    return this.getApplicableEditors(effects).map(editor => ({
      editor,
      issues: editor.validate(effects)
    }));
  }

  /**
   * Update the editors list observable
   */
  private updateEditorsList(): void {
    this.editorsSubject.next(this.getAllEditors());
  }
}