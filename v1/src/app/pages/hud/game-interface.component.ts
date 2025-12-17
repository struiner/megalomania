import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type HudButton = {
  label: string;
  route?: string;
  description: string;
};

type StatusReadout = {
  label: string;
  value: string;
};

type AlertItem = {
  title: string;
  detail: string;
};

@Component({
  selector: 'app-game-interface',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="hud-page">
      <div class="world-backdrop">
        <div class="backdrop-overlay">
          <div class="backdrop-title">Live World Feed</div>
          <p>Ledger-derived world render placeholder. Camera feed is intentionally non-interactive here.</p>
        </div>
      </div>

      <footer class="hud-bar">
        <div class="minimap" aria-label="Local minimap">
          <div class="minimap-header">
            <span class="label">Minimap</span>
            <span class="subtitle">Enclave Zone 04: Delta Marsh</span>
          </div>
          <div class="minimap-grid">
            <div
              *ngFor="let tile of minimapTiles"
              class="tile"
              [class.water]="tile.type === 'water'"
              [class.settlement]="tile.type === 'settlement'"
              [class.trade]="tile.type === 'trade'"
            >
              <span>{{ tile.label }}</span>
            </div>
          </div>
          <div class="minimap-legend">
            <span class="legend-dot water"></span> Water
            <span class="legend-dot settlement"></span> Settlement
            <span class="legend-dot trade"></span> Trade lane
          </div>
        </div>

        <div class="control-grid" aria-label="HUD controls">
          <header>
            <h3>Command Grid</h3>
            <p>Quick actions route into existing screens. No state is mutated from this bar.</p>
          </header>
          <div class="grid">
            <button
              *ngFor="let button of hudButtons"
              class="grid-button"
              [routerLink]="button.route"
              [attr.aria-label]="button.label"
              [disabled]="!button.route"
              type="button"
            >
              <div class="title">{{ button.label }}</div>
              <div class="hint">{{ button.description }}</div>
            </button>
          </div>
        </div>

        <div class="info-panels">
          <section class="panel" aria-label="Status readouts">
            <header>
              <h3>Situation</h3>
              <span class="chip">Derived view</span>
            </header>
            <ul>
              <li *ngFor="let status of statusReadout">
                <span class="label">{{ status.label }}</span>
                <span class="value">{{ status.value }}</span>
              </li>
            </ul>
          </section>

          <section class="panel" aria-label="HUD alerts">
            <header>
              <h3>Alerts</h3>
              <span class="chip">Navigation only</span>
            </header>
            <div class="alerts">
              <article *ngFor="let alert of alerts">
                <h4>{{ alert.title }}</h4>
                <p>{{ alert.detail }}</p>
              </article>
            </div>
          </section>
        </div>
      </footer>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .hud-page {
        display: flex;
        flex-direction: column;
        min-height: calc(100vh - 48px);
        background: radial-gradient(circle at 80% 20%, #17102b, #0c0819 55%);
        color: #e8ddff;
        font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
      }

      .world-backdrop {
        flex: 1;
        position: relative;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        background: linear-gradient(120deg, rgba(74, 48, 110, 0.3), rgba(13, 17, 43, 0.65));
        overflow: hidden;
      }

      .backdrop-overlay {
        position: absolute;
        inset: 0;
        display: grid;
        place-content: center;
        text-align: center;
        gap: 8px;
        color: rgba(232, 221, 255, 0.85);
        backdrop-filter: blur(2px);
      }

      .backdrop-title {
        letter-spacing: 0.2em;
        text-transform: uppercase;
        font-size: 13px;
        font-weight: 700;
        color: #c19eff;
      }

      .hud-bar {
        display: grid;
        grid-template-columns: 1fr 1.2fr 1fr;
        gap: 20px;
        padding: 18px 20px;
        background: linear-gradient(180deg, rgba(24, 16, 45, 0.95), rgba(10, 6, 18, 0.98));
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 -12px 28px rgba(0, 0, 0, 0.45);
      }

      .minimap {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
      }

      .minimap-header {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .minimap-header .label {
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #b999ff;
      }

      .minimap-header .subtitle {
        font-size: 12px;
        opacity: 0.75;
      }

      .minimap-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
        aspect-ratio: 1 / 1;
      }

      .tile {
        border-radius: 8px;
        display: grid;
        place-items: center;
        font-size: 11px;
        color: rgba(232, 221, 255, 0.85);
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.04);
      }

      .tile.water {
        background: linear-gradient(145deg, rgba(80, 146, 255, 0.35), rgba(36, 82, 154, 0.45));
      }

      .tile.settlement {
        background: linear-gradient(145deg, rgba(116, 255, 204, 0.25), rgba(59, 167, 143, 0.45));
      }

      .tile.trade {
        background: linear-gradient(145deg, rgba(255, 214, 102, 0.25), rgba(196, 142, 52, 0.42));
      }

      .minimap-legend {
        display: flex;
        gap: 12px;
        align-items: center;
        font-size: 12px;
        color: rgba(232, 221, 255, 0.85);
      }

      .legend-dot {
        width: 10px;
        height: 10px;
        display: inline-block;
        border-radius: 999px;
        margin-right: 6px;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.05);
      }

      .legend-dot.water {
        background: #5794ff;
      }

      .legend-dot.settlement {
        background: #5ce0b8;
      }

      .legend-dot.trade {
        background: #ffcf6b;
      }

      .control-grid {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .control-grid header {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .control-grid h3,
      .panel h3 {
        margin: 0;
        font-size: 16px;
        color: #f3e9ff;
      }

      .control-grid p {
        margin: 0;
        color: rgba(232, 221, 255, 0.7);
        font-size: 13px;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
      }

      .grid-button {
        text-align: left;
        border-radius: 12px;
        padding: 10px 12px;
        background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #f5eeff;
        cursor: pointer;
        transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
      }

      .grid-button:hover:not(:disabled) {
        transform: translateY(-2px);
        border-color: rgba(140, 94, 255, 0.65);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      }

      .grid-button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .grid-button .title {
        font-weight: 700;
        font-size: 14px;
      }

      .grid-button .hint {
        font-size: 12px;
        color: rgba(232, 221, 255, 0.75);
      }

      .info-panels {
        display: grid;
        grid-template-rows: 1fr 1fr;
        gap: 12px;
      }

      .panel {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .panel header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .chip {
        padding: 4px 8px;
        border-radius: 999px;
        background: rgba(140, 94, 255, 0.12);
        color: #d9c1ff;
        border: 1px solid rgba(140, 94, 255, 0.35);
        font-size: 11px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        font-weight: 700;
      }

      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 12px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        font-size: 13px;
      }

      .value {
        color: #7df7d1;
        font-weight: 700;
        letter-spacing: 0.02em;
      }

      .alerts {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      article {
        border-radius: 10px;
        padding: 10px 12px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        background: rgba(255, 255, 255, 0.03);
      }

      article h4 {
        margin: 0 0 4px;
        font-size: 14px;
      }

      article p {
        margin: 0;
        color: rgba(232, 221, 255, 0.75);
        font-size: 13px;
      }

      @media (max-width: 1200px) {
        .hud-bar {
          grid-template-columns: 1fr;
        }

        .info-panels {
          grid-template-columns: 1fr;
          grid-template-rows: none;
        }
      }
    `,
  ],
})
export class GameInterfaceComponent {
  readonly hudButtons: HudButton[] = [
    {
      label: 'World Render',
      route: 'world/render',
      description: 'Opens the ledger-derived world renderer.'
    },
    {
      label: 'Generation Seeds',
      route: 'world/generation',
      description: 'Inspect deterministic generation inputs.'
    },
    {
      label: 'Goods',
      route: 'economy/goods',
      description: 'Review commodity catalogue and yields.'
    },
    {
      label: 'Production',
      route: 'settlements/production',
      description: 'Jump to settlement production overview.'
    },
    {
      label: 'Design Doc',
      route: 'game/design-doc',
      description: 'Open the current gameplay design reference.'
    },
    {
      label: 'Biomes',
      route: 'biomes/overview',
      description: 'Browse biome archetypes and resources.'
    },
    {
      label: 'Convoys',
      route: 'fleets/convoys',
      description: 'Plan or inspect active trade convoys.'
    },
    {
      label: 'SDK: Goods Manager',
      route: 'sdk/goods',
      description: 'Enter SDK goods management surface.'
    }
  ];

  readonly statusReadout: StatusReadout[] = [
    { label: 'Settlement', value: 'Deltaport (Tier II)' },
    { label: 'Population', value: '12,480 (+82/mo)' },
    { label: 'Cargo en route', value: '4 convoys (ETA 6h)' },
    { label: 'Treasury', value: '₥ 42,800' },
  ];

  readonly alerts: AlertItem[] = [
    { title: 'Harbor backlog', detail: 'Two convoys waiting for dock clearance. Consider expanding piers.' },
    { title: 'Supply pressure', detail: 'Salted fish reserves at 34%. Route to northern fisheries recommended.' },
    { title: 'Guild envoy inbound', detail: 'Diplomatic vessel ETA 18m. Prepare trade privileges review.' }
  ];

  readonly minimapTiles = [
    { label: 'W1', type: 'water' },
    { label: 'W2', type: 'water' },
    { label: 'C1', type: 'trade' },
    { label: 'C2', type: 'trade' },
    { label: 'H1', type: 'settlement' },
    { label: 'H2', type: 'settlement' },
    { label: 'G1', type: 'trade' },
    { label: 'G2', type: 'trade' },
    { label: 'P1', type: 'settlement' },
    { label: 'P2', type: 'trade' },
    { label: 'W3', type: 'water' },
    { label: 'W4', type: 'water' },
    { label: 'T1', type: 'trade' },
    { label: 'T2', type: 'trade' },
    { label: 'T3', type: 'settlement' },
    { label: 'T4', type: 'water' },
  ];
}
