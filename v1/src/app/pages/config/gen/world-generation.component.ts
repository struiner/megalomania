import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignDocService } from '../../../services/design/design-doc.service';
import { WorldGenerationSection } from '../../../models/design-doc.models';

@Component({
  selector: 'app-world-generation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <header>
        <p class="eyebrow">Worldgen pipeline</p>
        <h1>Procedural enclave builder</h1>
        <p class="lede">{{ worldgen.regionDescription }}</p>
      </header>

      <section class="cards">
        <article class="card">
          <h2>Pipeline steps</h2>
          <ol>
            <li *ngFor="let step of worldgen.pipelineSteps">{{ step }}</li>
          </ol>
        </article>

        <article class="card">
          <h2>Settlement founding waves</h2>
          <div class="waves">
            <div class="wave" *ngFor="let wave of worldgen.settlementWaves">
              <header>
                <h3>{{ wave.name }}</h3>
                <p>{{ wave.focus }}</p>
              </header>
              <dl>
                <ng-container *ngFor="let entry of wave.weights | keyvalue">
                  <div>
                    <dt>{{ entry.key }}</dt>
                    <dd>{{ entry.value }}</dd>
                  </div>
                </ng-container>
              </dl>
            </div>
          </div>
        </article>

        <article class="card">
          <h2>History simulation</h2>
          <p class="lede">Run length: {{ worldgen.enclaveHistoryYears[0] }}–{{ worldgen.enclaveHistoryYears[1] }} years.</p>
          <ul>
            <li>Population growth, trade networks, and famine/war resolution.</li>
            <li>Tribal raids, magical anomalies, and settlement merges or failures.</li>
            <li>Outputs a Genesis Chain hash for player onboarding.</li>
          </ul>
        </article>
      </section>
    </section>
  `,
  styles: [
    `
      .page {
        padding: 24px;
        color: #e7d9ff;
        background: radial-gradient(circle at 50% 10%, #1b1232, #0a0616 60%);
        min-height: calc(100vh - 48px);
      }
      header {
        margin-bottom: 14px;
      }
      .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #c39aff;
        margin: 0 0 4px;
      }
      h1 {
        margin: 0 0 8px;
        font-size: 24px;
      }
      .lede {
        margin: 0;
        opacity: 0.9;
      }
      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 12px;
      }
      .card {
        background: rgba(14, 10, 22, 0.92);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        padding: 16px;
        box-shadow: 0 14px 32px rgba(0, 0, 0, 0.35);
      }
      .card h2 {
        margin: 0 0 6px;
      }
      .card ol {
        margin: 0;
        padding-left: 20px;
        display: grid;
        gap: 6px;
      }
      .waves {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 10px;
      }
      .wave {
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 10px;
        background: linear-gradient(180deg, rgba(124, 101, 255, 0.12), rgba(255, 255, 255, 0.02));
      }
      .wave h3 {
        margin: 0;
      }
      .wave p {
        margin: 0 0 6px;
        opacity: 0.85;
      }
      dl {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 6px;
      }
      dt {
        font-weight: 600;
      }
      dd {
        margin: 0;
        opacity: 0.85;
      }
      ul {
        padding-left: 18px;
        margin: 0;
        display: grid;
        gap: 4px;
      }
    `,
  ],
})
export class WorldGenerationComponent {
  private readonly designDoc = inject(DesignDocService);
  readonly worldgen: WorldGenerationSection = this.designDoc.getDocument().worldgen;
}
