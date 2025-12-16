import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BiomeType } from '../../enums/BiomeType';
import { NatureFeatureType } from '../../enums/NaturalFeatureType';
import { SettlementType } from '../../enums/SettlementType';
import { FAUNA_PROFILES } from '../../data/fauna.data';
import { FLORA_PROFILES } from '../../data/flora.data';
import { DesignDocService } from '../../services/design/design-doc.service';
import { WorldGenerationSection } from '../../models/design-doc.models';

interface FaunaPlacement {
  id: string;
  name: string;
  count: number;
  note: string;
}

interface FloraPlacement {
  id: string;
  name: string;
  clusters: number;
  note: string;
}

interface MapCell {
  x: number;
  y: number;
  elevation: number;
  moisture: number;
  biome: BiomeType;
  features: string[];
  fauna: FaunaPlacement[];
  flora: FloraPlacement[];
  settlement?: SettlementType;
}

interface LedgerEntry {
  year: number;
  title: string;
  detail: string;
}

interface WorldConfig {
  seed: string;
  seaLevel: number;
  rainfall: number;
  faunaDensity: number;
  floraDensity: number;
  urbanizationBias: number;
  featureBias: number;
}

@Component({
  selector: 'app-world-render',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page">
      <header class="page__header">
        <p class="eyebrow">World → Render</p>
        <h1>Seeded world renderer</h1>
        <p class="lede">
          View a 2D elevation plane, biome fill, seeded flora & fauna placement,
          natural features, and emerging urbanization for any seed and
          configuration. A generated ledger summarizes the pre-player history so
          your arrival has context.
        </p>
      </header>

      <form class="controls" (ngSubmit)="renderWorld()">
        <div class="controls__group">
          <label>
            <span>Seed</span>
            <input
              name="seed"
              [(ngModel)]="config.seed"
              placeholder="Seed string"
              required
            />
          </label>
          <label>
            <span>Sea level</span>
            <input
              type="range"
              min="0.15"
              max="0.55"
              step="0.01"
              name="seaLevel"
              [(ngModel)]="config.seaLevel"
            />
            <small>{{ config.seaLevel | number: '1.2-2' }}</small>
          </label>
          <label>
            <span>Rainfall</span>
            <input
              type="range"
              min="0.2"
              max="0.95"
              step="0.01"
              name="rainfall"
              [(ngModel)]="config.rainfall"
            />
            <small>{{ config.rainfall | number: '1.2-2' }}</small>
          </label>
        </div>
        <div class="controls__group">
          <label>
            <span>Fauna density</span>
            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.05"
              name="faunaDensity"
              [(ngModel)]="config.faunaDensity"
            />
            <small>{{ config.faunaDensity | number: '1.1-1' }}×</small>
          </label>
          <label>
            <span>Flora density</span>
            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.05"
              name="floraDensity"
              [(ngModel)]="config.floraDensity"
            />
            <small>{{ config.floraDensity | number: '1.1-1' }}×</small>
          </label>
          <label>
            <span>Feature richness</span>
            <input
              type="range"
              min="0.4"
              max="1.6"
              step="0.05"
              name="featureBias"
              [(ngModel)]="config.featureBias"
            />
            <small>{{ config.featureBias | number: '1.1-1' }}×</small>
          </label>
          <label>
            <span>Urbanization</span>
            <input
              type="range"
              min="0.35"
              max="1.4"
              step="0.05"
              name="urbanization"
              [(ngModel)]="config.urbanizationBias"
            />
            <small>{{ config.urbanizationBias | number: '1.1-1' }}×</small>
          </label>
        </div>
        <button type="submit">Render world</button>
      </form>

      <section class="layout">
        <article class="card map-card">
          <header class="card__header">
            <div>
              <p class="eyebrow">Terrain & biomes</p>
              <h2>Elevation plane with overlays</h2>
              <p class="meta">
                {{ mapSize }}×{{ mapSize }} cells ·
                {{ tileCount }} tiles analysed · {{ featureTotal }} features ·
                {{ faunaTotal }} fauna groups · {{ floraTotal }} flora clusters
                · {{ settlementTotal }} urban footprints
              </p>
            </div>
            <div class="legend">
              <div class="legend__item" *ngFor="let entry of biomeLegend">
                <span
                  class="legend__swatch"
                  [style.background]="entry.color"
                ></span>
                <span>{{ entry.label }}</span>
              </div>
            </div>
          </header>

          <div class="map-display">
            <div class="minimap">
              <div class="minimap__header">
                <div>
                  <p class="eyebrow">Minimap</p>
                  <p class="meta">Biome colors, elevation lighting</p>
                </div>
                <span class="pill pill--biome">Live</span>
              </div>
              <canvas
                #minimapCanvas
                class="minimap__canvas"
                [attr.width]="minimapSize"
                [attr.height]="minimapSize"
                aria-label="World minimap"
              ></canvas>
              <p class="minimap__hint">
                Updates whenever you render a new seed and scales to the current grid size.
              </p>
            </div>

            <div class="map">
              <ng-container *ngFor="let row of worldGrid">
                <div class="map__row" [style.gridTemplateColumns]="gridTemplate">
                  <div
                    *ngFor="let cell of row"
                    class="map__cell"
                    [style.background]="biomeFill(cell)"
                    [title]="tooltip(cell)"
                  >
                    <div class="map__cell-top">
                      <span class="pill pill--biome">{{ shortBiome(cell.biome) }}</span>
                      <span class="pill pill--height">
                        {{ cell.elevation | number: '1.1-1' }}
                      </span>
                    </div>
                    <div class="map__cell-bottom">
                      <span
                        class="pill pill--feature"
                        *ngFor="let feature of cell.features"
                      >
                        {{ feature }}
                      </span>
                      <span
                        class="pill pill--settlement"
                        *ngIf="cell.settlement"
                      >
                        {{ formatSettlement(cell.settlement) }}
                      </span>
                      <span
                        class="pill pill--flora"
                        *ngFor="let flora of cell.flora"
                      >
                        {{ flora.name }} ×{{ flora.clusters }}
                      </span>
                      <span
                        class="pill pill--fauna"
                        *ngFor="let herd of cell.fauna"
                      >
                        {{ herd.name }} ×{{ herd.count }}
                      </span>
                    </div>
                  </div>
                </div>
              </ng-container>
            </div>
          </div>
        </article>

        <article class="card details">
          <h3>Biome distribution</h3>
          <ul>
            <li *ngFor="let entry of biomeTotals | keyvalue">
              <span class="chip">{{ entry.key }}</span>
              <span class="muted">{{ entry.value }} cells</span>
            </li>
          </ul>

          <div class="divider"></div>

          <h3>Fauna, flora & features</h3>
          <p class="muted">
            Seeded fauna and flora follow their biome preferences and density
            sliders. The generator also drops rivers, groves, deltas, geysers,
            and ridges according to elevation and rainfall.
          </p>
          <div class="notes-grid">
            <div>
              <p class="eyebrow">Fauna highlights</p>
              <ul class="notes">
                <li *ngFor="let note of faunaNotes">{{ note }}</li>
              </ul>
            </div>
            <div>
              <p class="eyebrow">Flora highlights</p>
              <ul class="notes">
                <li *ngFor="let note of floraNotes">{{ note }}</li>
              </ul>
            </div>
          </div>
        </article>

        <article class="card ledger">
          <header>
            <p class="eyebrow">Ledger</p>
            <h2>Pre-player timeline</h2>
            <p class="meta">
              Worldgen span {{ worldgen.enclaveHistoryYears[0] }}–
              {{ worldgen.enclaveHistoryYears[1] }} years · Seed {{ config.seed }}
            </p>
          </header>
          <ol class="timeline">
            <li *ngFor="let entry of ledger">
              <div class="timeline__year">Year {{ entry.year }}</div>
              <div>
                <h4>{{ entry.title }}</h4>
                <p>{{ entry.detail }}</p>
              </div>
            </li>
          </ol>
        </article>
      </section>
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
        background: radial-gradient(circle at 22% 16%, #1b1334, #0a0718 60%);
        min-height: calc(100vh - 48px);
      }

      .page__header {
        max-width: 960px;
        margin-bottom: 18px;
      }

      .eyebrow {
        margin: 0 0 4px;
        font-size: 12px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        opacity: 0.72;
      }

      h1 {
        margin: 0 0 8px;
        font-size: 26px;
      }

      h2 {
        margin: 0;
      }

      .lede {
        margin: 0;
        line-height: 1.5;
        opacity: 0.9;
      }

      form.controls {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 12px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 10px;
        align-items: end;
        margin-bottom: 16px;
      }

      .controls__group {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 8px;
      }

      label {
        display: grid;
        gap: 4px;
        font-size: 13px;
      }

      input[type='range'] {
        accent-color: #8ac6ff;
      }

      input[type='text'],
      input[type='range'],
      input[type='string'],
      input:not([type]) {
        width: 100%;
      }

      input,
      button {
        font: inherit;
      }

      input[type='text'],
      input:not([type]) {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 8px 10px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: inherit;
      }

      button {
        padding: 10px 14px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: linear-gradient(90deg, #6cb4ff, #a78bfa);
        color: #0b0a12;
        cursor: pointer;
        font-weight: 700;
        justify-self: end;
      }

      .layout {
        display: grid;
        grid-template-columns: 2.5fr 1fr;
        gap: 14px;
      }

      .card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        padding: 14px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
      }

      .card__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .legend {
        display: grid;
        grid-template-columns: repeat(2, minmax(140px, 1fr));
        gap: 6px;
        min-width: 280px;
      }

      .legend__item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        opacity: 0.9;
      }

      .legend__swatch {
        width: 16px;
        height: 12px;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .meta {
        margin: 4px 0 0;
        opacity: 0.76;
      }

      .map-card {
        grid-column: 1 / span 2;
      }

      .map-display {
        display: grid;
        grid-template-columns: minmax(240px, 280px) 1fr;
        gap: 12px;
        align-items: start;
      }

      .minimap {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 10px;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }

      .minimap__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
      }

      .minimap__canvas {
        width: 100%;
        height: auto;
        display: block;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(0, 0, 0, 0.18);
      }

      .minimap__hint {
        margin: 8px 0 0;
        font-size: 12px;
        opacity: 0.76;
      }

      .map {
        margin-top: 12px;
        display: grid;
        gap: 4px;
      }

      .map__row {
        display: grid;
        gap: 4px;
      }

      .map__cell {
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 6px;
        min-height: 72px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
      }

      .map__cell-top,
      .map__cell-bottom {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        padding: 4px 8px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        font-size: 12px;
        gap: 6px;
        background: rgba(0, 0, 0, 0.16);
        white-space: nowrap;
      }

      .pill--biome {
        background: rgba(255, 255, 255, 0.1);
      }

      .pill--height {
        background: rgba(20, 180, 255, 0.15);
        color: #b6e6ff;
      }

      .pill--feature {
        background: rgba(255, 255, 255, 0.08);
      }

      .pill--settlement {
        background: rgba(255, 232, 140, 0.18);
        color: #ffe59d;
        border-color: rgba(255, 232, 140, 0.35);
      }

      .pill--flora {
        background: rgba(186, 233, 152, 0.18);
        color: #e0ffc2;
        border-color: rgba(186, 233, 152, 0.4);
      }

      .pill--fauna {
        background: rgba(152, 233, 189, 0.18);
        color: #c8f5df;
        border-color: rgba(152, 233, 189, 0.35);
      }

      .details ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 8px;
      }

      .chip {
        display: inline-block;
        padding: 4px 10px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 999px;
        margin-right: 8px;
      }

      .muted {
        opacity: 0.7;
      }

      .divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.08);
        margin: 12px 0;
      }

      .notes {
        margin: 0;
        padding-left: 18px;
        display: grid;
        gap: 6px;
      }

      .notes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
        align-items: start;
      }

      .ledger {
        grid-column: 1 / span 2;
      }

      .timeline {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 12px;
      }

      .timeline__year {
        font-weight: 700;
        color: #b8f4ff;
      }

      .timeline h4 {
        margin: 0;
      }

      .timeline p {
        margin: 4px 0 0;
        opacity: 0.86;
      }

      @media (max-width: 1100px) {
        .layout {
          grid-template-columns: 1fr;
        }

        .map-card,
        .ledger {
          grid-column: 1;
        }
      }
    `,
  ],
})
export class WorldRenderComponent implements OnInit {
  private readonly designDoc = inject(DesignDocService);
  readonly worldgen: WorldGenerationSection = this.designDoc.getDocument().worldgen;

  mapSize = 14;
  config: WorldConfig = {
    seed: 'ANNA-7742',
    seaLevel: 0.32,
    rainfall: 0.58,
    faunaDensity: 1,
    floraDensity: 1,
    urbanizationBias: 0.7,
    featureBias: 0.8,
  };

  worldGrid: MapCell[][] = [];
  biomeTotals: Record<string, number> = {};
  faunaNotes: string[] = [];
  floraNotes: string[] = [];
  ledger: LedgerEntry[] = [];
  tileCount = 0;
  featureTotal = 0;
  faunaTotal = 0;
  floraTotal = 0;
  settlementTotal = 0;
  minimapSize = 240;

  @ViewChild('minimapCanvas', { static: true })
  minimapCanvas?: ElementRef<HTMLCanvasElement>;

  readonly biomeLegend = [
    { label: 'Water / ocean', color: 'linear-gradient(180deg, #0b456e, #082a4a)' },
    { label: 'Beach', color: 'linear-gradient(180deg, #f4d6a8, #c69c63)' },
    { label: 'Grassland', color: 'linear-gradient(180deg, #6ba95d, #4f8c3e)' },
    { label: 'Woodland', color: 'linear-gradient(180deg, #4d7a38, #2e5c24)' },
    { label: 'Forest / Rainforest', color: 'linear-gradient(180deg, #1f5f46, #103525)' },
    { label: 'Desert', color: 'linear-gradient(180deg, #f6c18b, #c48d53)' },
    { label: 'Taiga / Alpine', color: 'linear-gradient(180deg, #9bc0d6, #5e87a2)' },
  ];

  get gridTemplate() {
    return `repeat(${this.mapSize}, minmax(0, 1fr))`;
  }

  private readonly biomeColorMap: Record<BiomeType | string, string> = {
    [BiomeType.Ocean]: '#0b456e',
    [BiomeType.Water]: '#0b456e',
    [BiomeType.Beach]: '#f4d6a8',
    [BiomeType.Grassland]: '#6ba95d',
    [BiomeType.Woodland]: '#4d7a38',
    [BiomeType.Forest]: '#1f5f46',
    [BiomeType.Rainforest]: '#0f4b32',
    [BiomeType.Desert]: '#f6c18b',
    [BiomeType.Taiga]: '#9bc0d6',
    [BiomeType.Alpine]: '#c2d9e8',
    [BiomeType.AlpineGrassland]: '#8ec8a2',
  };

  ngOnInit() {
    this.renderWorld();
  }

  renderWorld() {
    const seed = this.hashSeed(this.config.seed);
    const grid: MapCell[][] = [];
    const flat: MapCell[] = [];

    for (let y = 0; y < this.mapSize; y++) {
      const row: MapCell[] = [];
      for (let x = 0; x < this.mapSize; x++) {
        const cellSeed = seed ^ (x * 374761393) ^ (y * 668265263);
        const rng = this.mulberry32(cellSeed);
        const elevation = this.generateElevation(x, y, rng);
        const moisture = this.generateMoisture(x, y, rng);
        const biome = this.pickBiome(elevation, moisture);
        const features = this.pickFeatures(biome, elevation, moisture, rng);
        const flora = this.placeFlora(biome, rng);
        const fauna = this.placeFauna(biome, rng);
        const settlement = this.placeSettlement(biome, elevation, moisture, rng);
        const cell: MapCell = {
          x,
          y,
          elevation,
          moisture,
          biome,
          features,
          flora,
          fauna,
          settlement,
        };
        row.push(cell);
        flat.push(cell);
      }
      grid.push(row);
    }

    this.worldGrid = grid;
    this.biomeTotals = this.countBiomes(flat);
    this.tileCount = flat.length;
    this.featureTotal = flat.reduce((sum, cell) => sum + cell.features.length, 0);
    this.faunaTotal = flat.reduce((sum, cell) => sum + cell.fauna.length, 0);
    this.floraTotal = flat.reduce((sum, cell) => sum + cell.flora.length, 0);
    this.settlementTotal = flat.filter((c) => !!c.settlement).length;
    this.faunaNotes = this.generateFaunaNotes(flat);
    this.floraNotes = this.generateFloraNotes(flat);
    this.ledger = this.buildLedger(seed);
    this.drawMinimap();
  }

  private drawMinimap() {
    if (!this.minimapCanvas || !this.worldGrid.length) {
      return;
    }

    const canvas = this.minimapCanvas.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    const size = Math.max(160, Math.min(360, this.mapSize * 18));
    this.minimapSize = size;
    canvas.width = size;
    canvas.height = size;

    const cellSize = size / this.mapSize;
    context.clearRect(0, 0, size, size);

    for (const row of this.worldGrid) {
      for (const cell of row) {
        context.fillStyle = this.getTileColor(cell);
        context.fillRect(
          cell.x * cellSize,
          cell.y * cellSize,
          Math.ceil(cellSize),
          Math.ceil(cellSize)
        );
      }
    }

    context.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    context.lineWidth = 1;
    context.strokeRect(0.5, 0.5, size - 1, size - 1);
  }

  private getTileColor(cell: MapCell): string {
    const base = this.biomeColorMap[cell.biome] ?? '#666666';
    const elevationFactor = Math.max(0, Math.min(1, cell.elevation));
    return this.lightenColor(base, 0.25 + elevationFactor * 0.35);
  }

  private lightenColor(hex: string, factor: number): string {
    const normalized = hex.replace('#', '');
    const r = parseInt(normalized.substring(0, 2), 16);
    const g = parseInt(normalized.substring(2, 4), 16);
    const b = parseInt(normalized.substring(4, 6), 16);

    const mix = (value: number) =>
      Math.min(255, Math.round(value + (255 - value) * factor));

    const toHex = (value: number) => value.toString(16).padStart(2, '0');

    return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
  }

  shortBiome(biome: BiomeType): string {
    switch (biome) {
      case BiomeType.AlpineGrassland:
        return 'Alpine glade';
      case BiomeType.Alpine:
        return 'Alpine';
      case BiomeType.Woodland:
        return 'Wood';
      case BiomeType.Rainforest:
        return 'Rain';
      case BiomeType.Grassland:
        return 'Grass';
      case BiomeType.Forest:
        return 'Forest';
      case BiomeType.Beach:
        return 'Beach';
      case BiomeType.Ocean:
      case BiomeType.Water:
        return 'Water';
      case BiomeType.Taiga:
        return 'Taiga';
      case BiomeType.Desert:
        return 'Desert';
      default:
        return biome;
    }
  }

  biomeFill(cell: MapCell): string {
    const mix = (light: string, dark: string) =>
      `linear-gradient(180deg, ${light}, ${dark})`;

    switch (cell.biome) {
      case BiomeType.Ocean:
      case BiomeType.Water:
        return mix('#0b456e', '#082a4a');
      case BiomeType.Beach:
        return mix('#f4d6a8', '#c69c63');
      case BiomeType.Grassland:
        return mix('#6ba95d', '#4f8c3e');
      case BiomeType.Woodland:
        return mix('#4d7a38', '#2e5c24');
      case BiomeType.Forest:
        return mix('#1f5f46', '#103525');
      case BiomeType.Rainforest:
        return mix('#0f4b32', '#082b1d');
      case BiomeType.Desert:
        return mix('#f6c18b', '#c48d53');
      case BiomeType.Taiga:
        return mix('#9bc0d6', '#5e87a2');
      case BiomeType.Alpine:
        return mix('#c2d9e8', '#8db5d1');
      case BiomeType.AlpineGrassland:
        return mix('#8ec8a2', '#5f9c78');
      default:
        return mix('#444', '#222');
    }
  }

  tooltip(cell: MapCell): string {
    const elevation = `Elevation: ${cell.elevation.toFixed(2)}`;
    const moisture = `Moisture: ${cell.moisture.toFixed(2)}`;
    const biome = `Biome: ${cell.biome}`;
    const features = cell.features.length
      ? `Features: ${cell.features.join(', ')}`
      : 'Features: none';
    const flora = cell.flora.length
      ? `Flora: ${cell.flora.map((f) => `${f.name}×${f.clusters}`).join(', ')}`
      : 'Flora: none';
    const fauna = cell.fauna.length
      ? `Fauna: ${cell.fauna.map((f) => `${f.name}×${f.count}`).join(', ')}`
      : 'Fauna: none';
    const settlement = cell.settlement
      ? `Settlement: ${this.formatSettlement(cell.settlement)}`
      : 'Settlement: none';

    return [elevation, moisture, biome, features, flora, fauna, settlement].join('\n');
  }

  formatSettlement(type: SettlementType) {
    switch (type) {
      case SettlementType.Hamlet:
        return 'Hamlet';
      case SettlementType.Village:
        return 'Village';
      case SettlementType.TradingPost:
        return 'Trade post';
      case SettlementType.Town:
        return 'Town';
      case SettlementType.City:
        return 'City';
      case SettlementType.Metropolis:
        return 'Metropolis';
      case SettlementType.Capital:
        return 'Capital';
      case SettlementType.Fortress:
        return 'Fortress';
      case SettlementType.TradeHub:
        return 'Trade hub';
      default:
        return type;
    }
  }

  private generateElevation(x: number, y: number, rng: () => number): number {
    const nx = x / (this.mapSize - 1) - 0.5;
    const ny = y / (this.mapSize - 1) - 0.5;
    const radial = 1 - Math.hypot(nx, ny) * 1.12;
    const ridge =
      0.16 * Math.sin((x + this.config.rainfall * 10) / 3.6) *
      Math.cos((y + this.config.seaLevel * 10) / 2.9);
    const noise = (rng() - 0.5) * 0.35 + (rng() - 0.5) * 0.18;
    const elevation = radial * 0.72 + ridge + noise + 0.35;
    return this.clamp(elevation, 0, 1);
  }

  private generateMoisture(x: number, y: number, rng: () => number): number {
    const latBand = 0.5 + 0.25 * Math.sin((y / this.mapSize) * Math.PI * 1.2);
    const coastalBias = 0.18 * (1 - Math.abs(0.5 - x / (this.mapSize - 1)) * 2);
    const noise = (rng() - 0.5) * 0.22;
    const rainfall = this.config.rainfall * 0.6;
    return this.clamp(latBand + coastalBias + rainfall + noise, 0, 1);
  }

  private pickBiome(elevation: number, moisture: number): BiomeType {
    const sea = this.config.seaLevel;

    if (elevation < sea * 0.65) {
      return BiomeType.Ocean;
    }

    if (elevation < sea * 0.95) {
      return BiomeType.Water;
    }

    if (elevation < sea + 0.05) {
      return BiomeType.Beach;
    }

    if (elevation > 0.86) {
      return moisture > 0.55 ? BiomeType.AlpineGrassland : BiomeType.Alpine;
    }

    if (elevation > 0.72) {
      return moisture > 0.5 ? BiomeType.Taiga : BiomeType.Alpine;
    }

    if (moisture > 0.8) {
      return BiomeType.Rainforest;
    }

    if (moisture > 0.65) {
      return BiomeType.Forest;
    }

    if (moisture > 0.5) {
      return BiomeType.Woodland;
    }

    if (moisture > 0.34) {
      return BiomeType.Grassland;
    }

    return BiomeType.Desert;
  }

  private pickFeatures(
    biome: BiomeType,
    elevation: number,
    moisture: number,
    rng: () => number,
  ): string[] {
    const entries: { label: string; weight: number; test: () => boolean }[] = [
      {
        label: 'River delta',
        weight: 0.6,
        test: () => moisture > 0.55 && biome !== BiomeType.Desert,
      },
      {
        label: 'Ancient grove',
        weight: 0.36,
        test: () =>
          [BiomeType.Forest, BiomeType.Woodland, BiomeType.Rainforest].includes(
            biome,
          ),
      },
      {
        label: 'Geyser spring',
        weight: 0.28,
        test: () => biome === BiomeType.Desert || biome === BiomeType.Taiga,
      },
      {
        label: 'Ridge line',
        weight: 0.3,
        test: () => elevation > 0.7,
      },
      {
        label: 'Crystal pool',
        weight: 0.22,
        test: () => moisture > 0.68,
      },
      {
        label: 'Wind carved arch',
        weight: 0.18,
        test: () => biome === BiomeType.Desert,
      },
      {
        label: 'Cypress swamp',
        weight: 0.25,
        test: () => biome === BiomeType.Water || biome === BiomeType.Beach,
      },
    ];

    const features: string[] = [];
    for (const entry of entries) {
      const chance = entry.weight * this.config.featureBias * 0.3;
      if (entry.test() && rng() < chance) {
        features.push(this.humanizeFeature(entry.label));
      }
    }

    return features.slice(0, 3);
  }

  private placeFlora(biome: BiomeType, rng: () => number): FloraPlacement[] {
    const flora: FloraPlacement[] = [];

    const candidates = FLORA_PROFILES.filter((f) => f.biomes.includes(biome));
    for (const profile of candidates) {
      const chance = profile.presence * this.config.floraDensity;
      if (rng() < chance) {
        const clusters = this.randomInt(
          profile.clusterSize[0],
          profile.clusterSize[1],
          rng,
        );
        flora.push({
          id: profile.id,
          name: profile.name,
          clusters,
          note: profile.note,
        });
      }
    }

    return flora.slice(0, 2);
  }

  private placeFauna(biome: BiomeType, rng: () => number): FaunaPlacement[] {
    const fauna: FaunaPlacement[] = [];

    const candidates = FAUNA_PROFILES.filter((f) => f.biomes.includes(biome));
    for (const profile of candidates) {
      const chance = profile.presence * this.config.faunaDensity;
      if (rng() < chance) {
        const count = this.randomInt(profile.groupSize[0], profile.groupSize[1], rng);
        fauna.push({
          id: profile.id,
          name: profile.name,
          count,
          note: profile.note,
        });
      }
    }

    return fauna.slice(0, 2);
  }

  private placeSettlement(
    biome: BiomeType,
    elevation: number,
    moisture: number,
    rng: () => number,
  ): SettlementType | undefined {
    if ([BiomeType.Ocean, BiomeType.Water].includes(biome)) {
      return undefined;
    }

    const viability = this.clamp((elevation - this.config.seaLevel) * 1.4, 0, 1);
    const livability = this.clamp(1 - Math.abs(moisture - 0.55), 0, 1);
    const baseChance = (0.012 + viability * 0.02 + livability * 0.03) *
      this.config.urbanizationBias;

    if (rng() > baseChance) {
      return undefined;
    }

    const roll = rng();
    if (roll > 0.9) return SettlementType.Capital;
    if (roll > 0.8) return SettlementType.City;
    if (roll > 0.7) return SettlementType.TradeHub;
    if (roll > 0.55) return SettlementType.Fortress;
    if (roll > 0.4) return SettlementType.Town;
    if (roll > 0.25) return SettlementType.Village;
    if (roll > 0.15) return SettlementType.TradingPost;
    return SettlementType.Hamlet;
  }

  private countBiomes(cells: MapCell[]): Record<string, number> {
    return cells.reduce<Record<string, number>>((acc, cell) => {
      acc[cell.biome] = (acc[cell.biome] ?? 0) + 1;
      return acc;
    }, {});
  }

  private generateFaunaNotes(cells: MapCell[]): string[] {
    const faunaCounts = new Map<string, number>();

    for (const cell of cells) {
      for (const herd of cell.fauna) {
        faunaCounts.set(herd.name, (faunaCounts.get(herd.name) ?? 0) + herd.count);
      }
    }

    const sorted = [...faunaCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
    if (!sorted.length) {
      return ['No fauna placed yet — raise density or pick a wetter, greener seed.'];
    }

    return sorted.map(([name, count]) => `${name}: ${count} individuals across the enclave.`);
  }

  private generateFloraNotes(cells: MapCell[]): string[] {
    const floraCounts = new Map<string, number>();

    for (const cell of cells) {
      for (const patch of cell.flora) {
        floraCounts.set(
          patch.name,
          (floraCounts.get(patch.name) ?? 0) + patch.clusters,
        );
      }
    }

    const sorted = [...floraCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
    if (!sorted.length) {
      return ['No flora clustered yet — increase rainfall, density, or pick a milder seed.'];
    }

    return sorted.map(([name, count]) => `${name}: ${count} clusters flourishing across the enclave.`);
  }

  private buildLedger(seed: number): LedgerEntry[] {
    const rng = this.mulberry32(seed ^ 0xa11ce);
    const [minYears, maxYears] = this.worldgen.enclaveHistoryYears;
    const historySpan = this.randomInt(minYears, maxYears, rng);
    const startYear = -historySpan;

    const entries: LedgerEntry[] = [];
    const pipeline = this.worldgen.pipelineSteps;

    entries.push({
      year: startYear,
      title: 'Topography & resources resolved',
      detail: pipeline[0],
    });

    entries.push({
      year: startYear + Math.floor(historySpan * 0.15),
      title: 'Tribal territories staked',
      detail: pipeline[1],
    });

    entries.push({
      year: startYear + Math.floor(historySpan * 0.28),
      title: 'Proto-capitals founded',
      detail: 'Wave 1 focuses on water access, safety, and early resources.',
    });

    entries.push({
      year: startYear + Math.floor(historySpan * 0.42),
      title: 'Resource towns follow',
      detail: 'Wave 2 pushes roads toward ore veins, groves, and pasture.',
    });

    entries.push({
      year: startYear + Math.floor(historySpan * 0.62),
      title: 'Hamlets fill the frontier',
      detail: 'Wave 3 breaks isolation penalties and seeds minor trade posts.',
    });

    entries.push({
      year: startYear + Math.floor(historySpan * 0.78),
      title: 'History simulation',
      detail:
        'Wars, migrations, and anomalies resolve into merged settlements and abandoned hamlets.',
    });

    entries.push({
      year: -1,
      title: 'Genesis Chain compiled',
      detail: `NPC-only ledger covers ${historySpan} years of trade, famine, raids, and treaties.`,
    });

    entries.push({
      year: 0,
      title: 'Player landfall',
      detail: 'Arrival syncs to the Genesis Chain hash and attaches a personal ledger.',
    });

    return entries.sort((a, b) => a.year - b.year);
  }

  private randomInt(min: number, max: number, rng: () => number): number {
    return Math.floor(rng() * (max - min + 1)) + min;
  }

  private mulberry32(seed: number): () => number {
    return () => {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  private hashSeed(seed: string): number {
    let h = 1779033703 ^ seed.length;
    for (let i = 0; i < seed.length; i++) {
      h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return h >>> 0;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  private humanizeFeature(feature: NatureFeatureType | string): string {
    return feature
      .toString()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
