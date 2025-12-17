import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface HudAction {
  label: string;
  description: string;
  route?: string;
  badge?: string;
}

interface HudPane {
  title: string;
  subtitle: string;
  highlights: { label: string; value: string; accent?: 'good' | 'warn' | 'muted' }[];
}

@Component({
  selector: 'app-hud',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="interface-screen">
      <div class="viewframe">
        <div class="viewframe__status">HUD ONLINE · Settlement link stable · Convoys synced</div>
        <div class="viewframe__glow"></div>
      </div>

      <footer class="hud">
        <div class="hud__segment hud__segment--minimap">
          <div class="hud__heading">
            <div>
              <p class="eyebrow">Minimap</p>
              <p class="title">St. Elara Sound</p>
            </div>
            <span class="pill">Recon</span>
          </div>

          <div class="minimap">
            <div
              *ngFor="let tile of minimapTiles"
              class="minimap__tile"
              [style.background]="tile.color"
              [class.minimap__tile--city]="tile.type === 'city'"
              [class.minimap__tile--ship]="tile.type === 'ship'"
              [class.minimap__tile--focus]="tile.type === 'focus'"
            ></div>
          </div>

          <div class="minimap__legend">
            <span class="dot dot--city"></span>City
            <span class="dot dot--ship"></span>Convoy
            <span class="dot dot--focus"></span>Player focus
          </div>
        </div>

        <div class="hud__segment hud__segment--actions">
          <div class="hud__heading">
            <div>
              <p class="eyebrow">Command Deck</p>
              <p class="title">Immediate orders</p>
            </div>
            <span class="pill pill--ghost">No cooldowns</span>
          </div>

          <div class="actions-grid">
            <button
              *ngFor="let action of actions"
              type="button"
              class="action"
              [routerLink]="action.route ? ['/', action.route] : null"
              [attr.aria-label]="action.label"
            >
              <span class="action__label">{{ action.label }}</span>
              <span class="action__desc">{{ action.description }}</span>
              <span *ngIf="action.badge" class="pill pill--badge">{{ action.badge }}</span>
            </button>
          </div>
        </div>

        <div class="hud__segment hud__segment--panes">
          <div class="info-pane" *ngFor="let pane of panes">
            <div class="info-pane__header">
              <div>
                <p class="eyebrow">{{ pane.subtitle }}</p>
                <p class="title">{{ pane.title }}</p>
              </div>
              <span class="pill pill--ghost">Live</span>
            </div>

            <ul class="info-pane__list">
              <li *ngFor="let highlight of pane.highlights" [class.is-good]="highlight.accent === 'good'" [class.is-warn]="highlight.accent === 'warn'">
                <span>{{ highlight.label }}</span>
                <span>{{ highlight.value }}</span>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: calc(100vh - 48px);
        background: radial-gradient(circle at 20% 20%, #1d1630, #0b0816 65%);
        color: #e9e2ff;
        font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .interface-screen {
        position: relative;
        min-height: calc(100vh - 48px);
        padding-bottom: 220px;
      }

      .viewframe {
        position: relative;
        height: calc(100vh - 220px);
        border-radius: 18px;
        margin: 24px;
        background: linear-gradient(135deg, rgba(61, 47, 96, 0.45), rgba(17, 12, 29, 0.85));
        border: 1px solid rgba(255, 255, 255, 0.05);
        overflow: hidden;
      }

      .viewframe__glow {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 60% 40%, rgba(147, 117, 255, 0.25), transparent 45%),
          radial-gradient(circle at 30% 70%, rgba(62, 205, 255, 0.18), transparent 35%);
        filter: blur(20px);
        pointer-events: none;
      }

      .viewframe__status {
        position: absolute;
        bottom: 18px;
        left: 18px;
        padding: 8px 14px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.08);
        letter-spacing: 0.02em;
        font-size: 12px;
        text-transform: uppercase;
      }

      .hud {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 14px 18px 18px;
        display: grid;
        grid-template-columns: 320px 1fr 520px;
        gap: 12px;
        backdrop-filter: blur(18px);
        background: linear-gradient(180deg, rgba(13, 9, 22, 0.6), rgba(13, 9, 22, 0.92));
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.35);
      }

      .hud__segment {
        padding: 14px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        background: rgba(18, 12, 27, 0.8);
      }

      .hud__heading {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
      }

      .eyebrow {
        margin: 0;
        font-size: 11px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #9ca0b5;
      }

      .title {
        margin: 2px 0 0;
        font-size: 16px;
        font-weight: 600;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        border-radius: 999px;
        font-size: 12px;
        color: #f5edff;
        background: linear-gradient(135deg, rgba(122, 87, 255, 0.25), rgba(80, 193, 255, 0.25));
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .pill--ghost {
        background: rgba(255, 255, 255, 0.04);
      }

      .pill--badge {
        background: rgba(72, 225, 182, 0.16);
        color: #7ef5cb;
        border-color: rgba(126, 245, 203, 0.35);
      }

      .minimap {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 6px;
        aspect-ratio: 1;
        background: radial-gradient(circle at 30% 25%, rgba(118, 94, 191, 0.25), rgba(25, 18, 44, 0.8));
        padding: 12px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }

      .minimap__tile {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }

      .minimap__tile--city {
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.25);
      }

      .minimap__tile--ship {
        box-shadow: 0 0 0 2px rgba(80, 193, 255, 0.6);
      }

      .minimap__tile--focus {
        box-shadow: 0 0 0 2px rgba(126, 245, 203, 0.8);
      }

      .minimap__legend {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 10px;
        font-size: 12px;
        color: #bac0d5;
      }

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 4px;
      }

      .dot--city {
        background: #ffd166;
      }

      .dot--ship {
        background: #7ec5ff;
      }

      .dot--focus {
        background: #7ef5cb;
      }

      .actions-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
      }

      .action {
        position: relative;
        background: linear-gradient(135deg, rgba(57, 44, 96, 0.5), rgba(30, 24, 45, 0.9));
        border: 1px solid rgba(255, 255, 255, 0.07);
        color: #f4efff;
        padding: 12px;
        border-radius: 12px;
        text-align: left;
        transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
        min-height: 92px;
      }

      .action:hover {
        transform: translateY(-2px);
        border-color: rgba(126, 245, 203, 0.6);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      }

      .action__label {
        display: block;
        font-weight: 700;
        margin-bottom: 6px;
      }

      .action__desc {
        display: block;
        font-size: 13px;
        color: #c3c7dd;
        max-width: 18ch;
        line-height: 1.2;
      }

      .hud__segment--panes {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        background: transparent;
        border: none;
        padding: 0;
      }

      .info-pane {
        padding: 14px;
        border-radius: 14px;
        background: rgba(17, 13, 24, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .info-pane__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .info-pane__list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 8px;
      }

      .info-pane__list li {
        display: flex;
        justify-content: space-between;
        padding: 10px 12px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        color: #dce2f6;
      }

      .info-pane__list li.is-good {
        border-color: rgba(126, 245, 203, 0.25);
        color: #9af0d0;
      }

      .info-pane__list li.is-warn {
        border-color: rgba(255, 209, 102, 0.5);
        color: #ffd166;
      }

      @media (max-width: 1260px) {
        .hud {
          grid-template-columns: 280px 1fr 420px;
        }
      }

      @media (max-width: 1080px) {
        .hud {
          grid-template-columns: 1fr;
          position: static;
        }

        .interface-screen {
          padding-bottom: 0;
        }

        .hud__segment--panes {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class HudComponent {
  minimapTiles = [
    { color: '#1b2a3c' },
    { color: '#1f3349' },
    { color: '#24405b' },
    { color: '#1f3349' },
    { color: '#162437' },
    { color: '#111a2c' },
    { color: '#233b55' },
    { color: '#1f3349' },
    { color: '#5a2d4f', type: 'city' },
    { color: '#1c2f46' },
    { color: '#19273b', type: 'focus' },
    { color: '#142136' },
    { color: '#1a2b42' },
    { color: '#1f3349' },
    { color: '#1a2b42' },
    { color: '#1f3349', type: 'ship' },
    { color: '#24405b' },
    { color: '#1f3349' },
    { color: '#1c2f46' },
    { color: '#1b2a3c' },
    { color: '#17253a' },
    { color: '#1b2a3c' },
    { color: '#19273b' },
    { color: '#233b55' },
    { color: '#1f3349' },
    { color: '#1a2b42', type: 'city' },
    { color: '#17253a' },
    { color: '#1c2f46' },
    { color: '#142136' },
    { color: '#1a2b42' },
    { color: '#1f3349' },
    { color: '#22364f' },
    { color: '#1b2a3c' },
    { color: '#19273b' },
    { color: '#233b55' },
    { color: '#1a2b42' },
  ];

  actions: HudAction[] = [
    {
      label: 'Open Ledger',
      description: 'View latest economic and civic events',
      route: 'economy/goods',
    },
    {
      label: 'Render World',
      description: 'Jump to current world render view',
      route: 'world/render',
    },
    {
      label: 'Settlement Ops',
      description: 'Production queue and staffing',
      route: 'settlements/production',
      badge: '+3',
    },
    {
      label: 'Design Intent',
      description: 'Read the active design document',
      route: 'game/design-doc',
    },
    {
      label: 'Trade Routes',
      description: 'Convoy paths and harbor readiness',
      route: 'exploration/routes',
    },
    {
      label: 'Diplomacy',
      description: 'State of nations and guild relations',
      route: 'diplomacy/nations',
    },
    {
      label: 'SDK Surface',
      description: 'Jump into structure tooling',
      route: 'sdk/structure-manager',
    },
    {
      label: 'Market Pulse',
      description: 'Goods volatility and price signals',
      route: 'economy/goods',
      badge: 'Live',
    },
  ];

  panes: HudPane[] = [
    {
      title: 'Settlement Status',
      subtitle: 'Lyonesse Enclave',
      highlights: [
        { label: 'Stability', value: 'Calm · +2.1%', accent: 'good' },
        { label: 'Stores', value: 'Grain 68% · Timber 44%' },
        { label: 'Build queue', value: 'Dockworks (02:14)', accent: 'warn' },
      ],
    },
    {
      title: 'Logistics & Intel',
      subtitle: 'Harbor Watch',
      highlights: [
        { label: 'Convoys', value: '3 en route · 1 in harbor', accent: 'good' },
        { label: 'Weather risk', value: 'Low squalls · 6h', accent: 'warn' },
        { label: 'Signals', value: 'Ledger synced · No alerts' },
      ],
    },
  ];
}
