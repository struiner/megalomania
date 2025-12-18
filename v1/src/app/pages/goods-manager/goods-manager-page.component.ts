import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { FloraType } from '../../enums/FloraType';
import { GoodsType } from '../../enums/GoodsType';
import { GoodCategory, Rarity, UnitType } from '../../models/goods.model';
import { GOODS_DATA } from '../../data/goods/data';
import { GoodsDraft, GoodsManagerViewService } from './goods-manager.view.service';

@Component({
  selector: 'app-goods-manager-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [GoodsManagerViewService],
  template: `
    <section class="goods-manager-shell">
      <header class="page-header">
        <div>
          <p class="eyebrow">SDK / Tech</p>
          <h1>Goods Manager Shell</h1>
          <p class="lede">
            Structural shell bound to fixtures and enums; selection stays service-owned with no ledger writes.
          </p>
        </div>
        <div class="status-chips">
          <span class="chip">Fixture data</span>
          <span class="chip subtle">{{ view.filteredGoods().length }} / {{ view.goods().length }} shown</span>
        </div>
      </header>

      <div class="workspace">
        <section class="panel list-panel">
          <header class="panel-header">
            <div>
              <p class="eyebrow">Catalog</p>
              <h2>Goods list</h2>
              <p class="hint">Deterministic ordering; filters stay under eight surface actions.</p>
            </div>
          </header>

          <div class="filters">
            <label class="field inline">
              <span>Search</span>
              <input
                type="search"
                [value]="view.filterTerm()"
                (input)="onSearch($any($event.target).value)"
                placeholder="Name, type, category, flora"
              />
            </label>
            <label class="field inline">
              <span>Category</span>
              <select [value]="view.categoryFilter()" (change)="onCategoryFilter($any($event.target).value)">
                <option value="all">All</option>
                <option *ngFor="let category of categoryOptions" [value]="category">{{ readableCategory(category) }}</option>
              </select>
            </label>
            <label class="field inline">
              <span>Tier</span>
              <select [value]="view.rarityFilter()" (change)="onRarityFilter($any($event.target).value)">
                <option value="all">All</option>
                <option *ngFor="let tier of rarityOptions" [value]="tier">{{ readableRarity(tier) }}</option>
              </select>
            </label>
          </div>

          <ul class="goods-list">
            <li
              *ngFor="let good of view.filteredGoods(); trackBy: trackById"
              (click)="selectGood(good.id)"
              [class.active]="good.id === view.selectedId()"
            >
              <div class="row">
                <div class="row__text">
                  <p class="eyebrow">{{ readableType(good.type) }}</p>
                  <h3>{{ good.name }}</h3>
                  <p class="meta">{{ readableCategory(good.category) }} · {{ readableRarity(good.rarity) }} · {{ good.unit }}</p>
                  <p class="meta subtle">
                    Base price {{ good.basePrice | number: '1.0-0' }} · Complexity {{ good.complexity }}
                  </p>
                </div>
                <span class="pill">{{ readableRarity(good.rarity) }}</span>
              </div>
            </li>
            <li *ngIf="!view.filteredGoods().length" class="empty">
              <p class="hint">No goods match the current filters.</p>
            </li>
          </ul>
        </section>

        <section class="panel detail-panel">
          <header class="panel-header">
            <div>
              <p class="eyebrow">Detail</p>
              <h2>{{ view.selectedGood()?.name || 'New good' }}</h2>
              <p class="hint">
                Enum-bound pickers (GoodCategory, Rarity, UnitType, FloraType). Validation notices surface alongside actions.
              </p>
            </div>
            <div class="small-chips">
              <span class="chip subtle">{{ view.selectedGood() ? 'Editing fixture' : 'New draft' }}</span>
              <span class="chip subtle">Pixel-aligned layout</span>
            </div>
          </header>

          <form [formGroup]="form" class="detail-form">
            <div class="grid">
              <label class="field">
                <span class="label">Name</span>
                <input type="text" formControlName="name" />
              </label>

              <label class="field">
                <span class="label">Goods type</span>
                <select formControlName="type">
                  <option *ngFor="let type of goodsTypeOptions" [ngValue]="type">{{ readableType(type) }}</option>
                </select>
              </label>

              <label class="field">
                <span class="label">Category</span>
                <select formControlName="category">
                  <option *ngFor="let category of categoryOptions" [ngValue]="category">{{ readableCategory(category) }}</option>
                </select>
              </label>

              <label class="field">
                <span class="label">Tier</span>
                <select formControlName="rarity">
                  <option *ngFor="let tier of rarityOptions" [ngValue]="tier">{{ readableRarity(tier) }}</option>
                </select>
              </label>

              <label class="field">
                <span class="label">Complexity (1-5)</span>
                <input type="number" formControlName="complexity" min="1" max="5" />
              </label>

              <label class="field">
                <span class="label">Unit type</span>
                <select formControlName="unit">
                  <option *ngFor="let unit of unitOptions" [ngValue]="unit">{{ readableUnit(unit) }}</option>
                </select>
              </label>

              <label class="field">
                <span class="label">Base price</span>
                <input type="number" formControlName="basePrice" min="0" />
              </label>

              <label class="field field-span">
                <span class="label">Flora sources</span>
                <select multiple formControlName="floraSources">
                  <option *ngFor="let flora of floraOptions" [ngValue]="flora">{{ readableFlora(flora) }}</option>
                </select>
              </label>

              <label class="field field-span">
                <span class="label">Notes</span>
                <textarea rows="3" formControlName="notes" placeholder="Fixture notes, import/export hints"></textarea>
              </label>
            </div>
          </form>
        </section>

        <section class="panel breakdown-panel">
          <header class="panel-header">
            <div>
              <p class="eyebrow">Breakdown</p>
              <h2>Tiers & categories</h2>
              <p class="hint">Chips summarize tier counts and enum coverage for validation.</p>
            </div>
          </header>

          <div class="chips">
            <span class="chip" *ngFor="let tier of view.tierBreakdown()">
              {{ readableRarity(tier.rarity) }}: {{ tier.count }}
            </span>
          </div>

          <div class="chips stack">
            <span class="chip subtle" *ngFor="let category of view.categoryBreakdown()">
              {{ readableCategory(category.category) }}: {{ category.count }}
            </span>
          </div>
        </section>
      </div>

      <footer class="action-row">
        <div class="notices" *ngIf="validationNotices().length">
          <p *ngFor="let notice of validationNotices()">{{ notice }}</p>
        </div>
        <div class="actions">
          <button type="button" (click)="saveSelection()">Save selection</button>
          <button type="button" (click)="addAsNew()">Add as new fixture</button>
          <button type="button" (click)="resetFixtures()">Reset to fixtures</button>
          <button type="button" (click)="exportFixtures()">Export JSON</button>
        </div>
      </footer>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .goods-manager-shell {
        display: flex;
        flex-direction: column;
        gap: 12px;
        color: #e8e0ff;
        background: radial-gradient(circle at 68% 0%, #241b38, #0b0716 62%);
        min-height: calc(100vh - 48px);
        padding: 16px;
        box-sizing: border-box;
      }

      .page-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
      }

      .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 11px;
        margin: 0 0 4px;
        opacity: 0.7;
      }

      h1 {
        margin: 0;
        font-size: 24px;
      }

      h2 {
        margin: 0;
        font-size: 18px;
      }

      h3 {
        margin: 4px 0;
        font-size: 16px;
      }

      .lede {
        margin: 4px 0 0;
        opacity: 0.85;
        max-width: 720px;
      }

      .status-chips,
      .small-chips {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }

      .workspace {
        display: grid;
        grid-template-columns: minmax(280px, 320px) 1fr minmax(240px, 280px);
        gap: 12px;
        align-items: start;
      }

      .panel {
        background: rgba(15, 12, 20, 0.94);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 12px;
        box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
      }

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 8px;
      }

      .hint {
        margin: 4px 0 0;
        font-size: 13px;
        opacity: 0.82;
      }

      .filters {
        display: grid;
        grid-template-columns: 1fr;
        gap: 8px;
        margin-bottom: 12px;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 13px;
      }

      .field.inline {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .field .label {
        font-weight: 600;
        font-size: 13px;
      }

      input,
      select,
      textarea {
        width: 100%;
        padding: 8px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.04);
        color: #f4edff;
        box-sizing: border-box;
      }

      textarea {
        resize: vertical;
      }

      .goods-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .goods-list li {
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 10px;
        cursor: pointer;
        background: rgba(255, 255, 255, 0.02);
        transition: border-color 120ms ease, background 120ms ease;
      }

      .goods-list li.active {
        border-color: rgba(215, 179, 255, 0.9);
        background: rgba(215, 179, 255, 0.06);
      }

      .goods-list li:hover {
        border-color: rgba(215, 179, 255, 0.6);
      }

      .goods-list .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .goods-list .row__text {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .meta {
        margin: 0;
        font-size: 13px;
        opacity: 0.9;
      }

      .meta.subtle {
        opacity: 0.7;
      }

      .pill {
        padding: 6px 10px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        font-size: 12px;
        background: rgba(255, 255, 255, 0.05);
        min-width: 96px;
        text-align: center;
      }

      .empty {
        padding: 10px;
        border-radius: 8px;
        border: 1px dashed rgba(255, 255, 255, 0.18);
      }

      .detail-form .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 10px;
      }

      .field-span {
        grid-column: 1 / -1;
      }

      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 8px 0;
      }

      .chips.stack {
        flex-direction: column;
        align-items: flex-start;
      }

      .chip {
        padding: 6px 10px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        background: rgba(255, 255, 255, 0.05);
        font-size: 12px;
      }

      .chip.subtle {
        border-color: rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.03);
      }

      .action-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        padding: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        background: rgba(14, 11, 18, 0.95);
      }

      .actions {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 8px;
        width: 100%;
        max-width: 640px;
      }

      button {
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid rgba(215, 179, 255, 0.6);
        background: rgba(215, 179, 255, 0.12);
        color: #f4edff;
        cursor: pointer;
        font-weight: 600;
      }

      button:hover {
        background: rgba(215, 179, 255, 0.18);
      }

      .notices {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 220px;
      }

      .notices p {
        margin: 0;
        padding: 8px;
        border-radius: 8px;
        background: rgba(255, 161, 87, 0.1);
        border: 1px solid rgba(255, 161, 87, 0.4);
        color: #ffddb8;
        font-size: 13px;
      }

      @media (max-width: 1080px) {
        .workspace {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class GoodsManagerPageComponent {
  private readonly fb = inject(FormBuilder);
  readonly view = inject(GoodsManagerViewService);

  private readonly defaultType = Array.from(new Set(GOODS_DATA.map((entry) => entry.type)))[0] ?? GoodsType.Wood;

  readonly goodsTypeOptions = Array.from(new Set(GOODS_DATA.map((entry) => entry.type)));
  readonly categoryOptions = Object.values(GoodCategory);
  readonly rarityOptions = Object.values(Rarity);
  readonly unitOptions = Object.values(UnitType);
  readonly floraOptions = Object.values(FloraType);

  readonly form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control<string>('', [Validators.required, Validators.minLength(3)]),
    type: this.fb.nonNullable.control<GoodsType>(this.defaultType, Validators.required),
    category: this.fb.nonNullable.control<GoodCategory>(GoodCategory.RawMaterial, Validators.required),
    rarity: this.fb.nonNullable.control<Rarity>(Rarity.Common, Validators.required),
    complexity: this.fb.nonNullable.control<number>(1, [Validators.required, Validators.min(1), Validators.max(5)]),
    unit: this.fb.nonNullable.control<UnitType>(UnitType.Count, Validators.required),
    floraSources: this.fb.nonNullable.control<FloraType[]>([]),
    notes: this.fb.nonNullable.control<string>(''),
    basePrice: this.fb.nonNullable.control<number>(0, [Validators.required, Validators.min(0)]),
  });

  readonly validationNotices = computed(() => {
    const notices: string[] = [];

    if (this.form.controls.name.invalid) {
      notices.push('Name must be at least 3 characters.');
    }
    if (this.form.controls.type.invalid) {
      notices.push('Select a goods type sourced from fixtures.');
    }
    if (this.form.controls.complexity.invalid) {
      notices.push('Complexity must stay between 1 and 5 for structural fidelity.');
    }
    if (this.form.controls.basePrice.invalid) {
      notices.push('Base price must be zero or higher.');
    }

    return notices;
  });

  constructor() {
    effect(() => {
      const selected = this.view.selectedGood();
      this.form.patchValue(this.buildFormValue(selected), { emitEvent: false });
    });
  }

  trackById = (_: number, item: { id: string }): string => item.id;

  onSearch(term: string): void {
    this.view.updateFilter(term);
  }

  onCategoryFilter(raw: string): void {
    this.view.updateCategoryFilter(raw === 'all' ? 'all' : (raw as GoodCategory));
  }

  onRarityFilter(raw: string): void {
    this.view.updateRarityFilter(raw === 'all' ? 'all' : (raw as Rarity));
  }

  selectGood(id: string): void {
    this.view.select(id);
  }

  saveSelection(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.view.saveDraft(this.toDraft());
  }

  addAsNew(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.view.appendDraft(this.toDraft());
  }

  resetFixtures(): void {
    this.view.resetFixtures();
  }

  exportFixtures(): void {
    const payload = this.view.exportPayload();
    const data = JSON.stringify(payload, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'goods-manager-fixtures.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  readableType(type: GoodsType): string {
    return this.toTitle(type);
  }

  readableCategory(category: GoodCategory): string {
    return this.splitWords(category);
  }

  readableRarity(rarity: Rarity): string {
    return this.splitWords(rarity);
  }

  readableUnit(unit: UnitType): string {
    return this.splitWords(unit);
  }

  readableFlora(flora: FloraType): string {
    return this.toTitle(flora);
  }

  private toDraft(): GoodsDraft {
    const value = this.form.getRawValue();
    return {
      type: value.type,
      name: value.name.trim(),
      category: value.category,
      rarity: value.rarity,
      complexity: value.complexity,
      unit: value.unit,
      floraSources: value.floraSources,
      notes: value.notes.trim(),
      basePrice: value.basePrice,
    };
  }

  private buildFormValue(selected: GoodsDraft | null) {
    return {
      name: selected?.name ?? '',
      type: selected?.type ?? this.defaultType,
      category: selected?.category ?? GoodCategory.RawMaterial,
      rarity: selected?.rarity ?? Rarity.Common,
      complexity: selected?.complexity ?? 1,
      unit: selected?.unit ?? UnitType.Count,
      floraSources: selected?.floraSources ?? [],
      notes: selected?.notes ?? '',
      basePrice: selected?.basePrice ?? 0,
    };
  }

  private splitWords(value: string): string {
    return value.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
  }

  private toTitle(value: string): string {
    return this.splitWords(value)
      .toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
