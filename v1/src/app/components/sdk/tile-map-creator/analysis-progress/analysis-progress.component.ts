import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-analysis-progress',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <mat-card class="analysis-progress-card" *ngIf="isAnalyzing">
      <mat-card-content>
        <div class="progress-content">
          <div class="progress-header">
            <mat-icon class="analyzing-icon">analytics</mat-icon>
            <h3>Analyzing Spritesheet</h3>
          </div>
          
          <div class="progress-details">
            <p>{{ getProgressMessage() }}</p>
            <mat-progress-bar 
              mode="determinate" 
              [value]="progress"
              class="progress-bar">
            </mat-progress-bar>
            <span class="progress-text">{{ progress }}%</span>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .analysis-progress-card {
      margin: 20px 0;
      background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
      border: 1px solid #2196f3;
    }

    .progress-content {
      text-align: center;
    }

    .progress-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .analyzing-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      color: #2196f3;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }

    h3 {
      margin: 0;
      color: #1976d2;
      font-weight: 500;
    }

    .progress-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .progress-bar {
      height: 8px;
      border-radius: 4px;
    }

    .progress-text {
      font-size: 12px;
      color: #666;
      font-weight: 500;
    }
  `]
})
export class AnalysisProgressComponent {
  @Input() isAnalyzing = false;
  @Input() progress = 0;

  getProgressMessage(): string {
    if (this.progress < 20) {
      return 'Loading image...';
    } else if (this.progress < 40) {
      return 'Detecting tiles...';
    } else if (this.progress < 60) {
      return 'Analyzing tile properties...';
    } else if (this.progress < 80) {
      return 'Generating metadata...';
    } else if (this.progress < 100) {
      return 'Finalizing analysis...';
    } else {
      return 'Analysis complete!';
    }
  }
}
