import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-city-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <h1>City production</h1>
      <p>A future settlement production view will render here.</p>
    </section>
  `,
  styles: [
    `
      .page {
        padding: 24px;
        color: #e7d9ff;
        background: radial-gradient(circle at 35% 0%, #221738, #0b0616 60%);
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
export class CityWrapperComponent {}
