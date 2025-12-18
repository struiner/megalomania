import { Injectable } from '@angular/core';

import { HazardType, HAZARD_DISPLAY_ORDER } from '../enums/HazardType';
import {
  HazardIconDefinition,
  HazardIconValidationIssue,
  HazardIconValidationIssueKind,
} from '../types/hazard';

@Injectable({ providedIn: 'root' })
export class HazardIconRegistryService {
  private static readonly GRID_SIZE = 16;
  private static readonly PADDING = 1;
  private static readonly STROKE = 1;

  private readonly registry: HazardIconDefinition[] = this.buildRegistry();

  getIcons(): HazardIconDefinition[] {
    return this.registry;
  }

  labelFor(type: HazardType): string {
    const entry = this.registry.find((definition) => definition.type === type);
    return entry?.label ?? this.toLabel(type);
  }

  sortHazards(selection: HazardType[]): HazardType[] {
    const normalized = new Set(selection);
    return HAZARD_DISPLAY_ORDER.filter((hazard) => normalized.has(hazard));
  }

  validateRegistry(): HazardIconValidationIssue[] {
    const issues: HazardIconValidationIssue[] = [];
    const seenIconIds = new Map<string, HazardType[]>();
    const placeholderTypes: HazardType[] = [];
    const emptySpriteTypes: HazardType[] = [];

    this.registry.forEach((definition) => {
      if (!definition.iconId.trim()) {
        issues.push(this.issue('missing-icon-id', `Missing icon id for ${definition.label}`, [definition.type]));
      }

      if (!definition.spritePath.trim()) {
        emptySpriteTypes.push(definition.type);
      }

      if (definition.status === 'placeholder') {
        placeholderTypes.push(definition.type);
      }

      const bucket = seenIconIds.get(definition.iconId) ?? [];
      bucket.push(definition.type);
      seenIconIds.set(definition.iconId, bucket);
    });

    if (placeholderTypes.length) {
      issues.push(
        this.issue(
          'placeholder-icon',
          `Placeholder icons: ${this.toList(placeholderTypes)}. Assign art assets before production use; do not block exports.`,
          placeholderTypes,
        ),
      );
    }

    if (emptySpriteTypes.length) {
      issues.push(
        this.issue(
          'empty-sprite-path',
          `Sprite paths are empty for ${this.toList(emptySpriteTypes)}; they will fall back to placeholders until assets land.`,
          emptySpriteTypes,
        ),
      );
    }

    seenIconIds.forEach((types, iconId) => {
      if (types.length > 1) {
        issues.push(this.issue('duplicate-icon-id', `Duplicate icon id ${iconId}`, types));
      }
    });

    return issues;
  }

  private buildRegistry(): HazardIconDefinition[] {
    const baseDefinitions: HazardIconDefinition[] = [
      this.definition(HazardType.Fire, '#f25f4c', 'ember-on-parchment dual-tone for clarity'),
      this.definition(HazardType.Flood, '#6ec7e0', 'cool palette for water and condensation cues'),
      this.definition(HazardType.Electrical, '#f2b705', 'high-contrast zigzag suited to 16px grid'),
      this.definition(HazardType.Intrusion, '#a39ad0', 'interior shield motif; allow overlay badges'),
      this.definition(HazardType.ToxicGas, '#9bd97c', 'fume plume with breathing-mask silhouette'),
      this.definition(HazardType.Vacuum, '#9fb6c6', 'airlock chevrons and pressure arrows'),
      this.definition(HazardType.StructuralFailure, '#d48d5c', 'cracked beam silhouette on orthogonal grid'),
      this.definition(HazardType.Fauna, '#f28eb2', 'fang + paw print pairing for creature threats'),
    ];

    const definitionMap = new Map<HazardType, HazardIconDefinition>();
    baseDefinitions.forEach((definition) => definitionMap.set(definition.type, definition));

    HAZARD_DISPLAY_ORDER.forEach((type) => {
      if (!definitionMap.has(type)) {
        definitionMap.set(type, this.placeholderDefinition(type));
      }
    });

    return HAZARD_DISPLAY_ORDER.map((type) => definitionMap.get(type) as HazardIconDefinition);
  }

  private definition(type: HazardType, badgeTint: string, guidance: string): HazardIconDefinition {
    const iconId = this.toIconId(type);

    return {
      type,
      label: this.toLabel(type),
      iconId,
      spritePath: `assets/hazards/${iconId}_${HazardIconRegistryService.GRID_SIZE}.png`,
      gridSize: HazardIconRegistryService.GRID_SIZE,
      padding: HazardIconRegistryService.PADDING,
      stroke: HazardIconRegistryService.STROKE,
      badgeTint,
      status: 'placeholder',
      contrast: 'dual',
      notes: [
        'Align strokes to the 1px grid; avoid sub-pixel alpha.',
        `16px grid with ${HazardIconRegistryService.PADDING}px padding reserves room for severity badges.`,
        guidance,
      ],
    };
  }

  private placeholderDefinition(type: HazardType): HazardIconDefinition {
    const iconId = `${this.toIconId(type)}_placeholder`;

    return {
      type,
      label: this.toLabel(type),
      iconId,
      spritePath: '',
      gridSize: HazardIconRegistryService.GRID_SIZE,
      padding: HazardIconRegistryService.PADDING,
      stroke: HazardIconRegistryService.STROKE,
      badgeTint: '#88929e',
      status: 'placeholder',
      contrast: 'dual',
      notes: [
        'Placeholder slot; swap once hazard art is sourced.',
        'Use same 16px grid and 1px stroke as other hazards to stay consistent.',
      ],
    };
  }

  private toIconId(type: HazardType): string {
    return `hazard_${this.normalize(type)}`;
  }

  private toLabel(type: HazardType): string {
    return this.normalize(type)
      .split('_')
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
  }

  private normalize(type: HazardType): string {
    return type.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
  }

  private issue(
    kind: HazardIconValidationIssueKind,
    message: string,
    affectedTypes: HazardType[],
  ): HazardIconValidationIssue {
    return { kind, message, affectedTypes };
  }

  private toList(types: HazardType[]): string {
    return this.sortHazards(types)
      .map((type) => this.toLabel(type))
      .join(', ');
  }
}
