import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BIOME_DEFINITIONS, BiomeDefinition } from '../../data/biomes.data';
import { FLORA_METADATA, FloraMetadata } from '../../data/flora.data';
import { FloraUseType } from '../../enums/FloraUseType';

interface FloraDisplay extends FloraMetadata {
  label: string;
}

type BiomeCard = BiomeDefinition & { floraDetails: FloraDisplay[] };

@Component({
  selector: 'app-biome-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <header class="page__header">
        <p class="eyebrow">World → Biomes</p>
        <h1>Biome overview</h1>
        <p class="lede">
          Automatically renders every <code>BiomeType</code> from shared data and
          links in all flora currently mapped to each biome via the latest
          <code>flora.data.ts</code> entries. Update the enums or metadata and
          this view refreshes itself.
        </p>
        <p class="meta">{{ biomeCards.length }} biome types · {{ floraLinks }} flora links</p>
      </header>

      <div class="biome-grid" role="list">
        <article
          class="biome-card"
          *ngFor="let biome of biomeCards"
          role="listitem"
        >
          <div class="biome-card__tag">{{ biome.type }}</div>
          <h2>{{ biome.name }}</h2>
          <p class="climate">{{ biome.climate }}</p>

          <div class="flora" *ngIf="biome.floraDetails.length > 0">
            <p class="flora__title">Signature flora ({{ biome.floraDetails.length }})</p>
            <ul class="flora__list">
              <li *ngFor="let plant of biome.floraDetails">
                <div class="flora__row">
                  <span class="flora__name">{{ plant.label }}</span>
                  <span
                    class="chip chip--use"
                    *ngFor="let use of plant.uses"
                  >
                    {{ use }}
                  </span>
                </div>
                <p class="flora__summary">{{ plant.description }}</p>
              </li>
            </ul>
          </div>

          <p class="notes">{{ biome.notes }}</p>
        </article>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .page {
        padding: 24px;
        color: #e7d9ff;
        background: radial-gradient(circle at 18% 22%, #1f1538, #0c0818 60%);
        min-height: calc(100vh - 48px);
      }

      .page__header {
        max-width: 920px;
        margin-bottom: 24px;
      }

      .eyebrow {
        margin: 0 0 4px;
        font-size: 12px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        opacity: 0.7;
      }

      h1 {
        margin: 0;
        font-size: 26px;
        line-height: 1.2;
      }

      .lede {
        margin: 8px 0 6px;
        line-height: 1.4;
        opacity: 0.88;
      }

      .meta {
        margin: 0;
        font-size: 13px;
        opacity: 0.7;
      }

      .biome-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
      }

      .biome-card {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .biome-card__tag {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 999px;
        background: rgba(123, 104, 238, 0.18);
        border: 1px solid rgba(123, 104, 238, 0.4);
        font-size: 12px;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        margin-bottom: 6px;
      }

      h2 {
        margin: 0 0 4px;
        font-size: 18px;
      }

      .climate {
        margin: 0 0 8px;
        opacity: 0.85;
      }

      .flora {
        margin: 0 0 8px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 10px;
        padding: 10px 12px;
      }

      .flora__title {
        margin: 0 0 6px;
        font-weight: 700;
        font-size: 13px;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        opacity: 0.8;
      }

      .flora__list {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .flora__row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
      }

      .flora__name {
        font-weight: 600;
      }

      .flora__summary {
        margin: 2px 0 0;
        opacity: 0.85;
        line-height: 1.4;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        border-radius: 999px;
        padding: 4px 10px;
        font-size: 12px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(255, 255, 255, 0.05);
        text-transform: capitalize;
      }

      .chip--use {
        color: #c1e4ff;
        border-color: rgba(193, 228, 255, 0.4);
        background: rgba(14, 90, 143, 0.28);
      }

      .notes {
        margin: 8px 0 0;
        opacity: 0.82;
      }
    `,
  ],
})
export class BiomeOverviewComponent {
  private readonly floraEntries = Object.values(FLORA_METADATA).filter(
    (flora): flora is FloraMetadata => !!flora,
  );

  readonly useOrder: FloraUseType[] = [
    FloraUseType.Food,
    FloraUseType.Medicine,
    FloraUseType.Material,
    FloraUseType.Construction,
    FloraUseType.Fodder,
    FloraUseType.Fertilizer,
    FloraUseType.Trade,
    FloraUseType.Fuel,
    FloraUseType.Industry,
    FloraUseType.Water,
    FloraUseType.Insulation,
    FloraUseType.Dye,
    FloraUseType.Ritual,
  ];

  readonly biomeCards: BiomeCard[] = Object.values(BIOME_DEFINITIONS).map(
    (biome) => ({
      ...biome,
      floraDetails: this.floraEntries
        .filter((flora) => flora.biome === biome.type)
        .map((flora) => ({
          ...flora,
          uses: this.orderUses(flora.uses),
          label: this.formatFloraLabel(flora.id),
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    }),
  );

  readonly floraLinks = this.biomeCards.reduce(
    (count, biome) => count + biome.floraDetails.length,
    0,
  );

  private formatFloraLabel(type: string): string {
    return type.replace(/([A-Z])/g, ' $1').trim();
  }

  private orderUses(uses: FloraUseType[]): FloraUseType[] {
    return [...uses].sort(
      (a, b) => this.useOrder.indexOf(a) - this.useOrder.indexOf(b),
    );
  }
}
