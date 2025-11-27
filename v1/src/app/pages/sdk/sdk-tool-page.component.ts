import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, Type, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface SdkRouteData {
  sdkComponent?: Type<unknown>;
  title?: string;
  description?: string;
}

@Component({
  selector: 'app-sdk-tool-page',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  template: `
    <section class="sdk-page">
      <header class="sdk-header">
        <div>
          <p class="eyebrow">SDK</p>
          <h1>{{ title() }}</h1>
          <p class="description" *ngIf="description()">{{ description() }}</p>
        </div>
      </header>

      <div class="sdk-host">
        <ng-container *ngIf="component(); else missing">
          <ng-container *ngComponentOutlet="component()"></ng-container>
        </ng-container>
        <ng-template #missing>
          <div class="placeholder">
            <p>No SDK tool was provided for this route.</p>
          </div>
        </ng-template>
      </div>
    </section>
  `,
  styles: [`
    .sdk-page {
      min-height: calc(100vh - 48px);
      background: radial-gradient(circle at 70% 0%, #201432, #0a0716 60%);
      color: #e8e0ff;
      padding: 24px;
      box-sizing: border-box;
    }

    .sdk-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 11px;
      opacity: 0.7;
      margin: 0 0 4px;
    }

    h1 {
      margin: 0;
      font-size: 24px;
      letter-spacing: 0.02em;
    }

    .description {
      margin: 4px 0 0;
      opacity: 0.8;
      max-width: 720px;
    }

    .sdk-host {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 16px;
      min-height: 360px;
      box-shadow: 0 10px 35px rgba(0, 0, 0, 0.35);
    }

    .placeholder {
      border: 1px dashed rgba(255, 255, 255, 0.3);
      padding: 32px;
      text-align: center;
      border-radius: 12px;
      opacity: 0.8;
    }
  `]
})
export class SdkToolPageComponent {
  private route = inject(ActivatedRoute);

  private data = computed(() => this.route.snapshot.data as SdkRouteData);

  component = computed(() => this.data().sdkComponent ?? null);
  title = computed(() => this.data().title ?? 'SDK Tool');
  description = computed(() => this.data().description ?? '');
}
