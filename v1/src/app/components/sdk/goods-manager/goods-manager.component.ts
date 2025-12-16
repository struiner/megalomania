import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { DesignDocService } from '../../../services/design/design-doc.service';
import { GoodsCategoryDefinition } from '../../../models/design-doc.models';
import { GoodsType } from '../../../enums/GoodsType';
import { FloraType } from '../../../enums/FloraType';
import { GOODS_DATA, GoodsInfo, GoodComponent } from '../../../data/goods/data';
import { FLORA_METADATA, FloraMetadata } from '../../../data/flora.data';

type GoodsTier = 'Common' | 'Uncommon' | 'Rare' | 'Legendary';

type ManagedGood = GoodsInfo & {
  category: string;
  floraSources: FloraType[];
  tags: string[];
  tier: GoodsTier;
};

@Component({
  selector: 'app-goods-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './goods-manager.component.html',
  styleUrls: ['./goods-manager.component.scss']
})
export class GoodsManagerComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly designDoc = inject(DesignDocService);

  readonly goodsTypeOptions = Object.values(GoodsType);
  readonly floraOptions = Object.keys(FLORA_METADATA) as FloraType[];
  readonly floraMetadata = FLORA_METADATA as Record<FloraType, FloraMetadata>;

  readonly categories: GoodsCategoryDefinition[] = this.designDoc.getDocument().goodsCategories;
  private readonly categoryLookup = this.buildCategoryLookup();

  readonly goods = signal<ManagedGood[]>(this.buildSeedGoods());

  readonly filter = this.formBuilder.control('');

  readonly form = this.formBuilder.group({
    type: this.formBuilder.nonNullable.control<GoodsType>(this.goodsTypeOptions[0], Validators.required),
    title: this.formBuilder.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    category: this.formBuilder.nonNullable.control<string>(this.categories[0]?.name ?? '', Validators.required),
    tier: this.formBuilder.nonNullable.control<GoodsTier>('Common'),
    rarity: this.formBuilder.nonNullable.control<number>(1, [Validators.min(1), Validators.max(5)]),
    complexity: this.formBuilder.nonNullable.control<number>(1, [Validators.min(1), Validators.max(5)]),
    basePrice: this.formBuilder.nonNullable.control<number>(0, [Validators.min(0)]),
    floraSources: this.formBuilder.nonNullable.control<FloraType[]>([]),
    tags: this.formBuilder.nonNullable.control<string>('')
  });

  constructor() {
    this.prefillFromGoods(this.form.controls.type.value);
    this.form.controls.type.valueChanges.subscribe(type => this.prefillFromGoods(type));
  }

  readonly filteredGoods = computed(() => {
    const term = this.filter.value?.toLowerCase().trim();
    const goods = this.goods();
    if (!term) return goods;
    return goods.filter(good =>
      good.title.toLowerCase().includes(term) ||
      this.readableGoods(good.type).toLowerCase().includes(term) ||
      good.category.toLowerCase().includes(term) ||
      good.tags.some(tag => tag.toLowerCase().includes(term)) ||
      good.floraSources.some(flora => this.readableFlora(flora).toLowerCase().includes(term))
    );
  });

  readonly tierTotals = computed(() => {
    const totals = new Map<GoodsTier, number>([
      ['Common', 0],
      ['Uncommon', 0],
      ['Rare', 0],
      ['Legendary', 0],
    ]);
    this.goods().forEach(good => totals.set(good.tier, (totals.get(good.tier) ?? 0) + 1));
    return totals;
  });

  addGood(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const entry: ManagedGood = {
      type: value.type,
      title: value.title,
      rarity: Number(value.rarity ?? 1),
      complexity: Number(value.complexity ?? 1),
      basePrice: Number(value.basePrice ?? 0),
      components: GOODS_DATA.find(good => good.type === value.type)?.components ?? [],
      category: value.category,
      tier: value.tier,
      floraSources: value.floraSources,
      tags: this.normalizeTags(value.tags, value.category, value.floraSources),
    };

    this.goods.update(list => [...list, entry]);
    this.form.reset({
      type: this.goodsTypeOptions[0],
      title: '',
      category: this.categories[0]?.name ?? '',
      tier: 'Common',
      rarity: 1,
      complexity: 1,
      basePrice: 0,
      floraSources: [],
      tags: '',
    });
    this.prefillFromGoods(this.goodsTypeOptions[0]);
  }

  removeGood(index: number): void {
    this.goods.update(list => list.filter((_, i) => i !== index));
  }

  readableFlora(type: FloraType): string {
    const metadata = this.floraMetadata[type];
    return metadata?.id ? this.titleCase(metadata.id.replace(/_/g, ' ')) : this.titleCase(type);
  }

  readableGoods(type: GoodsType): string {
    return this.titleCase(type.toString().replace(/_/g, ' '));
  }

  joinComponents(components?: GoodComponent[]): string {
    return components?.map(component => this.readableGoods(component.type)).join(', ') ?? '';
  }

  private buildSeedGoods(): ManagedGood[] {
    const seeds: ManagedGood[] = [];

    GOODS_DATA.forEach(good => {
      const category = this.categoryLookup.get(good.type) ?? 'Uncategorized';
      seeds.push({
        ...good,
        components: good.components ?? [],
        category,
        tier: this.mapRarityToTier(good.rarity),
        floraSources: [],
        tags: this.normalizeTags(
          good.components?.map(component => this.readableGoods(component.type)).join(', ') ?? '',
          category,
          []
        ),
      });
    });

    return seeds;
  }

  private prefillFromGoods(type: GoodsType): void {
    const match = GOODS_DATA.find(good => good.type === type);
    if (!match) return;

    this.form.patchValue({
      title: match.title,
      rarity: match.rarity,
      complexity: match.complexity,
      basePrice: match.basePrice,
      tier: this.mapRarityToTier(match.rarity),
      category: this.categoryLookup.get(type) ?? this.categories[0]?.name ?? '',
    }, { emitEvent: false });
  }

  private buildCategoryLookup(): Map<GoodsType, string> {
    const map = new Map<GoodsType, string>();
    this.categories.forEach(category => {
      category.goods.forEach(goodName => {
        const type = this.toGoodsType(goodName);
        if (type) {
          map.set(type, category.name);
        }
      });
    });
    return map;
  }

  private toGoodsType(name: string): GoodsType | null {
    return (name in GoodsType) ? GoodsType[name as keyof typeof GoodsType] : null;
  }

  private normalizeTags(raw: string, category: string, flora: FloraType[]): string[] {
    const tags = raw
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);

    const floraTags = flora.map(type => this.readableFlora(type));

    return Array.from(new Set([...tags, category, ...floraTags]));
  }

  private mapRarityToTier(rarity: number): GoodsTier {
    if (rarity >= 4) return 'Legendary';
    if (rarity === 3) return 'Rare';
    if (rarity === 2) return 'Uncommon';
    return 'Common';
  }

  private titleCase(input: string): string {
    return input
      .toLowerCase()
      .split(' ')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

}
