import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type TerrainToken = 'sea' | 'shore' | 'land' | 'town' | 'fleet' | 'trade';

type HudButtonState = 'ready' | 'cooldown' | 'disabled';

type InfoTone = 'safe' | 'warn' | 'alert' | 'muted';

interface HudButton {
  label: string;
  hint: string;
  state?: HudButtonState;
}

interface InfoLine {
  label: string;
  value: string;
  tone?: InfoTone;
}

interface InfoPanel {
  title: string;
  lines: InfoLine[];
}

@Component({
  selector: 'app-bottom-hud',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hud-page">
      <header class="page__header">
        <p class="eyebrow">HUD → Gameplay shell</p>
        <h1>Bottom HUD instrument</h1>
        <p class="lede">
          Anchored, restrained control strip aligned to the UI charter. The world stays
          central; the HUD is an instrument bar that surfaces access without inventing
          state.
        </p>
      </header>

      <div class="world-frame">
        <div class="world-canvas" aria-label="Mock world surface">
          <div class="world-canvas__watermark">World stays primary</div>
          <div class="world-canvas__grid">
            <div class="grid-line" *ngFor="let _ of gridLines"></div>
          </div>
        </div>

        <footer class="hud" aria-label="Bottom HUD">
          <section class="hud__panel hud__panel--left" aria-labelledby="minimap-label">
            <header class="panel__header">
              <p id="minimap-label" class="panel__eyebrow">Local orientation</p>
              <p class="panel__title">North bay estuary · 0,0</p>
            </header>
            <div class="minimap" role="img" aria-label="6 by 6 minimap">
              <div class="minimap__row" *ngFor="let row of minimap">
                <span
                  *ngFor="let cell of row"
                  class="minimap__cell minimap__cell--{{ cell }}"
                ></span>
              </div>
            </div>
            <div class="minimap__legend" aria-hidden="true">
              <span class="legend-dot legend-dot--sea"></span> Sea
              <span class="legend-dot legend-dot--shore"></span> Shoreline
              <span class="legend-dot legend-dot--land"></span> Land
              <span class="legend-dot legend-dot--town"></span> Harbor
              <span class="legend-dot legend-dot--fleet"></span> Fleet
              <span class="legend-dot legend-dot--trade"></span> Trade lane
            </div>
          </section>

          <section class="hud__panel hud__panel--center" aria-labelledby="action-grid-label">
            <header class="panel__header">
              <p id="action-grid-label" class="panel__eyebrow">Operational console</p>
              <p class="panel__title">Stable 2×4 action grid</p>
            </header>
            <div class="button-grid" role="group" aria-label="Action buttons">
              <button
                *ngFor="let button of buttons"
                class="hud-button hud-button--{{ button.state ?? 'ready' }}"
                type="button"
                [attr.aria-label]="button.label + ': ' + button.hint"
              >
                <span class="hud-button__label">{{ button.label }}</span>
                <span class="hud-button__hint">{{ button.hint }}</span>
              </button>
            </div>
          </section>

          <section class="hud__panel hud__panel--right" aria-label="Status and queues">
            <article class="info-card" *ngFor="let panel of infoPanels">
              <header class="info-card__header">
                <p class="panel__eyebrow">{{ panel.title }}</p>
                <div class="divider"></div>
              </header>
              <dl class="info-card__list">
                <div class="info-line" *ngFor="let line of panel.lines">
                  <dt class="info-line__label">{{ line.label }}</dt>
                  <dd class="info-line__value info-line__value--{{ line.tone ?? 'muted' }}">
                    {{ line.value }}
                  </dd>
                </div>
              </dl>
            </article>
          </section>
        </footer>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        color: #f3e9ff;
      }

      .hud-page {
        min-height: calc(100vh - 48px);
        background: radial-gradient(circle at 70% 20%, #1d1533, #0a0615 60%);
        padding: 24px 24px 32px;
        box-sizing: border-box;
      }

      .page__header {
        max-width: 900px;
        margin: 0 auto 16px;
        text-align: center;
      }

      .eyebrow,
      .panel__eyebrow {
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 11px;
        opacity: 0.75;
        margin: 0 0 4px;
      }

      h1 {
        margin: 0 0 6px;
        font-size: 26px;
        font-weight: 700;
      }

      .lede {
        margin: 0 auto;
        max-width: 720px;
        color: #c9b6e8;
      }

      .world-frame {
        position: relative;
        max-width: 1200px;
        margin: 0 auto;
        background: #0e0a17;
        border: 2px solid #241832;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35), inset 0 0 0 1px #3a2b4a;
        border-radius: 10px;
        overflow: hidden;
        padding-bottom: 196px;
      }

      .world-canvas {
        position: relative;
        min-height: 420px;
        background: linear-gradient(180deg, #101424 0%, #0a0f1c 40%, #0b0818 100%);
        overflow: hidden;
      }

      .world-canvas__watermark {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.18);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        pointer-events: none;
      }

      .world-canvas__grid {
        position: absolute;
        inset: 0;
        display: grid;
        grid-template-rows: repeat(6, 1fr);
        grid-template-columns: repeat(8, 1fr);
        gap: 1px;
        opacity: 0.35;
      }

      .grid-line {
        background: rgba(134, 112, 164, 0.2);
      }

      .hud {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        display: grid;
        grid-template-columns: 1fr 1.25fr 1fr;
        gap: 12px;
        padding: 14px 16px 16px;
        background: #0b0818e6;
        border-top: 2px solid #2c1f3a;
        box-shadow: 0 -6px 28px rgba(0, 0, 0, 0.45);
      }

      .hud__panel {
        background: linear-gradient(180deg, #191229 0%, #120d1f 100%);
        border: 1px solid #2f2240;
        border-radius: 8px;
        padding: 10px 12px 12px;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02), 0 8px 18px rgba(0, 0, 0, 0.35);
      }

      .hud__panel--left {
        display: grid;
        grid-template-rows: auto 1fr auto;
      }

      .hud__panel--center {
        display: grid;
        grid-template-rows: auto 1fr;
      }

      .hud__panel--right {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .panel__header {
        margin-bottom: 8px;
      }

      .panel__title {
        margin: 0;
        font-size: 14px;
        color: #f3e9ff;
      }

      .minimap {
        display: grid;
        grid-auto-rows: 1fr;
        gap: 2px;
        background: #0c0a16;
        border: 1px solid #31233f;
        padding: 4px;
        border-radius: 6px;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
        aspect-ratio: 1 / 1;
      }

      .minimap__row {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 2px;
      }

      .minimap__cell {
        width: 100%;
        border-radius: 3px;
      }

      .minimap__cell--sea { background: #0c496f; }
      .minimap__cell--shore { background: #2c6a7c; }
      .minimap__cell--land { background: #3d7d48; }
      .minimap__cell--town { background: linear-gradient(135deg, #dfb35a, #a37130); }
      .minimap__cell--fleet { background: linear-gradient(135deg, #65a6ff, #1f6dcc); }
      .minimap__cell--trade { background: repeating-linear-gradient(45deg, #6f4e8b 0 4px, #4f3465 4px 8px); }

      .minimap__legend {
        margin-top: 8px;
        font-size: 12px;
        display: grid;
        grid-template-columns: repeat(3, auto);
        gap: 6px 10px;
        align-items: center;
        color: #bfa8d8;
      }

      .legend-dot {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 3px;
        margin-right: 6px;
      }

      .legend-dot--sea { background: #0c496f; }
      .legend-dot--shore { background: #2c6a7c; }
      .legend-dot--land { background: #3d7d48; }
      .legend-dot--town { background: linear-gradient(135deg, #dfb35a, #a37130); }
      .legend-dot--fleet { background: linear-gradient(135deg, #65a6ff, #1f6dcc); }
      .legend-dot--trade { background: repeating-linear-gradient(45deg, #6f4e8b 0 4px, #4f3465 4px 8px); }

      .button-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 8px;
      }

      .hud-button {
        background: linear-gradient(180deg, #211732 0%, #160f24 100%);
        border: 1px solid #3a2b4a;
        border-radius: 8px;
        padding: 8px 10px;
        color: #f3e9ff;
        text-align: left;
        font-size: 13px;
        display: grid;
        grid-template-rows: auto auto;
        gap: 4px;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03), 0 4px 10px rgba(0, 0, 0, 0.35);
        cursor: pointer;
        transition: transform 60ms ease, border-color 60ms ease;
      }

      .hud-button:hover { transform: translateY(-1px); }
      .hud-button:active { transform: translateY(0); }

      .hud-button__label { font-weight: 700; letter-spacing: 0.01em; }
      .hud-button__hint { color: #bfa8d8; font-size: 12px; }

      .hud-button--ready { border-color: #4f3a64; }
      .hud-button--cooldown { border-color: #5c3e2e; color: #e0c3a0; }
      .hud-button--cooldown .hud-button__hint { color: #caa178; }
      .hud-button--disabled {
        border-color: #2e2438;
        color: #8b789f;
        cursor: not-allowed;
        background: #120c1c;
      }

      .info-card {
        background: linear-gradient(180deg, #1c142b 0%, #130d20 100%);
        border: 1px solid #332644;
        border-radius: 8px;
        padding: 8px 10px 10px;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
      }

      .info-card__header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .divider {
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg, transparent, #3f2f55, transparent);
        opacity: 0.8;
      }

      .info-card__list {
        margin: 0;
      }

      .info-line {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 6px;
        padding: 6px 4px;
        border-radius: 6px;
      }

      .info-line:nth-child(odd) {
        background: rgba(255, 255, 255, 0.02);
      }

      .info-line__label {
        margin: 0;
        color: #bfa8d8;
        font-size: 12px;
      }

      .info-line__value {
        margin: 0;
        font-weight: 700;
        font-size: 13px;
      }

      .info-line__value--safe { color: #7cd78a; }
      .info-line__value--warn { color: #e0c27e; }
      .info-line__value--alert { color: #f68a8a; }
      .info-line__value--muted { color: #d8c8f1; }

      @media (max-width: 1024px) {
        .hud {
          grid-template-columns: 1fr;
          grid-template-rows: auto auto auto;
          padding: 12px;
        }

        .world-frame {
          padding-bottom: 540px;
        }

        .hud__panel--right {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class BottomHudComponent {
  minimap: TerrainToken[][] = [
    ['sea', 'sea', 'shore', 'land', 'land', 'land'],
    ['sea', 'sea', 'shore', 'land', 'town', 'land'],
    ['sea', 'shore', 'shore', 'trade', 'trade', 'trade'],
    ['shore', 'shore', 'land', 'land', 'fleet', 'land'],
    ['shore', 'land', 'land', 'land', 'land', 'land'],
    ['sea', 'sea', 'shore', 'land', 'land', 'land'],
  ];

  buttons: HudButton[] = [
    { label: 'Ledger', hint: 'Open event stream', state: 'ready' },
    { label: 'Convoys', hint: 'Assign routes', state: 'ready' },
    { label: 'Settlements', hint: 'Visit charter board', state: 'ready' },
    { label: 'Markets', hint: 'Price signals & bids', state: 'ready' },
    { label: 'Diplomacy', hint: 'Guild & nation stances', state: 'cooldown' },
    { label: 'Reports', hint: 'Status digest', state: 'ready' },
    { label: 'Map layers', hint: 'Toggle overlays', state: 'ready' },
    { label: 'Pause', hint: 'Hold simulation', state: 'disabled' },
  ];

  infoPanels: InfoPanel[] = [
    {
      title: 'Situation',
      lines: [
        { label: 'Weather band', value: 'Clear · steady winds', tone: 'safe' },
        { label: 'Supply pressure', value: 'Balanced', tone: 'safe' },
        { label: 'Navigation risk', value: 'Shallows east (2.3m)', tone: 'warn' },
        { label: 'Conflict signals', value: 'Quiet', tone: 'safe' },
      ],
    },
    {
      title: 'Queues & alerts',
      lines: [
        { label: 'Convoy cycle', value: 'Docking · 12s', tone: 'warn' },
        { label: 'Ledger sync', value: 'Clean', tone: 'safe' },
        { label: 'Trade lane', value: 'Low saturation', tone: 'muted' },
        { label: 'Crew morale', value: 'Holding at 82%', tone: 'safe' },
      ],
    },
  ];

  gridLines = Array.from({ length: 48 });
}
