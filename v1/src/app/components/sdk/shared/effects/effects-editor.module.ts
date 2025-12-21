import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import all effect editor components
import { StructureUnlocksEditorComponent } from './structure-unlocks-editor.component';
import { GoodsUnlocksEditorComponent } from './goods-unlocks-editor.component';
import { ResearchRateModifierEditorComponent } from './research-rate-modifier-editor.component';
import { CompositionalEffectsEditorComponent } from './compositional-effects-editor.component';

// Import services
import { EffectEditorRegistryService } from './effect-editor-registry.service';

/**
 * Effects Editor Module
 * 
 * This module provides the complete effects editing system including:
 * - Type-specific effect editors
 * - Compositional effects management
 * - Validation integration
 * - Registry for editor discovery
 */
@NgModule({
  declarations: [
    StructureUnlocksEditorComponent,
    GoodsUnlocksEditorComponent,
    ResearchRateModifierEditorComponent,
    CompositionalEffectsEditorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CompositionalEffectsEditorComponent,
    StructureUnlocksEditorComponent,
    GoodsUnlocksEditorComponent,
    ResearchRateModifierEditorComponent
  ],
  providers: [
    EffectEditorRegistryService
  ]
})
export class EffectsEditorModule {
  constructor(
    @Optional() @SkipSelf() parentModule: EffectsEditorModule,
    private editorRegistry: EffectEditorRegistryService
  ) {
    if (parentModule) {
      throw new Error('EffectsEditorModule is already loaded. Import it in the AppModule only.');
    }

    // Register all effect editors
    this.registerEffectEditors();
  }

  /**
   * Register all available effect editors with the registry
   */
  private registerEffectEditors(): void {
    // Structure unlocks editor
    this.editorRegistry.registerEditor(new StructureUnlocksEditorComponent());
    
    // Goods unlocks editor
    this.editorRegistry.registerEditor(new GoodsUnlocksEditorComponent());
    
    // Research rate modifier editor
    this.editorRegistry.registerEditor(new ResearchRateModifierEditorComponent());

    // TODO: Register additional editors as they are implemented:
    // - Settlements unlocks editor
    // - Guilds unlocks editor
    // - Structure effects editor
    // - Flora unlocks editor
    // - Settlement specialization editor
    // - Guild reputation editor
    // - Metadata editor

    console.log('✅ Effects editors registered:', this.editorRegistry.getAllEditors().map(e => e.effectType));
  }
}