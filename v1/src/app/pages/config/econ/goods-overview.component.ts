import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignDocService } from '../../../services/design/design-doc.service';
import { GoodsCategoryDefinition } from '../../../models/design-doc.models';

@Component({
  selector: 'app-goods-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <header>
        <p class="eyebrow">GoodsType classification</p>
        <h1>Trade goods taxonomy</h1>
        <p class="lede">Categories A–G drive settlement scoring, tribal placement, and economic simulation.</p>
      </header>

      <div class="grid">
        <article class="card" *ngFor="let category of categories">
          <header class="card__header">
            <h2>{{ category.name }}</h2>
            <p>{{ category.summary }}</p>
          </header>
          <div class="chips">
            <span class="chip" *ngFor="let good of category.goods">{{ good }}</span>
          </div>
        </article>
      </div>
    </section>
  `,
  styles: [
    `
      .page {
        padding: 24px;
        color: #e7d9ff;
        background: radial-gradient(circle at 60% 0%, #241b3b, #0b0716 65%);
        min-height: calc(100vh - 48px);
      }
      header {
        margin-bottom: 12px;
      }
      .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #d7b3ff;
        margin: 0 0 4px;
      }
      h1 {
        margin: 0 0 6px;
        font-size: 24px;
      }
      .lede {
        margin: 0;
        opacity: 0.85;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 12px;
      }
      .card {
        background: rgba(11, 8, 16, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 14px;
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.4);
      }
      .card__header h2 {
        margin: 0 0 4px;
      }
      .card__header p {
        margin: 0 0 8px;
        opacity: 0.9;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .chip {
        background: rgba(255, 255, 255, 0.06);
        padding: 6px 10px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        font-size: 13px;
      }
    `,
  ],
})
export class GoodsOverviewComponent {
  private readonly designDoc = inject(DesignDocService);
  readonly categories: GoodsCategoryDefinition[] = this.designDoc.getDocument().goodsCategories;
}
