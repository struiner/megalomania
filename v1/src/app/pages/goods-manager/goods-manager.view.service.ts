import { computed, inject, Injectable, signal } from '@angular/core';

import { FloraType } from '../../enums/FloraType';
import { GoodsType } from '../../enums/GoodsType';
import { GOODS_DATA, GoodsInfo } from '../../data/goods/data';
import { Goods as GoodsBasePriceService } from '../../data/goods/basePrice';
import { GoodCategory, Rarity, UnitType } from '../../models/goods.model';

export interface GoodsDraft {
  type: GoodsType;
  name: string;
  category: GoodCategory;
  rarity: Rarity;
  complexity: number;
  unit: UnitType;
  floraSources: FloraType[];
  notes: string;
  basePrice: number;
}

export interface GoodsManagerRow extends GoodsDraft {
  id: string;
}

@Injectable()
export class GoodsManagerViewService {
  private readonly basePrice = inject(GoodsBasePriceService);

  readonly goods = signal<GoodsManagerRow[]>(this.buildFixtures());
  readonly selectedId = signal<string | null>(this.goods()[0]?.id ?? null);

  readonly filterTerm = signal('');
  readonly categoryFilter = signal<GoodCategory | 'all'>('all');
  readonly rarityFilter = signal<Rarity | 'all'>('all');

  readonly filteredGoods = computed(() => {
    const term = this.filterTerm().toLowerCase().trim();
    const category = this.categoryFilter();
    const rarity = this.rarityFilter();

    return this.goods()
      .filter((good) => (category === 'all' ? true : good.category === category))
      .filter((good) => (rarity === 'all' ? true : good.rarity === rarity))
      .filter((good) => this.matchesTerm(good, term))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  readonly selectedGood = computed(() => this.goods().find((entry) => entry.id === this.selectedId()) ?? null);

  readonly tierBreakdown = computed(() => {
    const totals = new Map<Rarity, number>([
      [Rarity.Common, 0],
      [Rarity.Uncommon, 0],
      [Rarity.Rare, 0],
      [Rarity.Exotic, 0],
      [Rarity.Legendary, 0],
    ]);

    this.goods().forEach((good) => {
      const existing = totals.get(good.rarity) ?? 0;
      totals.set(good.rarity, existing + 1);
    });

    return Array.from(totals.entries()).map(([rarity, count]) => ({ rarity, count }));
  });

  readonly categoryBreakdown = computed(() => {
    const totals = new Map<GoodCategory, number>();
    this.goods().forEach((good) => totals.set(good.category, (totals.get(good.category) ?? 0) + 1));
    return Array.from(totals.entries()).map(([category, count]) => ({ category, count }));
  });

  updateFilter(term: string): void {
    this.filterTerm.set(term);
  }

  updateCategoryFilter(category: GoodCategory | 'all'): void {
    this.categoryFilter.set(category);
  }

  updateRarityFilter(rarity: Rarity | 'all'): void {
    this.rarityFilter.set(rarity);
  }

  select(id: string): void {
    this.selectedId.set(id);
  }

  saveDraft(draft: GoodsDraft): GoodsManagerRow {
    const normalized = this.toRow(draft, this.selectedId() ?? this.createId(draft));

    this.goods.update((catalogue) => {
      const index = catalogue.findIndex((entry) => entry.id === normalized.id);
      if (index === -1) {
        return [...catalogue, normalized];
      }

      const next = [...catalogue];
      next[index] = normalized;
      return next;
    });

    this.selectedId.set(normalized.id);
    return normalized;
  }

  appendDraft(draft: GoodsDraft): GoodsManagerRow {
    const normalized = this.toRow(draft, this.createId(draft));
    this.goods.update((catalogue) => [...catalogue, normalized]);
    this.selectedId.set(normalized.id);
    return normalized;
  }

  resetFixtures(): void {
    const fixtures = this.buildFixtures();
    this.goods.set(fixtures);
    this.selectedId.set(fixtures[0]?.id ?? null);
  }

  exportPayload(): GoodsManagerRow[] {
    return this.goods()
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private buildFixtures(): GoodsManagerRow[] {
    return GOODS_DATA.map((good, index) => this.composeFixtureRow(good, index));
  }

  private composeFixtureRow(entry: GoodsInfo, index: number): GoodsManagerRow {
    return {
      id: `fixture-${index}-${entry.type}`,
      type: entry.type,
      name: entry.title,
      category: this.deriveCategory(entry.type),
      rarity: this.mapRarity(entry.rarity),
      complexity: entry.complexity,
      unit: this.deriveUnit(entry.type),
      floraSources: [],
      notes: entry.description ?? '',
      basePrice: this.basePrice.getBasePrice(entry.type) ?? entry.basePrice,
    };
  }

  private toRow(draft: GoodsDraft, id: string): GoodsManagerRow {
    return {
      ...draft,
      id,
      basePrice: draft.basePrice ?? this.basePrice.getBasePrice(draft.type) ?? 0,
      floraSources: draft.floraSources ?? [],
      notes: draft.notes?.trim() ?? '',
    };
  }

  private createId(draft: GoodsDraft): string {
    return `draft-${draft.type}-${Date.now()}`;
  }

  private matchesTerm(good: GoodsManagerRow, term: string): boolean {
    if (!term) {
      return true;
    }

    const haystack = [
      good.name,
      good.category,
      good.rarity,
      good.type,
      good.notes,
      ...good.floraSources,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(term);
  }

  private mapRarity(rating: number): Rarity {
    if (rating >= 5) return Rarity.Legendary;
    if (rating === 4) return Rarity.Exotic;
    if (rating === 3) return Rarity.Rare;
    if (rating === 2) return Rarity.Uncommon;
    return Rarity.Common;
  }

  private deriveCategory(type: GoodsType): GoodCategory {
    switch (type) {
      case GoodsType.Wood:
      case GoodsType.Iron:
      case GoodsType.Clay:
      case GoodsType.Marble:
      case GoodsType.Granite:
        return GoodCategory.RawMaterial;
      case GoodsType.Beer:
      case GoodsType.Grain:
      case GoodsType.Honey:
      case GoodsType.Cheese:
      case GoodsType.Meat:
      case GoodsType.Wine:
        return GoodCategory.Food;
      case GoodsType.MetalGoods:
      case GoodsType.Machinery:
        return GoodCategory.Tool;
      case GoodsType.Cloth:
      case GoodsType.Clothing:
      case GoodsType.Pottery:
      case GoodsType.Glassware:
        return GoodCategory.Material;
      case GoodsType.Gemstones:
      case GoodsType.Jewelry:
      case GoodsType.Spices:
        return GoodCategory.Luxury;
      case GoodsType.Paper:
        return GoodCategory.Knowledge;
      default:
        return GoodCategory.Material;
    }
  }

  private deriveUnit(type: GoodsType): UnitType {
    switch (type) {
      case GoodsType.Wood:
      case GoodsType.Iron:
      case GoodsType.Clay:
      case GoodsType.Marble:
      case GoodsType.Granite:
        return UnitType.Weight;
      case GoodsType.Beer:
      case GoodsType.Wine:
        return UnitType.Volume;
      default:
        return UnitType.Count;
    }
  }
}
