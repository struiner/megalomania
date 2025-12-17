import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TilemapAnalysisService, TilemapProject, TileInfo } from '../../../services/mk2/tools/tilemap-analysis.service';
import { TilemapFilesystemService } from '../../../services/mk2/tools/tilemap-filesystem.service';
import { AssetManagementService } from '../../../services/mk2/tools/asset-management.service';

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
      return recentProjects
        .map((entry: any) => {
          if (!entry.data) {
            return entry;
          }

          try {
            // Validate eagerly so the selector never shows incompatible projects
            const validated = this.validateProjectSchema(entry.data);
            return { ...entry, data: validated };
          } catch (schemaError) {
            console.warn('Skipping incompatible recent project', schemaError);
            return null;
          }
        })
        .filter(Boolean)
        .slice(0, 5); // Return last 5 projects
    } catch (error) {
      console.error('Failed to load recent projects:', error);
      return [];
    }
  }

  async loadProjectFromFile(file: File): Promise<void> {
    try {
      const projectText = await file.text();
      const parsed = JSON.parse(projectText);
      const validated = this.validateProjectSchema(parsed);
      this.hydrateProject(validated);
      this.saveToRecentProjects(validated);
      this.snackBar.open(`Loaded project "${validated.config.name}"`, 'Close', { duration: 3000 });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.snackBar.open(`Failed to load project: ${message}`, 'Close', { duration: 4000 });
      throw error;
    }
  }

  loadProjectFromSelection(project: any): void {
    try {
      const validated = this.validateProjectSchema(project);
      this.hydrateProject(validated);
      this.saveToRecentProjects(validated);
      this.snackBar.open(`Loaded project "${validated.config.name}"`, 'Close', { duration: 3000 });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.snackBar.open(`Failed to load project: ${message}`, 'Close', { duration: 4000 });
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
        id: project.config.id,
        data: project
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

    const tiles = project.tiles.filter((tile: TileInfo) => tileIds.includes(tile.id));
    console.log('🎯 Facade selecting tiles:', {
      requestedIds: tileIds.length,
      foundTiles: tiles.length,
      tileNames: tiles.map((t: TileInfo) => t.name || t.id)
    });
    this.selectedTiles$.next(tiles);
  }

  updateProject(project: TilemapProject): void {
    this.currentProject$.next(project);
  }

  private hydrateProject(project: TilemapProject): void {
    this.currentProject$.next(project);
    this.selectedTiles$.next([]);
  }

  private initializeSubscriptions(): void {
    // Subscribe to analysis progress
    this.tilemapAnalysis.getAnalysisProgress().subscribe((progress: number) => {
      this.analysisProgress$.next(progress);
    });

    // Subscribe to analyzing state
    this.tilemapAnalysis.getAnalyzingState().subscribe((analyzing: boolean) => {
      this.isAnalyzing$.next(analyzing);
    });

    // Subscribe to current project
    this.tilemapAnalysis.getCurrentProject().subscribe((project: TilemapProject | null) => {
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
    const rows = project.tiles.map((tile: TileInfo) => [
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

    return [headers, ...rows].map(row => row.map((cell: string | number | undefined) => `"${cell}"`).join(',')).join('\n');
  }

  private validateProjectSchema(candidate: any): TilemapProject {
    if (!candidate || typeof candidate !== 'object') {
      throw new Error('Project payload must be an object');
    }

    if (!candidate.config || typeof candidate.config !== 'object') {
      throw new Error('Project config is missing');
    }

    const { config } = candidate;
    const requiredNumericFields = ['tileWidth', 'tileHeight', 'marginX', 'marginY', 'spacingX', 'spacingY'];

    if (!config.name || typeof config.name !== 'string') {
      throw new Error('Project config.name is required');
    }

    requiredNumericFields.forEach(field => {
      if (typeof config[field] !== 'number') {
        throw new Error(`Project config.${field} must be a number`);
      }
    });

    if (!Array.isArray(candidate.tiles) || candidate.tiles.length === 0) {
      throw new Error('Project tiles are missing');
    }

    const normalizedTiles = candidate.tiles.map((tile: any) => {
      const requiredTileFields: Array<keyof TileInfo> = ['id', 'gridX', 'gridY', 'pixelX', 'pixelY', 'width', 'height'];
      requiredTileFields.forEach(field => {
        if (typeof tile[field] === 'undefined') {
          throw new Error(`Tile is missing required field: ${String(field)}`);
        }
      });

      if (typeof tile.id !== 'string') {
        throw new Error('Tile id must be a string');
      }

      const metadata = tile.metadata || {};

      return {
        ...tile,
        name: tile.name || tile.id,
        tags: Array.isArray(tile.tags) ? tile.tags : [],
        metadata: {
          cost: typeof metadata.cost === 'number' ? metadata.cost : 0,
          rarity: metadata.rarity ?? 'common',
          unlockLevel: metadata.unlockLevel,
          season: metadata.season,
          animated: metadata.animated,
          frames: metadata.frames
        }
      } as TileInfo;
    });

    const normalizedConfig = {
      id: config.id || config.name,
      description: config.description,
      imageUrl: config.imageUrl,
      imageWidth: config.imageWidth,
      imageHeight: config.imageHeight,
      tileWidth: config.tileWidth,
      tileHeight: config.tileHeight,
      marginX: config.marginX,
      marginY: config.marginY,
      spacingX: config.spacingX,
      spacingY: config.spacingY,
      tilesPerRow: typeof config.tilesPerRow === 'number' ? config.tilesPerRow : config.tilesPerRow === 0 ? 0 : normalizedTiles.length,
      tilesPerColumn: typeof config.tilesPerColumn === 'number' ? config.tilesPerColumn : config.tilesPerColumn === 0 ? 0 : normalizedTiles.length,
      exportFormat: config.exportFormat || candidate.metadata?.exportFormat || 'json',
      name: config.name
    } as TilemapProject['config'];

    const normalizedMetadata = {
      exportFormat: candidate.metadata?.exportFormat || normalizedConfig.exportFormat
    } as TilemapProject['metadata'];

    return {
      config: normalizedConfig,
      metadata: normalizedMetadata,
      tiles: normalizedTiles,
      categories: Array.isArray(candidate.categories) ? candidate.categories : [],
      subcategories: candidate.subcategories || {}
    };
  }
}
