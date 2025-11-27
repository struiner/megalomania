import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TilemapAnalysisService, TilemapProject, TileInfo } from '../../services/mk2/tools/tilemap-analysis.service';
import { TilemapFilesystemService } from '../../services/mk2/tools/tilemap-filesystem.service';
import { AssetManagementService } from '../../services/mk2/tools/asset-management.service';

@Injectable()
export class TilemapCreationToolFacade {
  // State
  private currentProject$ = new BehaviorSubject<TilemapProject | null>(null);
  private selectedFile$ = new BehaviorSubject<File | null>(null);
  private selectedTiles$ = new BehaviorSubject<TileInfo[]>([]);
  private isAnalyzing$ = new BehaviorSubject<boolean>(false);
  private analysisProgress$ = new BehaviorSubject<number>(0);
  private isDragOver$ = new BehaviorSubject<boolean>(false);

  constructor(
    private tilemapAnalysis: TilemapAnalysisService,
    private tilemapFilesystem: TilemapFilesystemService,
    private assetManagement: AssetManagementService,
    private snackBar: MatSnackBar
  ) {
    this.initializeSubscriptions();
  }

  // Observables
  getCurrentProject(): Observable<TilemapProject | null> {
    return this.currentProject$.asObservable();
  }

  getSelectedFile(): Observable<File | null> {
    return this.selectedFile$.asObservable();
  }

  getSelectedTiles(): Observable<TileInfo[]> {
    return this.selectedTiles$.asObservable();
  }

  getSelectedTileIds(): Observable<string[]> {
    return this.selectedTiles$.pipe(
      map(tiles => tiles.map(tile => tile.id))
    );
  }

  getIsAnalyzing(): Observable<boolean> {
    return this.isAnalyzing$.asObservable();
  }

  getAnalysisProgress(): Observable<number> {
    return this.analysisProgress$.asObservable();
  }

  getIsDragOver(): Observable<boolean> {
    return this.isDragOver$.asObservable();
  }

  // Actions
  async initializeFilesystem(): Promise<void> {
    try {
      await this.tilemapFilesystem.initializeTilemapFolders();
      await this.assetManagement.initializeAssetFolders();
      console.log('✅ Tilemap creation tool filesystem initialized');
    } catch (error) {
      console.warn('⚠️ Could not initialize filesystem:', error);
    }
  }

  // Enhanced analysis with custom configuration
  async analyzeImageWithConfig(file: File, config: any): Promise<void> {
    try {
      this.isAnalyzing$.next(true);
      this.analysisProgress$.next(0);
      this.selectedFile$.next(file);

      const project = await this.tilemapAnalysis.analyzePngFile(
        file,
        config.tileWidth,
        config.tileHeight,
        config.marginX,
        config.marginY,
        config.spacingX,
        config.spacingY
      );

      // Update project with custom config
      project.config.name = config.name;
      project.config.description = config.description;
      project.metadata.exportFormat = config.exportFormat;

      this.currentProject$.next(project);
      this.isAnalyzing$.next(false);
      this.analysisProgress$.next(100);

      this.snackBar.open('Spritesheet analyzed successfully!', 'Close', { duration: 3000 });
    } catch (error) {
      this.isAnalyzing$.next(false);
      this.snackBar.open('Failed to analyze spritesheet', 'Close', { duration: 3000 });
      console.error('Analysis error:', error);
    }
  }

  async handleFileSelection(file: File): Promise<void> {
    if (!file.type.startsWith('image/')) {
      this.snackBar.open('Please select an image file', 'Close', { duration: 3000 });
      return;
    }

    this.selectedFile$.next(file);
    await this.analyzeImage(file);
  }

  async analyzeImage(file: File): Promise<void> {
    try {
      this.isAnalyzing$.next(true);
      this.analysisProgress$.next(0);

      const imageUrl = URL.createObjectURL(file);
      
      // Create analysis config
      const config = {
        name: file.name.replace(/\.[^/.]+$/, ''),
        imageUrl,
        imageWidth: 0,
        imageHeight: 0,
        tileWidth: 16,
        tileHeight: 16,
        marginX: 0,
        marginY: 0,
        spacingX: 0,
        spacingY: 0
      };

      // Get image dimensions
      const img = new Image();
      img.onload = async () => {
        config.imageWidth = img.width;
        config.imageHeight = img.height;

        await this.tilemapAnalysis.analyzePngFile(
          file,
          config.tileWidth,
          config.tileHeight,
          config.marginX,
          config.marginY,
          config.spacingX,
          config.spacingY
        );
        this.isAnalyzing$.next(false);
        this.analysisProgress$.next(100);
      };
      img.src = imageUrl;

    } catch (error) {
      this.isAnalyzing$.next(false);
      this.snackBar.open('Failed to analyze image', 'Close', { duration: 3000 });
      console.error('Analysis error:', error);
    }
  }

  async saveProject(): Promise<void> {
    const project = this.currentProject$.value;
    if (!project) return;

    try {
      await this.tilemapAnalysis.saveProject();
      this.saveToRecentProjects(project);
      this.snackBar.open('Project saved to filesystem', 'Close', { duration: 2000 });
    } catch (error) {
      console.error('Failed to save to filesystem:', error);
      this.fallbackToDownload(project, 'project');
    }
  }

  async exportPalette(): Promise<void> {
    const project = this.currentProject$.value;
    if (!project) return;

    try {
      await this.tilemapAnalysis.exportTilemapToFilesystem();
      this.snackBar.open('Palette exported to filesystem for tile placement tool', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Failed to export to filesystem:', error);
      this.fallbackToDownload(project, 'export');
    }
  }

  // Enhanced export functionality
  async exportProject(format: string): Promise<void> {
    const project = this.currentProject$.value;
    if (!project) return;

    try {
      switch (format) {
        case 'tile-placement-tool':
          await this.tilemapAnalysis.exportTilemapToFilesystem();
          this.snackBar.open('Exported for tile placement tool', 'Close', { duration: 3000 });
          break;

        case 'json':
          const jsonData = this.tilemapAnalysis.exportForTilePlacementTool();
          this.downloadFile(jsonData, `${project.config.name}_tilemap.json`, 'application/json');
          this.snackBar.open('JSON exported successfully', 'Close', { duration: 3000 });
          break;

        case 'csv':
          const csvData = this.exportToCsv(project);
          this.downloadFile(csvData, `${project.config.name}_tiles.csv`, 'text/csv');
          this.snackBar.open('CSV exported successfully', 'Close', { duration: 3000 });
          break;

        default:
          this.fallbackToDownload(project, 'export');
      }
    } catch (error) {
      console.error('Failed to export:', error);
      this.snackBar.open('Export failed', 'Close', { duration: 3000 });
    }
  }

  // Load recent projects
  async loadRecentProjects(): Promise<any[]> {
    try {
      // This would typically load from filesystem or local storage
      const recentProjects = JSON.parse(localStorage.getItem('recentTilemapProjects') || '[]');
      return recentProjects.slice(0, 5); // Return last 5 projects
    } catch (error) {
      console.error('Failed to load recent projects:', error);
      return [];
    }
  }

  // Save project to recent list
  private saveToRecentProjects(project: TilemapProject): void {
    try {
      const recentProjects = JSON.parse(localStorage.getItem('recentTilemapProjects') || '[]');
      const projectInfo = {
        name: project.config.name,
        description: project.config.description,
        tiles: project.tiles.length,
        modified: Date.now(),
        id: project.config.id
      };

      // Remove existing entry if it exists
      const filtered = recentProjects.filter((p: any) => p.id !== projectInfo.id);

      // Add to beginning
      filtered.unshift(projectInfo);

      // Keep only last 10
      const limited = filtered.slice(0, 10);

      localStorage.setItem('recentTilemapProjects', JSON.stringify(limited));
    } catch (error) {
      console.error('Failed to save to recent projects:', error);
    }
  }

  setDragOver(isDragOver: boolean): void {
    this.isDragOver$.next(isDragOver);
  }

  selectTiles(tileIds: string[]): void {
    const project = this.currentProject$.value;
    if (!project) {
      console.log('❌ No project available for tile selection');
      return;
    }

    const tiles = project.tiles.filter(tile => tileIds.includes(tile.id));
    console.log('🎯 Facade selecting tiles:', {
      requestedIds: tileIds.length,
      foundTiles: tiles.length,
      tileNames: tiles.map(t => t.name || t.id)
    });
    this.selectedTiles$.next(tiles);
  }

  updateProject(project: TilemapProject): void {
    this.currentProject$.next(project);
  }

  private initializeSubscriptions(): void {
    // Subscribe to analysis progress
    this.tilemapAnalysis.getAnalysisProgress().subscribe(progress => {
      this.analysisProgress$.next(progress);
    });

    // Subscribe to analyzing state
    this.tilemapAnalysis.getAnalyzingState().subscribe(analyzing => {
      this.isAnalyzing$.next(analyzing);
    });

    // Subscribe to current project
    this.tilemapAnalysis.getCurrentProject().subscribe(project => {
      this.currentProject$.next(project);
      if (project) {
        this.selectedTiles$.next([]);
      }
    });
  }

  private fallbackToDownload(project: TilemapProject, type: 'project' | 'export'): void {
    try {
      let jsonData: string;
      let filename: string;

      if (type === 'project') {
        jsonData = this.tilemapAnalysis.saveProjectAsJson();
        filename = `${project.config.name}_project.json`;
      } else {
        jsonData = this.tilemapAnalysis.exportForTilePlacementTool();
        filename = `${project.config.name}_palette.json`;
      }

      this.downloadFile(jsonData, filename, 'application/json');

      const message = type === 'project'
        ? 'Project downloaded (filesystem unavailable)'
        : 'Palette downloaded (filesystem unavailable)';
      this.snackBar.open(message, 'Close', { duration: 3000 });
    } catch (downloadError) {
      const message = type === 'project'
        ? 'Failed to save project'
        : 'Failed to export palette';
      this.snackBar.open(message, 'Close', { duration: 3000 });
    }
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private exportToCsv(project: TilemapProject): string {
    const headers = ['ID', 'Name', 'Category', 'Subcategory', 'GridX', 'GridY', 'PixelX', 'PixelY', 'Width', 'Height', 'Tags', 'Rarity', 'Cost'];
    const rows = project.tiles.map(tile => [
      tile.id,
      tile.name,
      tile.category,
      tile.subcategory,
      tile.gridX.toString(),
      tile.gridY.toString(),
      tile.pixelX.toString(),
      tile.pixelY.toString(),
      tile.width.toString(),
      tile.height.toString(),
      tile.tags.join(';'),
      tile.metadata.rarity,
      tile.metadata.cost.toString()
    ]);

    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  }
}
