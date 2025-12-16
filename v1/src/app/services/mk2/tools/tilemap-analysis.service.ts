import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TilemapConfig {
  id?: string;
  name: string;
  description?: string;
  imageUrl: string;
  imageWidth?: number;
  imageHeight?: number;
  tileWidth: number;
  tileHeight: number;
  marginX: number;
  marginY: number;
  spacingX: number;
  spacingY: number;
  tilesPerRow: number;
  tilesPerColumn: number;
  exportFormat?: string;
}

export interface TileMetadata {
  rarity?: number | string;
  cost: number;
  unlockLevel?: number;
  season?: string;
  animated?: boolean;
  frames?: number;
}

export interface TilemapMetadata {
  exportFormat?: string;
}

export interface TileInfo {
  id: string;
  name: string;
  category?: string;
  subcategory?: string;
  gridX: number;
  gridY: number;
  pixelX: number;
  pixelY: number;
  width: number;
  height: number;
  tags: string[];
  metadata: TileMetadata;
  properties?: Record<string, any>;
}

export interface TilemapProject {
  config: TilemapConfig;
  metadata: TilemapMetadata;
  tiles: TileInfo[];
  categories?: string[];
  subcategories?: Record<string, string[]>;
}

@Injectable({ providedIn: 'root' })
export class TilemapAnalysisService {
  private readonly progress$ = new BehaviorSubject<number>(0);
  private readonly analyzing$ = new BehaviorSubject<boolean>(false);
  private readonly currentProject$ = new BehaviorSubject<TilemapProject | null>(null);

  getAnalysisProgress(): Observable<number> {
    return this.progress$.asObservable();
  }

  getAnalyzingState(): Observable<boolean> {
    return this.analyzing$.asObservable();
  }

  getCurrentProject(): Observable<TilemapProject | null> {
    return this.currentProject$.asObservable();
  }

  async analyzePngFile(
    file: File,
    tileWidth: number,
    tileHeight: number,
    marginX: number,
    marginY: number,
    spacingX: number,
    spacingY: number
  ): Promise<TilemapProject> {
    this.analyzing$.next(true);
    this.progress$.next(10);

    const config: TilemapConfig = {
      id: file.name,
      name: file.name.replace(/\.[^/.]+$/, ''),
      description: 'Stub project generated for tests',
      imageUrl: URL.createObjectURL(file),
      tileWidth,
      tileHeight,
      marginX,
      marginY,
      spacingX,
      spacingY,
      tilesPerRow: 1,
      tilesPerColumn: 1,
      exportFormat: 'json'
    };

    const tiles: TileInfo[] = [
      {
        id: '0',
        name: 'Stub Tile',
        category: 'Default',
        subcategory: 'Default',
        gridX: 0,
        gridY: 0,
        pixelX: marginX,
        pixelY: marginY,
        width: tileWidth,
        height: tileHeight,
        tags: [],
        metadata: { cost: 0, rarity: 'common' }
      }
    ];

    const project: TilemapProject = {
      config,
      metadata: { exportFormat: 'json' },
      tiles,
      categories: ['Default'],
      subcategories: { Default: ['Default'] }
    };

    this.currentProject$.next(project);
    this.progress$.next(100);
    this.analyzing$.next(false);

    return project;
  }

  async exportTilemapToFilesystem(): Promise<void> {
    return Promise.resolve();
  }

  async saveProject(): Promise<void> {
    return Promise.resolve();
  }

  saveProjectAsJson(): string {
    const project = this.currentProject$.value ?? {};
    return JSON.stringify(project, null, 2);
  }

  exportForTilePlacementTool(): string {
    const project = this.currentProject$.value ?? {};
    return JSON.stringify(project, null, 2);
  }
}
