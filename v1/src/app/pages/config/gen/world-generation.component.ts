import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-world-generation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <h1>World generation</h1>
      <p>Stub view for configuring generation options.</p>
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
export class WorldGenerationComponent {}
