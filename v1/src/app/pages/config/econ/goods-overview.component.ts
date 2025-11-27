import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-goods-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <h1>Goods overview</h1>
      <p>Economy data will be summarized in this view.</p>
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
      h1 {
        margin: 0 0 8px;
        font-size: 22px;
      }
      p {
        margin: 0;
        opacity: 0.85;
      }
    `,
  ],
})
export class GoodsOverviewComponent {}
