import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kitchen-sink',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <h1>Interface preview</h1>
      <p>A future playground for UI elements will live here.</p>
    </section>
  `,
  styles: [
    `
      .page {
        padding: 24px;
        color: #e7d9ff;
        background: radial-gradient(circle at 75% 15%, #241840, #0b0818 60%);
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
export class KitchenSinkComponent {}
