import { Injectable } from '@angular/core';

import { DiplomaticRelation } from '../enums/DiplomaticRelation';
import { EstateType } from '../enums/EstateType';
import { EventType } from '../enums/EventType';
import { FloraType } from '../enums/FloraType';
import { FloraUseType } from '../enums/FloraUseType';
import { GoodsType } from '../enums/GoodsType';
import { GuildType } from '../enums/GuildType';
import { MapStructureType } from '../enums/MapStructureType';
import { MarketCondition } from '../enums/MarketCondition';
import { SettlementType } from '../enums/SettlementType';
import { StructureAction } from '../enums/StructureActions';
import { StructureEffect } from '../enums/StructureEffect';
import { StructureType } from '../enums/StructureType';
import { GoodCategory, Rarity } from '../models/goods.model';

export interface TechEnumOption {
  value: string;
  label: string;
  source: 'enum' | 'model' | 'fallback';
}

@Injectable({ providedIn: 'root' })
export class TechEnumAdapterService {
  private readonly locale = 'en';

  getStructureTypeOptions(extraValues: string[] = []): TechEnumOption[] {
    return this.buildOptionsFromEnum(StructureType, extraValues);
  }

  getStructureEffectOptions(extraValues: string[] = []): TechEnumOption[] {
    return this.buildOptionsFromEnum(StructureEffect, extraValues);
  }

  getStructureActionOptions(extraValues: string[] = []): TechEnumOption[] {
    return this.buildOptionsFromEnum(StructureAction, extraValues);
  }

  getGoodsTypeOptions(extraValues: string[] = []): TechEnumOption[] {
    return this.buildOptionsFromEnum(GoodsType, extraValues);
  }

  getGuildTypeOptions(extraValues: string[] = []): TechEnumOption[] {
    return this.buildOptionsFromEnum(GuildType, extraValues);
  }

  getEventTypeOptions(extraValues: string[] = []): TechEnumOption[] {
    return this.buildOptionsFromEnum(EventType, extraValues);
  }

  getDiplomaticRelationOptions(extraValues: string[] = []): TechEnumOption[] {
    return this.buildOptionsFromEnum(DiplomaticRelation, extraValues);
  }

  getMarketConditionOptions(extraValues: string[] = []): TechEnumOption[] {
    return this.buildOptionsFromEnum(MarketCondition, extraValues);
  }

  getFloraTypeOptions(extraValues: string[] = []): TechEnumOption[] {
    return this.buildOptionsFromEnum(FloraType, extraValues);
  }

  getFloraUseTypeOptions(extraValues: string[] = []): TechEnumOption[] {
    return this.buildOptionsFromEnum(FloraUseType, extraValues);
  }

  getMapStructureTypeOptions(extraValues: string[] = []): TechEnumOption[] {
    return this.buildOptionsFromEnum(MapStructureType, extraValues);
  }

  getSettlementTypeOptions(extraValues: string[] = []): TechEnumOption[] {
    return this.buildOptionsFromEnum(SettlementType, extraValues);
  }

  getEstateTypeOptions(extraValues: string[] = []): TechEnumOption[] {
    return this.buildOptionsFromEnum(EstateType, extraValues);
  }

  getGoodCategoryOptions(extraValues: string[] = []): TechEnumOption[] {
    return this.buildOptionsFromEnum(GoodCategory, extraValues, 'model');
  }

  getRarityOptions(extraValues: string[] = []): TechEnumOption[] {
    return this.buildOptionsFromEnum(Rarity, extraValues, 'model');
  }

  private buildOptionsFromEnum<T extends Record<string, string>>(
    enumType: T,
    fallbackValues: string[] = [],
    source: TechEnumOption['source'] = 'enum'
  ): TechEnumOption[] {
    const enumValues = this.extractEnumValues(enumType);
    const missingValues = this.extractMissingValues(enumValues, fallbackValues);

    const options: TechEnumOption[] = [
      ...enumValues.map((value) => this.toOption(value, source)),
      ...missingValues.map((value) => this.toOption(value, 'fallback')),
    ];

    return this.sortOptions(this.dedupeOptions(options));
  }

  private extractEnumValues<T extends Record<string, string>>(enumType: T): string[] {
    return Array.from(new Set(Object.values(enumType) as string[]));
  }

  private extractMissingValues(knownValues: string[], candidates: string[]): string[] {
    const knownSet = new Set(knownValues);
    return candidates.filter((candidate) => !knownSet.has(candidate));
  }

  private dedupeOptions(options: TechEnumOption[]): TechEnumOption[] {
    const seen = new Set<string>();
    const unique: TechEnumOption[] = [];

    for (const option of options) {
      if (seen.has(option.value)) {
        continue;
      }

      seen.add(option.value);
      unique.push(option);
    }

    return unique;
  }

  private sortOptions(options: TechEnumOption[]): TechEnumOption[] {
    return [...options].sort((a, b) => a.label.localeCompare(b.label, this.locale));
  }

  private toOption(value: string, source: TechEnumOption['source']): TechEnumOption {
    return {
      value,
      label: this.formatLabel(value),
      source,
    };
  }

  private formatLabel(rawValue: string): string {
    if (!rawValue) {
      return 'Unknown';
    }

    const spaced = rawValue
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .trim();

    return spaced
      .split(' ')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
