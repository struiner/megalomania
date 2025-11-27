import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kirby-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <h1>Work in progress</h1>
      <p>This view is not implemented yet, but the route is wired.</p>
    </section>
  `,
  styles: [
    `
      .page {
        padding: 24px;
        color: #e7d9ff;
        background: radial-gradient(circle at 20% 20%, #1f1538, #0c0818 60%);
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
export class KirbyComponent {}
