import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

import { FloraType } from '../../../enums/FloraType';
import { GoodsType } from '../../../enums/GoodsType';
import { FLORA_METADATA, FloraMetadata } from '../../../data/flora.data';
import { GOODS_DATA, GoodComponent, GoodsInfo } from '../../../data/goods/data';
import { Goods as GoodsBasePriceService } from '../../../data/goods/basePrice';
import { GoodCategory, Rarity, UnitType } from '../../../models/goods.model';
import { DesignDocService } from '../../../services/design/design-doc.service';
import { TechEnumAdapterService, TechEnumOption } from '../../../services/tech-enum-adapter.service';

export type GoodsTier = 'Common' | 'Uncommon' | 'Rare' | 'Legendary';

type ManagedGood = Omit<GoodsInfo, 'rarity'> & {
  category: GoodCategory | string;
  tier: GoodsTier;
  unitType: UnitType;
  floraSources: FloraType[];
  tags: string[];
  summary?: string;
  rarity: Rarity | string;
};

interface FilterFormValue {
  search: string;
  category: string;
  tier: GoodsTier | 'all';
  rarity: Rarity | 'all';
}

@Component({
  selector: 'app-goods-manager-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './goods-manager-page.component.html',
  styleUrls: ['./goods-manager-page.component.scss']
})
export class GoodsManagerPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly designDoc = inject(DesignDocService);
  private readonly enumAdapter = inject(TechEnumAdapterService);
  private readonly basePriceService = inject(GoodsBasePriceService);
  private readonly destroyRef = inject(DestroyRef);

  readonly floraMetadata = FLORA_METADATA as Record<FloraType, FloraMetadata>;

  readonly goodsTypeOptions = this.enumAdapter.getGoodsTypeOptions();
  readonly categoryOptions = this.enumAdapter.getGoodCategoryOptions();
  readonly rarityOptions = this.enumAdapter.getRarityOptions();
  readonly unitTypeOptions = Object.values(UnitType);
  readonly floraOptions = this.enumAdapter.getFloraTypeOptions();

  private readonly categoryLookup = this.buildCategoryLookup();

  readonly goods = signal<ManagedGood[]>(this.buildSeedGoods());
  readonly selectedGoodId = signal<string | null>(null);
  readonly submitAttempted = signal(false);

  readonly filterForm = this.formBuilder.group({
    search: this.formBuilder.nonNullable.control<string>(''),
    category: this.formBuilder.nonNullable.control<string>('all'),
    tier: this.formBuilder.nonNullable.control<GoodsTier | 'all'>('all'),
    rarity: this.formBuilder.nonNullable.control<Rarity | 'all'>('all')
  });
  readonly filterValues = toSignal(
    this.filterForm.valueChanges.pipe(startWith(this.filterForm.getRawValue() as FilterFormValue)),
    { initialValue: this.filterForm.getRawValue() as FilterFormValue }
  );

  readonly form = this.formBuilder.group({
    type: this.formBuilder.nonNullable.control<string>(this.goodsTypeOptions[0]?.value ?? '', Validators.required),
    title: this.formBuilder.nonNullable.control<string>('', [Validators.required, Validators.minLength(3)]),
    summary: this.formBuilder.nonNullable.control<string>('', [Validators.maxLength(120)]),
    description: this.formBuilder.nonNullable.control<string>(''),
    category: this.formBuilder.nonNullable.control<string>(this.categoryOptions[0]?.value ?? '', Validators.required),
    tier: this.formBuilder.nonNullable.control<GoodsTier>('Common'),
    rarity: this.formBuilder.nonNullable.control<Rarity | string>(this.rarityOptions[0]?.value ?? Rarity.Common, Validators.required),
    complexity: this.formBuilder.nonNullable.control<number>(1, [Validators.required, Validators.min(1), Validators.max(5)]),
    unitType: this.formBuilder.nonNullable.control<UnitType>(UnitType.Count, Validators.required),
    basePrice: this.formBuilder.nonNullable.control<number>(0, [Validators.min(0)]),
    floraSources: this.formBuilder.nonNullable.control<string[]>([]),
    tags: this.formBuilder.nonNullable.control<string>(''),
  });

  constructor() {
    const defaultType = this.getDefaultGoodsType();
    const defaultBasePrice = defaultType ? this.basePriceService.getBasePrice(defaultType) : 0;

    this.form.patchValue(
      {
        basePrice: defaultBasePrice,
        type: defaultType ?? '',
      },
      { emitEvent: false }
    );

    this.form.controls.type.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const mapped = value as GoodsType;
        const basePrice = this.basePriceService.getBasePrice(mapped) ?? 0;
        this.form.patchValue({ basePrice }, { emitEvent: false });
      });
  }

  readonly filteredGoods = computed(() => {
    const filters = this.filterValues();
    const search = filters.search.toLowerCase().trim();

    return this.goods()
      .filter((good) => this.matchesFilters(good, filters, search))
      .sort((a, b) => a.title.localeCompare(b.title));
  });

  readonly tierBreakdown = computed(() => {
    const totals = new Map<GoodsTier, number>([
      ['Common', 0],
      ['Uncommon', 0],
      ['Rare', 0],
      ['Legendary', 0],
    ]);

    this.goods().forEach((good) => {
      totals.set(good.tier, (totals.get(good.tier) ?? 0) + 1);
    });

    return Array.from(totals.entries());
  });

  readonly categoryBreakdown = computed(() => {
    const counts = new Map<string, number>();

    this.goods().forEach((good) => {
      const key = good.category ?? 'Uncategorized';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });

    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  });

  readonly validationNotices = computed(() => {
    if (!this.submitAttempted() && !this.form.touched) {
      return [] as string[];
    }

    const notices: string[] = [];
    const controls = this.form.controls;

    if (controls.title.invalid) {
      notices.push('Title is required (min 3 characters).');
    }

    if (controls.type.invalid) {
      notices.push('Select a good type from the SDK enums.');
    }

    if (controls.category.invalid) {
      notices.push('Choose a category to keep routing aligned to the catalog.');
    }

    if (controls.rarity.invalid) {
      notices.push('Pick a rarity to drive tier and breakdown chips.');
    }

    if (controls.complexity.invalid) {
      notices.push('Complexity must stay between 1 and 5 for deterministic ordering.');
    }

    if (controls.basePrice.invalid) {
      notices.push('Base price cannot be negative; fixtures come from the base price service.');
    }

    return notices;
  });

  selectGood(type: string): void {
    const match = this.goods().find((good) => good.type === type);
    if (!match) return;

    this.selectedGoodId.set(match.type);
    this.form.patchValue({
      type: match.type,
      title: match.title,
      summary: match.summary ?? '',
      description: match.description ?? '',
      category: match.category,
      tier: match.tier,
      rarity: match.rarity,
      complexity: match.complexity,
      unitType: match.unitType,
      basePrice: match.basePrice,
      floraSources: match.floraSources,
      tags: match.tags.join(', '),
    });
  }

  resetForm(): void {
    const defaultType = this.getDefaultGoodsType();
    const defaultBasePrice = defaultType ? this.basePriceService.getBasePrice(defaultType) : 0;

    this.form.reset({
      type: defaultType ?? '',
      title: '',
      summary: '',
      description: '',
      category: this.categoryOptions[0]?.value ?? '',
      tier: 'Common',
      rarity: this.rarityOptions[0]?.value ?? Rarity.Common,
      complexity: 1,
      unitType: UnitType.Count,
      basePrice: defaultBasePrice,
      floraSources: [],
      tags: '',
    });
    this.selectedGoodId.set(null);
    this.submitAttempted.set(false);
  }

  saveGood(): void {
    this.submitAttempted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const managed: ManagedGood = {
      type: value.type as GoodsType,
      title: value.title.trim(),
      summary: value.summary?.trim() ?? '',
      description: value.description?.trim() ?? '',
      category: value.category as GoodCategory,
      tier: value.tier,
      rarity: value.rarity as Rarity,
      complexity: Number(value.complexity ?? 1),
      unitType: value.unitType as UnitType,
      basePrice: Number(value.basePrice ?? 0),
      floraSources: (value.floraSources ?? []) as FloraType[],
      tags: this.normalizeTags(value.tags),
      components: this.getComponentsForType(value.type as GoodsType),
    };

    managed.tier = this.mapRarityToTier(managed.rarity);
    const basePrice = this.basePriceService.getBasePrice(managed.type);
    managed.basePrice = basePrice ?? managed.basePrice;

    this.goods.update((list) => {
      const existingIndex = list.findIndex((entry) => entry.type === managed.type);
      if (existingIndex >= 0) {
        const next = [...list];
        next[existingIndex] = { ...managed };
        return next;
      }

      return [...list, managed];
    });

    this.selectedGoodId.set(managed.type);
  }

  removeGood(type: string): void {
    this.goods.update((list) => list.filter((entry) => entry.type !== type));
    if (this.selectedGoodId() === type) {
      this.resetForm();
    }
  }

  exportGoods(): void {
    const payload = this.goods().map((good) => ({
      type: good.type,
      title: good.title,
      description: good.description,
      category: good.category,
      rarity: good.rarity,
      tier: good.tier,
      complexity: good.complexity,
      basePrice: good.basePrice,
      floraSources: good.floraSources,
      unitType: good.unitType,
      tags: good.tags,
      components: good.components,
    }));

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'goods-catalog.fixture.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  readableFlora(type: string): string {
    const metadata = this.floraMetadata[type as FloraType];
    if (metadata?.id) {
      return this.toTitleCase(metadata.id.replace(/_/g, ' '));
    }

    return this.toTitleCase(type);
  }

  readableEnum(option: TechEnumOption | string): string {
    const value = typeof option === 'string' ? option : option.value;
    const spaced = value
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/_/g, ' ')
      .trim();
    return this.toTitleCase(spaced);
  }

  private matchesFilters(good: ManagedGood, filters: FilterFormValue, search: string): boolean {
    const matchesSearch = !search || [
      good.title,
      good.description ?? '',
      good.category ?? '',
      good.tags.join(' '),
      good.type,
    ].some((field) => field.toLowerCase().includes(search));

    const matchesCategory = filters.category === 'all' || good.category === filters.category;
    const matchesTier = filters.tier === 'all' || good.tier === filters.tier;
    const matchesRarity = filters.rarity === 'all' || good.rarity === filters.rarity;

    return matchesSearch && matchesCategory && matchesTier && matchesRarity;
  }

  private buildSeedGoods(): ManagedGood[] {
    return GOODS_DATA.map((good) => this.extendFixture(good));
  }

  private extendFixture(good: GoodsInfo): ManagedGood {
    const category = this.categoryLookup.get(good.type) ?? GoodCategory.RawMaterial;
    const rarity = this.mapRarityRankToEnum(good.rarity);
    const tier = this.mapRarityToTier(rarity);

    return {
      ...good,
      category,
      rarity,
      tier,
      complexity: good.complexity ?? 1,
      unitType: UnitType.Count,
      basePrice: this.basePriceService.getBasePrice(good.type) ?? good.basePrice,
      floraSources: [],
      tags: this.normalizeTags(category),
    };
  }

  private buildCategoryLookup(): Map<GoodsType, GoodCategory> {
    const categories = this.designDoc.getDocument().goodsCategories;
    const lookup = new Map<GoodsType, GoodCategory>();

    categories.forEach((category) => {
      category.goods.forEach((goodName) => {
        const normalized = this.tryMapToGoodsType(goodName);
        if (normalized) {
          lookup.set(normalized, category.name as GoodCategory);
        }
      });
    });

    return lookup;
  }

  private mapRarityToTier(rarity: Rarity | string): GoodsTier {
    if (rarity === Rarity.Legendary) return 'Legendary';
    if (rarity === Rarity.Exotic) return 'Rare';
    if (rarity === Rarity.Rare) return 'Rare';
    if (rarity === Rarity.Uncommon) return 'Uncommon';
    return 'Common';
  }

  private mapRarityRankToEnum(rank: number): Rarity {
    if (rank >= 5) return Rarity.Legendary;
    if (rank === 4) return Rarity.Exotic;
    if (rank === 3) return Rarity.Rare;
    if (rank === 2) return Rarity.Uncommon;
    return Rarity.Common;
  }

  private normalizeTags(raw: string | string[]): string[] {
    const input = Array.isArray(raw) ? raw.join(',') : raw;
    return Array.from(
      new Set(
        input
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    );
  }

  private getComponentsForType(type: GoodsType): GoodComponent[] {
    return GOODS_DATA.find((entry) => entry.type === type)?.components ?? [];
  }

  private tryMapToGoodsType(value: string): GoodsType | null {
    const normalized = value.replace(/\s+/g, '').replace(/-/g, '');
    const entries = Object.entries(GoodsType) as [string, GoodsType][];
    const match = entries.find(([key]) => key.toLowerCase() === normalized.toLowerCase());

    return match ? match[1] : null;
  }

  private getDefaultGoodsType(): GoodsType | null {
    return (this.goodsTypeOptions[0]?.value as GoodsType) ?? null;
  }

  private toTitleCase(value: string): string {
    return value
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }
}
