import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

export interface TilemapConfigData {
  name: string;
  description: string;
  tileWidth: number;
  tileHeight: number;
  marginX: number;
  marginY: number;
  spacingX: number;
  spacingY: number;
  autoDetectSettings: boolean;
  exportFormat: string;
}

@Component({
  selector: 'app-tilemap-config',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  template: `
    <mat-card class="config-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>settings</mat-icon>
          Tilemap Configuration
        </mat-card-title>
        <mat-card-subtitle>Configure how to extract tiles from your spritesheet</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="config-form">
          <!-- Basic Info -->
          <div class="form-section">
            <h4>Basic Information</h4>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Project Name</mat-label>
                <input matInput [(ngModel)]="config.name" placeholder="My Tilemap">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Export Format</mat-label>
                <mat-select [(ngModel)]="config.exportFormat">
                  <mat-option value="tile-placement-tool">Tile Placement Tool</mat-option>
                  <mat-option value="json">Generic JSON</mat-option>
                  <mat-option value="csv">CSV Format</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput [(ngModel)]="config.description" rows="2" 
                        placeholder="Describe your tilemap..."></textarea>
            </mat-form-field>
          </div>

          <!-- Tile Dimensions -->
          <div class="form-section">
            <h4>Tile Dimensions</h4>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Tile Width (px)</mat-label>
                <input matInput type="number" [(ngModel)]="config.tileWidth" 
                       min="1" max="256" (ngModelChange)="onConfigChange()">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Tile Height (px)</mat-label>
                <input matInput type="number" [(ngModel)]="config.tileHeight" 
                       min="1" max="256" (ngModelChange)="onConfigChange()">
              </mat-form-field>
            </div>

            <div class="preset-buttons">
              <button mat-button (click)="setPreset(16, 16)">16×16</button>
              <button mat-button (click)="setPreset(32, 32)">32×32</button>
              <button mat-button (click)="setPreset(64, 64)">64×64</button>
              <button mat-button (click)="setPreset(16, 24)">16×24</button>
            </div>
          </div>

          <!-- Margins and Spacing -->
          <div class="form-section">
            <h4>Margins & Spacing</h4>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Margin X (px)</mat-label>
                <input matInput type="number" [(ngModel)]="config.marginX" 
                       min="0" max="100" (ngModelChange)="onConfigChange()">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Margin Y (px)</mat-label>
                <input matInput type="number" [(ngModel)]="config.marginY" 
                       min="0" max="100" (ngModelChange)="onConfigChange()">
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Spacing X (px)</mat-label>
                <input matInput type="number" [(ngModel)]="config.spacingX" 
                       min="0" max="50" (ngModelChange)="onConfigChange()">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Spacing Y (px)</mat-label>
                <input matInput type="number" [(ngModel)]="config.spacingY" 
                       min="0" max="50" (ngModelChange)="onConfigChange()">
              </mat-form-field>
            </div>
          </div>

          <!-- Advanced Options -->
          <div class="form-section">
            <h4>Advanced Options</h4>
            <mat-checkbox [(ngModel)]="config.autoDetectSettings" 
                          (ngModelChange)="onConfigChange()">
              Auto-detect tile settings from image
            </mat-checkbox>
          </div>

          <!-- Preview Info -->
          <div class="form-section" *ngIf="imageInfo">
            <h4>Image Information</h4>
            <div class="image-info">
              <p><strong>Dimensions:</strong> {{ imageInfo.width }} × {{ imageInfo.height }} pixels</p>
              <p><strong>Estimated Tiles:</strong> {{ getEstimatedTileCount() }} tiles</p>
              <p><strong>Grid Size:</strong> {{ getGridDimensions().cols }} × {{ getGridDimensions().rows }}</p>
            </div>
          </div>
        </div>
      </mat-card-content>

      <mat-card-actions>
        <button mat-raised-button color="primary" 
                (click)="onAnalyze()" 
                [disabled]="!isValidConfig()">
          <mat-icon>analytics</mat-icon>
          Analyze Spritesheet
        </button>
        
        <button mat-button (click)="onReset()">
          <mat-icon>refresh</mat-icon>
          Reset to Defaults
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .config-card {
      margin: 16px 0;
    }

    .config-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .form-section h4 {
      margin: 0;
      color: #666;
      font-size: 14px;
      font-weight: 500;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 4px;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    .full-width {
      width: 100%;
    }

    .preset-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .preset-buttons button {
      min-width: 60px;
    }

    .image-info {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
      font-size: 14px;
    }

    .image-info p {
      margin: 4px 0;
    }

    mat-card-actions {
      display: flex;
      gap: 12px;
    }
  `]
})
export class TilemapConfigComponent {
  @Input() imageInfo: { width: number; height: number } | null = null;
  @Output() configChange = new EventEmitter<TilemapConfigData>();
  @Output() analyze = new EventEmitter<TilemapConfigData>();
  @Output() reset = new EventEmitter<void>();

  config: TilemapConfigData = {
    name: 'My Tilemap',
    description: '',
    tileWidth: 16,
    tileHeight: 16,
    marginX: 0,
    marginY: 0,
    spacingX: 0,
    spacingY: 0,
    autoDetectSettings: false,
    exportFormat: 'tile-placement-tool'
  };

  setPreset(width: number, height: number): void {
    this.config.tileWidth = width;
    this.config.tileHeight = height;
    this.onConfigChange();
  }

  onConfigChange(): void {
    this.configChange.emit({ ...this.config });
  }

  onAnalyze(): void {
    this.analyze.emit({ ...this.config });
  }

  onReset(): void {
    this.config = {
      name: 'My Tilemap',
      description: '',
      tileWidth: 16,
      tileHeight: 16,
      marginX: 0,
      marginY: 0,
      spacingX: 0,
      spacingY: 0,
      autoDetectSettings: false,
      exportFormat: 'tile-placement-tool'
    };
    this.reset.emit();
    this.onConfigChange();
  }

  isValidConfig(): boolean {
    return this.config.tileWidth > 0 && 
           this.config.tileHeight > 0 && 
           this.config.name.trim().length > 0;
  }

  getEstimatedTileCount(): number {
    if (!this.imageInfo) return 0;
    
    const cols = Math.floor((this.imageInfo.width - this.config.marginX * 2 + this.config.spacingX) / 
                           (this.config.tileWidth + this.config.spacingX));
    const rows = Math.floor((this.imageInfo.height - this.config.marginY * 2 + this.config.spacingY) / 
                           (this.config.tileHeight + this.config.spacingY));
    
    return Math.max(0, cols * rows);
  }

  getGridDimensions(): { cols: number; rows: number } {
    if (!this.imageInfo) return { cols: 0, rows: 0 };
    
    const cols = Math.floor((this.imageInfo.width - this.config.marginX * 2 + this.config.spacingX) / 
                           (this.config.tileWidth + this.config.spacingX));
    const rows = Math.floor((this.imageInfo.height - this.config.marginY * 2 + this.config.spacingY) / 
                           (this.config.tileHeight + this.config.spacingY));
    
    return { cols: Math.max(0, cols), rows: Math.max(0, rows) };
  }
}
