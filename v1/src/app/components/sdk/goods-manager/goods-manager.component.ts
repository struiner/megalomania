import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { DesignDocService } from '../../../services/design/design-doc.service';
import { GoodsCategoryDefinition } from '../../../models/design-doc.models';

interface GoodsEntry {
  name: string;
  category: string;
  tier: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  tags: string[];
}

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

  readonly categories: GoodsCategoryDefinition[] = this.designDoc.getDocument().goodsCategories;

  readonly goods = signal<GoodsEntry[]>(this.buildSeedGoods());

  readonly filter = this.formBuilder.control('');

  readonly form = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    category: this.formBuilder.nonNullable.control<string>(this.categories[0]?.name ?? '', Validators.required),
    tier: this.formBuilder.nonNullable.control<GoodsEntry['tier']>('Common'),
    tags: this.formBuilder.nonNullable.control<string>('')
  });

  readonly filteredGoods = computed(() => {
    const term = this.filter.value?.toLowerCase().trim();
    const goods = this.goods();
    if (!term) return goods;
    return goods.filter(good =>
      good.name.toLowerCase().includes(term) ||
      good.category.toLowerCase().includes(term) ||
      good.tags.some(tag => tag.toLowerCase().includes(term))
    );
  });

  readonly tierTotals = computed(() => {
    const totals = new Map<GoodsEntry['tier'], number>([
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
    const entry: GoodsEntry = {
      name: value.name,
      category: value.category,
      tier: value.tier,
      tags: value.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean),
    };

    this.goods.update(list => [...list, entry]);
    this.form.reset({
      name: '',
      category: this.categories[0]?.name ?? '',
      tier: 'Common',
      tags: '',
    });
  }

  removeGood(index: number): void {
    this.goods.update(list => list.filter((_, i) => i !== index));
  }

  private buildSeedGoods(): GoodsEntry[] {
    const seeds: GoodsEntry[] = [];
    this.categories.forEach(category => {
      category.goods.slice(0, 3).forEach((good, index) => {
        seeds.push({
          name: good,
          category: category.name,
          tier: (['Common', 'Uncommon', 'Rare'] as const)[index % 3],
          tags: category.summary.split(/[,.;]/).map(part => part.trim()).filter(Boolean).slice(0, 3),
        });
      });
    });
    return seeds;
  }

}
