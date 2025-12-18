import { Injectable } from '@angular/core';
import { GoodsType } from '../enums/GoodsType';
import { GuildType } from '../enums/GuildType';
import { SettlementType } from '../enums/SettlementType';
import { StructureType } from '../enums/StructureType';
import { normalizeIdentifier } from './tech-identifier-normalizer';

export type TechIconCategory = 'generic' | 'structure' | 'goods' | 'guild' | 'settlement';

export interface TechIconDefinition {
  id: string;
  label: string;
  category: TechIconCategory;
  source?: string;
  overlays?: string[];
  frame?: 'shared' | 'accented';
  notes?: string;
}

export interface TechIconOption extends TechIconDefinition {}

@Injectable({ providedIn: 'root' })
export class TechIconRegistryService {
  private readonly baseIcons: TechIconDefinition[] = [
    {
      id: 'generic_research',
      label: 'Generic Research',
      category: 'generic',
      frame: 'shared',
      notes: 'Use when no domain hook exists; shared frame keeps DLC overlays consistent.',
    },
    {
      id: 'generic_infrastructure',
      label: 'Infrastructure',
      category: 'generic',
      frame: 'shared',
      notes: 'Civic and pacing techs that do not unlock discrete assets.',
    },
  ];

  private readonly registry: TechIconDefinition[] = this.buildRegistry();

  getPickerOptions(): TechIconOption[] {
    return this.registry;
  }

  getIconById(id?: string | null): TechIconOption | undefined {
    if (!id) return undefined;
    const normalized = normalizeIdentifier(id);
    return this.registry.find((entry) => entry.id === normalized);
  }

  private buildRegistry(): TechIconDefinition[] {
    const definitions: TechIconDefinition[] = [...this.baseIcons];

    const structureIcons = this.buildEnumBackedIcons('structure', 'StructureType', [
      StructureType.Lumberyard,
      StructureType.Brickworks,
      StructureType.Docks,
      StructureType.Harbor,
      StructureType.TownHall,
    ]);

    const goodsIcons = this.buildEnumBackedIcons('goods', 'GoodsType', [
      GoodsType.Wood,
      GoodsType.Coal,
      GoodsType.Mead,
      GoodsType.MetalGoods,
    ]);

    const guildIcons = this.buildEnumBackedIcons('guild', 'GuildType', [
      GuildType.Merchants,
      GuildType.Scholars,
    ]);

    const settlementIcons = this.buildEnumBackedIcons('settlement', 'SettlementType', [
      SettlementType.TradingPost,
      SettlementType.Hamlet,
    ]);

    definitions.push(...structureIcons, ...goodsIcons, ...guildIcons, ...settlementIcons);

    return definitions.sort((left, right) => {
      if (left.category !== right.category) {
        return left.category.localeCompare(right.category);
      }
      return left.label.localeCompare(right.label);
    });
  }

  private buildEnumBackedIcons(
    category: TechIconCategory,
    sourceLabel: string,
    values: string[],
  ): TechIconDefinition[] {
    return values.map((value) => ({
      id: `${category}_${normalizeIdentifier(value)}`,
      label: this.toLabel(value),
      category,
      source: sourceLabel,
      overlays: ['culture_overlay'],
      frame: 'shared',
      notes: 'Overlay-friendly icon with shared frame to support DLC swaps.',
    }));
  }

  private toLabel(value: string): string {
    return value
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
  }
}
