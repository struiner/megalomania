import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';

import { TileGridViewerComponent } from '../tile-grid-viewer/tile-grid-viewer.component';
import { TilePropertiesEditorComponent } from '../tile-properties-editor/tile-properties-editor.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { AnalysisProgressComponent } from './analysis-progress/analysis-progress.component';
import { ProjectActionsComponent } from './project-actions/project-actions.component';
import { TilemapConfigComponent, TilemapConfigData } from './tilemap-config/tilemap-config.component';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { TilemapCreationToolFacade } from './tilemap-creation-tool.facade';
import { TilemapProject, TileInfo } from '../../../services/tools/tilemap-analysis.service';

@Component({
  selector: 'app-tilemap-creation-tool',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    TileGridViewerComponent,
    TilePropertiesEditorComponent,
    FileUploadComponent,
    AnalysisProgressComponent,
    ProjectActionsComponent,
    TilemapConfigComponent,
    ProjectManagementComponent
  ],
  providers: [TilemapCreationToolFacade],
  templateUrl: './tile-map-creator.component.html',
  styleUrl: './tile-map-creator.component.scss'
})
export class TilemapCreationToolComponent implements OnInit, OnDestroy {
  
  // State
  currentProject: TilemapProject | null = null;
  selectedFile: File | null = null;
  selectedTiles: TileInfo[] = [];
  selectedTileIds: string[] = [];
  imageInfo: { width: number; height: number } | null = null;
  isAnalyzing = false;
  analysisProgress = 0;
  isDragOver = false;
  selectedTabIndex = 0;
  recentProjects: any[] = [];
  currentConfig: TilemapConfigData | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<TilemapCreationToolComponent>,
    private facade: TilemapCreationToolFacade
  ) {}

  async ngOnInit(): Promise<void> {
    await this.facade.initializeFilesystem();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Event Handlers

  onTileSelectionChange(tileIds: string[]): void {
    console.log('🖱️ Tile selection changed:', tileIds.length, tileIds);
    // Let the facade handle the selection, which will update our subscriptions
    this.facade.selectTiles(tileIds);
  }

  onTilesUpdated(event: { tileIds: string[], updates: Partial<TileInfo> }): void {
    if (!this.currentProject) return;

    // Update tiles in the current project
    this.currentProject.tiles.forEach((tile: TileInfo) => {
      if (event.tileIds.includes(tile.id)) {
        Object.assign(tile, event.updates);
      }
    });

    // Update the project in the facade
    this.facade.updateProject(this.currentProject);

    console.log('Tiles updated:', event);
  }

  onLoadProject(): void {
    // Task load_project_flow: implement load project functionality (see tasks_backlog.yaml)
    console.log('Load project requested');
  }

  onSaveProject(): void {
    this.facade.saveProject();
  }

  onExportPalette(): void {
    this.facade.exportPalette();
  }

  onClose(): void {
    this.dialogRef.close(this.currentProject);
  }

  private setupSubscriptions(): void {
    this.facade.getCurrentProject()
      .pipe(takeUntil(this.destroy$))
      .subscribe(project => {
        this.currentProject = project;
      });

    this.facade.getSelectedFile()
      .pipe(takeUntil(this.destroy$))
      .subscribe(file => {
        this.selectedFile = file;
      });

    this.facade.getSelectedTiles()
      .pipe(takeUntil(this.destroy$))
      .subscribe(tiles => {
        this.selectedTiles = tiles;
        console.log('🎯 Selected tiles updated:', tiles.length, tiles.map(t => t.name || t.id));
      });

    this.facade.getSelectedTileIds()
      .pipe(takeUntil(this.destroy$))
      .subscribe(tileIds => {
        this.selectedTileIds = tileIds;
        console.log('🎯 Selected tile IDs updated:', tileIds.length, tileIds);
      });

    this.facade.getIsAnalyzing()
      .pipe(takeUntil(this.destroy$))
      .subscribe(analyzing => {
        this.isAnalyzing = analyzing;
      });

    this.facade.getAnalysisProgress()
      .pipe(takeUntil(this.destroy$))
      .subscribe(progress => {
        this.analysisProgress = progress;
      });

    this.facade.getIsDragOver()
      .pipe(takeUntil(this.destroy$))
      .subscribe(dragOver => {
        this.isDragOver = dragOver;
      });

    // Load recent projects
    this.loadRecentProjects();
  }

  // New methods for enhanced functionality
  async loadRecentProjects(): Promise<void> {
    this.recentProjects = await this.facade.loadRecentProjects();
  }

  onConfigChange(config: TilemapConfigData): void {
    this.currentConfig = config;
  }

  async onAnalyzeWithConfig(config: TilemapConfigData): Promise<void> {
    if (!this.selectedFile) return;

    await this.facade.analyzeImageWithConfig(this.selectedFile, config);
    this.selectedTabIndex = 1; // Switch to Tile Grid tab
  }

  onResetConfig(): void {
    this.currentConfig = null;
    this.imageInfo = null;
  }

  async onFileSelected(file: File): Promise<void> {
    this.selectedFile = file;

    // Load image to get dimensions
    try {
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        this.imageInfo = { width: img.width, height: img.height };
        URL.revokeObjectURL(imageUrl);
      };
      img.src = imageUrl;
    } catch (error) {
      console.error('Failed to load image info:', error);
    }
  }

  onNewProject(): void {
    this.currentProject = null;
    this.selectedFile = null;
    this.imageInfo = null;
    this.selectedTabIndex = 0;
  }

  async onLoadRecentProject(project: any): Promise<void> {
    // This would load the project from filesystem
    console.log('Loading recent project:', project);
  }

  async onImportProject(): Promise<void> {
    // This would open a file picker for project files
    console.log('Import project functionality');
  }

  async onExportProject(format: string): Promise<void> {
    await this.facade.exportProject(format);
  }

  onDuplicateProject(): void {
    if (this.currentProject) {
      const duplicated = { ...this.currentProject };
      duplicated.config.id = 'duplicate_' + Date.now();
      duplicated.config.name = duplicated.config.name + ' (Copy)';
      this.currentProject = duplicated;
    }
  }

  onDeleteProject(project: any): void {
    // Remove from recent projects
    this.recentProjects = this.recentProjects.filter(p => p.id !== project.id);
    localStorage.setItem('recentTilemapProjects', JSON.stringify(this.recentProjects));
  }

  async onLoadExample(): Promise<void> {
    // This would load an example project
    console.log('Load example functionality');
  }

  onDragOverChange(isDragOver: boolean): void {
    this.isDragOver = isDragOver;
  }
}
