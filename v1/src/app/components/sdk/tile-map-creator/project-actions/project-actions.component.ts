import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { TilemapProject } from '../../../../services/mk2/tools/tilemap-analysis.service';

@Component({
  selector: 'app-project-actions',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <div class="project-actions">
      <div class="action-group">
        <button mat-button 
                (click)="loadProject.emit()" 
                matTooltip="Load Project">
          <mat-icon>folder_open</mat-icon>
          Load
        </button>
        
        <button mat-button 
                (click)="saveProject.emit()" 
                [disabled]="!currentProject"
                matTooltip="Save Project">
          <mat-icon>save</mat-icon>
          Save
        </button>
      </div>

      <div class="action-group">
        <button mat-button 
                (click)="exportPalette.emit()" 
                [disabled]="!currentProject"
                matTooltip="Export for Tile Placement Tool">
          <mat-icon>file_download</mat-icon>
          Export Palette
        </button>
        
        <button mat-button 
                [matMenuTriggerFor]="moreMenu"
                [disabled]="!currentProject"
                matTooltip="More Actions">
          <mat-icon>more_vert</mat-icon>
        </button>
      </div>

      <div class="action-group">
        <button mat-button 
                (click)="close.emit()" 
                matTooltip="Close Tool">
          <mat-icon>close</mat-icon>
          Close
        </button>
      </div>
    </div>

    <mat-menu #moreMenu="matMenu">
      <button mat-menu-item (click)="duplicateProject.emit()">
        <mat-icon>content_copy</mat-icon>
        <span>Duplicate Project</span>
      </button>
      
      <button mat-menu-item (click)="exportJson.emit()">
        <mat-icon>code</mat-icon>
        <span>Export as JSON</span>
      </button>
      
      <button mat-menu-item (click)="showProjectInfo.emit()">
        <mat-icon>info</mat-icon>
        <span>Project Info</span>
      </button>
      
      <mat-divider></mat-divider>
      
      <button mat-menu-item (click)="resetProject.emit()" color="warn">
        <mat-icon>refresh</mat-icon>
        <span>Reset Project</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .project-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 16px;
      background: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;
    }

    .action-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .action-group:not(:last-child) {
      border-right: 1px solid #e0e0e0;
      padding-right: 16px;
    }

    button[mat-button] {
      min-width: auto;
      padding: 0 12px;
    }

    button[disabled] {
      opacity: 0.5;
    }

    mat-icon {
      margin-right: 4px;
    }

    .project-actions button:hover:not([disabled]) {
      background: rgba(0, 0, 0, 0.04);
    }
  `]
})
export class ProjectActionsComponent {
  @Input() currentProject: TilemapProject | null = null;
  
  @Output() loadProject = new EventEmitter<void>();
  @Output() saveProject = new EventEmitter<void>();
  @Output() exportPalette = new EventEmitter<void>();
  @Output() duplicateProject = new EventEmitter<void>();
  @Output() exportJson = new EventEmitter<void>();
  @Output() showProjectInfo = new EventEmitter<void>();
  @Output() resetProject = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
}
