import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';


import { TileInfo, TilemapProject } from '../../services/mk2/tools/tilemap-analysis.service';
import { TileBasicPropertiesComponent } from './tile-basic-properties.component';
import { TileMetadataEditorComponent } from './tile-metadata-editor.component';
import { TileTagsEditorComponent } from './tile-tags-editor.component';
import { TileCustomPropertiesComponent } from './tile-custom-properties.component';

@Component({
  selector: 'app-tile-properties-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSliderModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatTooltipModule,
    TileBasicPropertiesComponent,
    TileMetadataEditorComponent,
    TileTagsEditorComponent,
    TileCustomPropertiesComponent
  ],
  templateUrl: './tile-properties-editor.component.html',
  styleUrls: ['./tile-properties-editor.component.scss']
})
export class TilePropertiesEditorComponent implements OnInit, OnDestroy {
  @Input() selectedTiles: TileInfo[] = [];
  @Input() project: TilemapProject | null = null;

  @Output() tilesUpdated = new EventEmitter<{ tileIds: string[], updates: Partial<TileInfo> }>();

  // Form state
  editForm: Partial<TileInfo> = {};
  hasChanges = false;
  
  // Categories
  availableCategories: string[] = [];
  availableSubcategories: string[] = [];

  // Tags
  newTag = '';
  suggestedTags: string[] = [];

  // Properties
  newPropertyKey = '';
  newPropertyValue = '';

  private destroy$ = new Subject<void>();
  private originalForm: Partial<TileInfo> = {};

  constructor() {}

  // Getters and setters for metadata properties to handle two-way binding
  get metadataRarity(): string {
    return this.editForm.metadata?.rarity || 'common';
  }

  set metadataRarity(value: string) {
    this.ensureMetadata();
    this.editForm.metadata!.rarity = value as any;
  }

  get metadataCost(): number {
    return this.editForm.metadata?.cost || 10;
  }

  set metadataCost(value: number) {
    this.ensureMetadata();
    this.editForm.metadata!.cost = value;
  }

  get metadataUnlockLevel(): number {
    return this.editForm.metadata?.unlockLevel || 1;
  }

  set metadataUnlockLevel(value: number) {
    this.ensureMetadata();
    this.editForm.metadata!.unlockLevel = value;
  }

  get metadataSeason(): string {
    return this.editForm.metadata?.season || '';
  }

  set metadataSeason(value: string) {
    this.ensureMetadata();
    this.editForm.metadata!.season = value;
  }

  get metadataAnimated(): boolean {
    return this.editForm.metadata?.animated || false;
  }

  set metadataAnimated(value: boolean) {
    this.ensureMetadata();
    this.editForm.metadata!.animated = value;
  }

  get metadataFrames(): number {
    return this.editForm.metadata?.frames || 2;
  }

  set metadataFrames(value: number) {
    this.ensureMetadata();
    this.editForm.metadata!.frames = value;
  }

  private ensureMetadata(): void {
    if (!this.editForm.metadata) {
      this.editForm.metadata = {
        rarity: 'common',
        cost: 10,
        unlockLevel: 1
      };
    }
  }

  ngOnInit(): void {
    console.log('🎨 TilePropertiesEditor initialized with:', {
      selectedTiles: this.selectedTiles.length,
      project: !!this.project,
      tileNames: this.selectedTiles.map(t => t.name || t.id)
    });
    this.updateForm();
    this.updateCategories();
    this.updateSuggestedTags();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(): void {
    this.updateForm();
    this.updateCategories();
    this.updateSuggestedTags();
  }

  private updateForm(): void {
    if (this.selectedTiles.length === 0) {
      this.editForm = {};
      this.hasChanges = false;
      return;
    }

    if (this.selectedTiles.length === 1) {
      // Single tile editing
      this.editForm = { ...this.selectedTiles[0] };
    } else {
      // Bulk editing - find common values
      this.editForm = this.getCommonValues();
    }

    // Ensure metadata is initialized
    if (!this.editForm.metadata) {
      this.editForm.metadata = {
        rarity: 'common',
        cost: 10,
        unlockLevel: 1
      };
    }

    // Ensure tags is initialized
    if (!this.editForm.tags) {
      this.editForm.tags = [];
    }

    this.originalForm = { ...this.editForm };
    this.hasChanges = false;
  }

  private getCommonValues(): Partial<TileInfo> {
    const first = this.selectedTiles[0];
    const common: Partial<TileInfo> = {
      category: first.category,
      subcategory: first.subcategory,
      tags: [...first.tags],
      properties: { ...first.properties },
      metadata: { ...first.metadata }
    };

    // Check if all tiles have the same values
    for (let i = 1; i < this.selectedTiles.length; i++) {
      const tile = this.selectedTiles[i];
      
      if (tile.category !== common.category) common.category = '';
      if (tile.subcategory !== common.subcategory) common.subcategory = '';
      
      // For tags, only keep common ones
      common.tags = common.tags?.filter(tag => tile.tags.includes(tag)) || [];
      
      // For metadata, only keep common values
      if (tile.metadata.rarity !== common.metadata?.rarity) {
        common.metadata!.rarity = 'common';
      }
    }

    return common;
  }

  private updateCategories(): void {
    if (this.project) {
      this.availableCategories = this.project.categories;
      this.updateSubcategories();
    }
  }

  private updateSubcategories(): void {
    if (this.project && this.editForm.category) {
      this.availableSubcategories = this.project.subcategories[this.editForm.category] || [];
    } else {
      this.availableSubcategories = [];
    }
  }

  private updateSuggestedTags(): void {
    if (!this.editForm.category) {
      this.suggestedTags = [];
      return;
    }

    // Generate suggested tags based on category
    const categoryTags: Record<string, string[]> = {
      terrain: ['ground', 'walkable', 'solid', 'natural'],
      structures: ['building', 'wall', 'roof', 'entrance'],
      objects: ['interactive', 'collectible', 'decoration', 'furniture'],
      characters: ['npc', 'enemy', 'friendly', 'animated'],
      effects: ['particle', 'light', 'magic', 'temporary'],
      ui: ['button', 'icon', 'panel', 'interface']
    };

    const suggested = categoryTags[this.editForm.category] || [];
    this.suggestedTags = suggested.filter(tag => 
      !this.editForm.tags?.includes(tag)
    );
  }

  onCategoryChange(): void {
    this.updateSubcategories();
    this.updateSuggestedTags();
    this.markChanged();
  }

  markChanged(): void {
    this.hasChanges = true;
  }

  addTag(): void {
    if (!this.newTag.trim()) return;
    
    const tag = this.newTag.trim().toLowerCase();
    if (!this.editForm.tags) this.editForm.tags = [];
    
    if (!this.editForm.tags.includes(tag)) {
      this.editForm.tags.push(tag);
      this.markChanged();
      this.updateSuggestedTags();
    }
    
    this.newTag = '';
  }

  removeTag(tag: string): void {
    if (!this.editForm.tags) return;
    
    const index = this.editForm.tags.indexOf(tag);
    if (index >= 0) {
      this.editForm.tags.splice(index, 1);
      this.markChanged();
      this.updateSuggestedTags();
    }
  }

  addSuggestedTag(tag: string): void {
    if (!this.editForm.tags) this.editForm.tags = [];
    
    if (!this.editForm.tags.includes(tag)) {
      this.editForm.tags.push(tag);
      this.markChanged();
      this.updateSuggestedTags();
    }
  }

  getPropertyCount(): number {
    return Object.keys(this.editForm.properties || {}).length;
  }

  getPropertyEntries(): { key: string, value: any }[] {
    if (!this.editForm.properties) return [];
    
    return Object.entries(this.editForm.properties).map(([key, value]) => ({
      key,
      value: typeof value === 'object' ? JSON.stringify(value) : String(value)
    }));
  }

  updatePropertyKey(oldKey: string, event: any): void {
    const newKey = event.target.value.trim();
    if (!newKey || newKey === oldKey) return;
    
    if (!this.editForm.properties) this.editForm.properties = {};
    
    const value = this.editForm.properties[oldKey];
    delete this.editForm.properties[oldKey];
    this.editForm.properties[newKey] = value;
    this.markChanged();
  }

  updatePropertyValue(key: string, event: any): void {
    const value = event.target.value;
    if (!this.editForm.properties) this.editForm.properties = {};
    
    // Try to parse as JSON, fallback to string
    try {
      this.editForm.properties[key] = JSON.parse(value);
    } catch {
      this.editForm.properties[key] = value;
    }
    
    this.markChanged();
  }

  removeProperty(key: string): void {
    if (!this.editForm.properties) return;
    
    delete this.editForm.properties[key];
    this.markChanged();
  }

  addProperty(): void {
    if (!this.newPropertyKey.trim()) return;
    
    if (!this.editForm.properties) this.editForm.properties = {};
    
    // Try to parse value as JSON, fallback to string
    let value: any = this.newPropertyValue;
    try {
      value = JSON.parse(this.newPropertyValue);
    } catch {
      // Keep as string
    }
    
    this.editForm.properties[this.newPropertyKey.trim()] = value;
    this.markChanged();
    
    this.newPropertyKey = '';
    this.newPropertyValue = '';
  }

  applyChanges(): void {
    if (!this.hasChanges) return;
    
    const tileIds = this.selectedTiles.map(tile => tile.id);
    const updates: Partial<TileInfo> = {};
    
    // Only include changed fields
    Object.keys(this.editForm).forEach(key => {
      const formValue = (this.editForm as any)[key];
      const originalValue = (this.originalForm as any)[key];
      
      if (JSON.stringify(formValue) !== JSON.stringify(originalValue)) {
        (updates as any)[key] = formValue;
      }
    });
    
    this.tilesUpdated.emit({ tileIds, updates });
    this.originalForm = { ...this.editForm };
    this.hasChanges = false;
  }

  resetChanges(): void {
    this.editForm = { ...this.originalForm };
    this.hasChanges = false;
    this.updateSubcategories();
    this.updateSuggestedTags();
  }

  formatCategoryName(id: string): string {
    return id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1');
  }

  trackByTag(index: number, tag: string): string {
    return tag;
  }

  trackByProperty(index: number, prop: { key: string, value: any }): string {
    return prop.key;
  }
}
