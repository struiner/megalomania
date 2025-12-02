import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DesignDocService } from '../../services/design/design-doc.service';

@Component({
  selector: 'app-design-document',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <header class="page__header">
        <div>
          <p class="eyebrow">Design reference</p>
          <h1>{{ doc.vision.title }}</h1>
          <p class="lede">{{ doc.vision.description }}</p>
        </div>
        <div class="pillars">
          <div class="pillar" *ngFor="let point of doc.vision.bulletPoints">
            {{ point }}
          </div>
        </div>
      </header>

      <section class="grid">
        <article class="card">
          <h2>Ledger Architecture</h2>
          <p class="card__lede">{{ doc.ledger.overview }}</p>
          <ul>
            <li *ngFor="let rule of doc.ledger.validationModel">{{ rule }}</li>
          </ul>
          <div class="pillars">
            <div class="pillar">{{ doc.ledger.merkleRules.leafRule }}</div>
            <div class="pillar">{{ doc.ledger.merkleRules.nodeRule }}</div>
            <div class="pillar">{{ doc.ledger.merkleRules.oddItemRule }}</div>
          </div>
          <div class="card__split">
            <div>
              <h3>EventHeader</h3>
              <ul>
                <li *ngFor="let field of doc.ledger.eventHeader">
                  <strong>{{ field.label }}</strong><span>{{ field.description }}</span>
                </li>
              </ul>
            </div>
            <div>
              <h3>BlockHeader</h3>
              <ul>
                <li *ngFor="let field of doc.ledger.blockHeader">
                  <strong>{{ field.label }}</strong><span>{{ field.description }}</span>
                </li>
              </ul>
            </div>
          </div>
        </article>

        <article class="card">
          <h2>World Generation</h2>
          <p class="card__lede">{{ doc.worldgen.regionDescription }}</p>
          <ol>
            <li *ngFor="let step of doc.worldgen.pipelineSteps">{{ step }}</li>
          </ol>
          <div class="chips">
            <span class="chip">History span: {{ doc.worldgen.enclaveHistoryYears[0] }}–{{ doc.worldgen.enclaveHistoryYears[1] }} years</span>
          </div>
        </article>

        <article class="card">
          <h2>Settlement Algorithm</h2>
          <p class="card__lede">{{ doc.settlementAlgorithm.description }}</p>
          <code class="code-block" *ngFor="let line of doc.settlementAlgorithm.formula">{{ line }}</code>
          <div class="weights">
            <div class="weight" *ngFor="let wave of doc.worldgen.settlementWaves">
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
          <h2>Tribes & Archetypes</h2>
          <div class="tribes">
            <div class="tribe" *ngFor="let tribe of doc.tribes">
              <header>
                <h3>{{ tribe.name }}</h3>
                <p>{{ tribe.description }}</p>
              </header>
              <ul>
                <li *ngFor="let pref of tribe.preferences">{{ pref }}</li>
              </ul>
              <p class="muted">{{ tribe.hostilityNote }}</p>
            </div>
          </div>
        </article>

        <article class="card">
          <h2>Goods Classification</h2>
          <div class="goods">
            <div class="good" *ngFor="let category of doc.goodsCategories">
              <header>
                <h3>{{ category.name }}</h3>
                <p>{{ category.summary }}</p>
              </header>
              <div class="chips">
                <span class="chip" *ngFor="let good of category.goods">{{ good }}</span>
              </div>
            </div>
          </div>
        </article>

        <article class="card">
          <h2>Historical Simulation</h2>
          <p class="card__lede">{{ doc.history.summary }}</p>
          <ul>
            <li *ngFor="let outcome of doc.history.outcomes">{{ outcome }}</li>
          </ul>
          <div class="chips">
            <span class="chip" *ngFor="let note of doc.history.genesisNotes">{{ note }}</span>
          </div>
        </article>

        <article class="card">
          <h2>API Contracts</h2>
          <div class="api" *ngFor="let contract of doc.apiContracts">
            <header>
              <h3>{{ contract.title }}</h3>
              <p>{{ contract.description }}</p>
            </header>
            <div class="card__split">
              <div>
                <h4>DTOs</h4>
                <div class="dto" *ngFor="let dto of contract.dtoExamples">
                  <strong>{{ dto.name }}</strong>
                  <ul>
                    <li *ngFor="let field of dto.fields">{{ field }}</li>
                  </ul>
                </div>
              </div>
              <div>
                <h4>Endpoints</h4>
                <ul class="endpoints">
                  <li *ngFor="let endpoint of contract.endpoints">
                    <code>{{ endpoint.method }}</code>
                    <span>{{ endpoint.path }}</span>
                    <small>→ {{ endpoint.returns }}</small>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </article>

        <article class="card">
          <h2>Roadmap</h2>
          <ul class="roadmap">
            <li *ngFor="let item of doc.roadmap" [class.roadmap__done]="item.done">
              <span class="status">{{ item.done ? '✔' : '⏳' }}</span>
              <div>
                <strong>{{ item.label }}</strong>
                <p>{{ item.details }}</p>
              </div>
            </li>
          </ul>
        </article>
      </section>
    </section>
  `,
  styles: [
    `
      .page {
        padding: 24px;
        background: radial-gradient(circle at 20% 0%, #1d1230, #06040f 60%);
        color: #e9defd;
        min-height: calc(100vh - 48px);
      }
      .page__header {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 16px;
        align-items: start;
        margin-bottom: 16px;
      }
      .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin: 0 0 4px;
        color: #caa3ff;
      }
      h1 {
        margin: 0 0 8px;
      }
      .lede {
        margin: 0;
        opacity: 0.85;
      }
      .pillars {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 8px;
      }
      .pillar {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 10px;
        padding: 10px 12px;
        font-size: 13px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 12px;
      }
      .card {
        background: rgba(12, 9, 20, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      }
      .card__lede {
        margin: 0;
        opacity: 0.9;
      }
      .card h2 {
        margin: 0;
      }
      .card h3,
      .card h4 {
        margin: 8px 0 4px;
      }
      .card ul {
        padding-left: 18px;
        margin: 0;
        opacity: 0.9;
        display: grid;
        gap: 4px;
      }
      .card__split {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
      }
      .card__split ul li {
        display: flex;
        gap: 8px;
        align-items: baseline;
      }
      .card__split ul strong {
        min-width: 120px;
        color: #e9defd;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .chip {
        background: rgba(255, 255, 255, 0.08);
        padding: 6px 10px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        font-size: 12px;
      }
      .weights {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
      }
      .weight {
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.02);
      }
      .weight header {
        margin-bottom: 6px;
      }
      .weight p {
        margin: 0;
        opacity: 0.8;
      }
      .weight dl {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 6px;
      }
      .weight dt {
        font-weight: 600;
      }
      .weight dd {
        margin: 0;
        opacity: 0.8;
      }
      .tribes {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 8px;
      }
      .tribe {
        padding: 10px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        background: rgba(255, 255, 255, 0.02);
      }
      .tribe h3 {
        margin: 0 0 4px;
      }
      .tribe p {
        margin: 0 0 6px;
        opacity: 0.85;
      }
      .muted {
        opacity: 0.7;
        font-size: 12px;
      }
      .goods {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 8px;
      }
      .good {
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 10px;
        padding: 10px;
        background: linear-gradient(140deg, rgba(110, 89, 255, 0.12), rgba(255, 255, 255, 0.02));
      }
      .good h3 {
        margin: 0 0 4px;
      }
      .good p {
        margin: 0 0 6px;
        opacity: 0.85;
      }
      .api {
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.03);
      }
      .dto ul,
      .endpoints {
        margin: 0;
        padding-left: 16px;
      }
      .endpoints li {
        display: grid;
        grid-template-columns: 60px 1fr;
        gap: 6px;
        align-items: baseline;
      }
      .endpoints code {
        background: rgba(255, 255, 255, 0.07);
        padding: 2px 6px;
        border-radius: 8px;
        color: #c0f7ff;
      }
      .endpoints small {
        opacity: 0.7;
      }
      .roadmap {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 6px;
      }
      .roadmap li {
        display: grid;
        grid-template-columns: 36px 1fr;
        align-items: start;
        gap: 8px;
        padding: 8px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.02);
      }
      .roadmap__done {
        border-color: rgba(116, 255, 182, 0.6);
      }
      .status {
        font-size: 20px;
      }
      .code-block {
        display: block;
        padding: 8px;
        background: rgba(0, 0, 0, 0.35);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        margin: 4px 0;
        font-family: 'Fira Code', 'Cascadia Code', monospace;
        color: #a6f7ff;
      }
    `,
  ],
})
export class DesignDocumentComponent {
  private readonly designDocService = inject(DesignDocService);
  readonly doc = this.designDocService.getDocument();
}
