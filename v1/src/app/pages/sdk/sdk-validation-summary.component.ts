import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { IssueSeverity } from '../../models/tech-tree.models';

export interface SdkValidationNotice {
  path: string;
  message: string;
  severity: IssueSeverity;
}

@Component({
  selector: 'app-sdk-validation-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="validation-summary" *ngIf="notices?.length" role="status" aria-live="polite">
      <header class="summary-header">
        <div>
          <p class="eyebrow">{{ title }}</p>
          <p class="lede">Deterministic notices consumed from validation services.</p>
        </div>
        <div class="counts">
          <span class="pill error" *ngIf="count('error') > 0">{{ count('error') }} errors</span>
          <span class="pill warning" *ngIf="count('warning') > 0">{{ count('warning') }} warnings</span>
        </div>
      </header>

      <ul>
        <li *ngFor="let notice of notices">
          <span class="pill" [class.error]="notice.severity === 'error'" [class.warning]="notice.severity === 'warning'">
            {{ notice.severity }}
          </span>
          <div>
            <p class="path">{{ notice.path }}</p>
            <p class="message">{{ notice.message }}</p>
          </div>
        </li>
      </ul>
    </section>
  `,
  styles: [`
    .validation-summary {
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.03);
      padding: 10px;
      display: grid;
      gap: 8px;
    }

    .summary-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 0;
      opacity: 0.72;
      font-size: 11px;
    }

    .lede {
      margin: 2px 0 0;
      opacity: 0.75;
      font-size: 13px;
    }

    .counts {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 6px;
    }

    li {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 8px;
      align-items: start;
      padding: 8px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.02);
    }

    .pill {
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-size: 11px;
      padding: 4px 6px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.05);
    }

    .pill.error {
      border-color: rgba(255, 102, 102, 0.5);
      background: rgba(255, 102, 102, 0.12);
    }

    .pill.warning {
      border-color: rgba(255, 187, 102, 0.6);
      background: rgba(255, 187, 102, 0.14);
    }

    .path {
      margin: 0;
      font-family: 'Fira Code', monospace;
      opacity: 0.78;
      font-size: 12px;
    }

    .message {
      margin: 2px 0 0;
      opacity: 0.9;
      line-height: 1.4;
    }
  `],
})
export class SdkValidationSummaryComponent {
  @Input() title = 'Validation';
  @Input() notices: SdkValidationNotice[] = [];

  count(severity: IssueSeverity): number {
    return this.notices.filter((notice) => notice.severity === severity).length;
  }
}
