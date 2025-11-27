import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { TilemapProject } from '../../../services/mk2/tools/tilemap-analysis.service';

@Component({
  selector: 'app-project-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <mat-card class="project-management-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>folder</mat-icon>
          Project Management
        </mat-card-title>
        <mat-card-subtitle>Load, save, and manage your tilemap projects</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <!-- Current Project Info -->
        <div class="current-project" *ngIf="currentProject">
          <h4>Current Project</h4>
          <div class="project-info">
            <div class="project-details">
              <p><strong>{{ currentProject.config.name }}</strong></p>
              <p class="project-description">{{ currentProject.config.description || 'No description' }}</p>
              <div class="project-stats">
                <span class="stat">{{ currentProject.tiles.length }} tiles</span>
                <span class="stat">{{ currentProject.categories.length }} categories</span>
                <span class="stat">{{ getProjectSize() }}</span>
              </div>
            </div>
            <div class="project-actions">
              <button mat-icon-button (click)="onSaveProject()" matTooltip="Save Project">
                <mat-icon>save</mat-icon>
              </button>
              <button mat-icon-button (click)="onExportProject()" matTooltip="Export Project">
                <mat-icon>file_download</mat-icon>
              </button>
              <button mat-icon-button (click)="onDuplicateProject()" matTooltip="Duplicate Project">
                <mat-icon>content_copy</mat-icon>
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Projects -->
        <div class="recent-projects">
          <h4>Recent Projects</h4>
          <mat-list *ngIf="recentProjects.length > 0; else noProjects">
            <mat-list-item *ngFor="let project of recentProjects" class="project-item">
              <mat-icon matListItemIcon>description</mat-icon>
              <div matListItemTitle>{{ project.name }}</div>
              <div matListItemLine>{{ project.description || 'No description' }}</div>
              <div matListItemLine class="project-meta">
                {{ project.tiles }} tiles • {{ formatDate(project.modified) }}
              </div>
              <div class="project-item-actions">
                <button mat-icon-button (click)="onLoadProject(project)" matTooltip="Load Project">
                  <mat-icon>folder_open</mat-icon>
                </button>
                <button mat-icon-button (click)="onDeleteProject(project)" matTooltip="Delete Project">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </mat-list-item>
          </mat-list>

          <ng-template #noProjects>
            <div class="no-projects">
              <mat-icon>folder_open</mat-icon>
              <p>No recent projects found</p>
              <p class="hint">Create a new project by uploading a spritesheet</p>
            </div>
          </ng-template>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h4>Quick Actions</h4>
          <div class="action-buttons">
            <button mat-raised-button (click)="onNewProject()">
              <mat-icon>add</mat-icon>
              New Project
            </button>
            
            <button mat-raised-button (click)="onImportProject()">
              <mat-icon>file_upload</mat-icon>
              Import Project
            </button>
            
            <button mat-raised-button (click)="onLoadExample()">
              <mat-icon>auto_stories</mat-icon>
              Load Example
            </button>
          </div>
        </div>

        <!-- Export Options -->
        <div class="export-options" *ngIf="currentProject">
          <h4>Export Options</h4>
          <div class="export-buttons">
            <button mat-button (click)="onExportForTilePlacement()">
              <mat-icon>grid_on</mat-icon>
              For Tile Placement Tool
            </button>
            
            <button mat-button (click)="onExportAsJson()">
              <mat-icon>code</mat-icon>
              As JSON
            </button>
            
            <button mat-button (click)="onExportAsCsv()">
              <mat-icon>table_chart</mat-icon>
              As CSV
            </button>
            
            <button mat-button (click)="onExportSpritesheet()">
              <mat-icon>image</mat-icon>
              Export Spritesheet
            </button>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .project-management-card {
      margin: 16px 0;
    }

    .current-project {
      margin-bottom: 24px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .project-info {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .project-details {
      flex: 1;
    }

    .project-details p {
      margin: 4px 0;
    }

    .project-description {
      color: #666;
      font-size: 14px;
    }

    .project-stats {
      display: flex;
      gap: 16px;
      margin-top: 8px;
    }

    .stat {
      font-size: 12px;
      color: #666;
      background: #e9ecef;
      padding: 4px 8px;
      border-radius: 12px;
    }

    .project-actions {
      display: flex;
      gap: 4px;
    }

    .recent-projects {
      margin-bottom: 24px;
    }

    .project-item {
      border-bottom: 1px solid #e0e0e0;
    }

    .project-item:last-child {
      border-bottom: none;
    }

    .project-meta {
      font-size: 12px;
      color: #666;
    }

    .project-item-actions {
      display: flex;
      gap: 4px;
    }

    .no-projects {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .no-projects mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      opacity: 0.5;
      margin-bottom: 16px;
    }

    .no-projects p {
      margin: 8px 0;
    }

    .hint {
      font-size: 14px;
      font-style: italic;
    }

    .quick-actions, .export-options {
      margin-bottom: 24px;
    }

    .quick-actions h4, .export-options h4, .recent-projects h4 {
      margin: 0 0 12px 0;
      color: #333;
      font-size: 16px;
      font-weight: 500;
    }

    .action-buttons, .export-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .action-buttons button, .export-buttons button {
      min-width: 120px;
    }
  `]
})
export class ProjectManagementComponent {
  @Input() currentProject: TilemapProject | null = null;
  @Input() recentProjects: any[] = [];

  @Output() newProject = new EventEmitter<void>();
  @Output() loadProject = new EventEmitter<any>();
  @Output() saveProject = new EventEmitter<void>();
  @Output() importProject = new EventEmitter<void>();
  @Output() exportProject = new EventEmitter<string>();
  @Output() duplicateProject = new EventEmitter<void>();
  @Output() deleteProject = new EventEmitter<any>();
  @Output() loadExample = new EventEmitter<void>();

  constructor(private dialog: MatDialog) {}

  onNewProject(): void {
    this.newProject.emit();
  }

  onLoadProject(project: any): void {
    this.loadProject.emit(project);
  }

  onSaveProject(): void {
    this.saveProject.emit();
  }

  onImportProject(): void {
    this.importProject.emit();
  }

  onExportProject(): void {
    this.exportProject.emit('json');
  }

  onDuplicateProject(): void {
    this.duplicateProject.emit();
  }

  onDeleteProject(project: any): void {
    this.deleteProject.emit(project);
  }

  onLoadExample(): void {
    this.loadExample.emit();
  }

  onExportForTilePlacement(): void {
    this.exportProject.emit('tile-placement-tool');
  }

  onExportAsJson(): void {
    this.exportProject.emit('json');
  }

  onExportAsCsv(): void {
    this.exportProject.emit('csv');
  }

  onExportSpritesheet(): void {
    this.exportProject.emit('spritesheet');
  }

  getProjectSize(): string {
    if (!this.currentProject) return '';
    
    const config = this.currentProject.config;
    return `${config.imageWidth}×${config.imageHeight}px`;
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString();
  }
}
