import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

import { TilemapCreationToolFacade } from './tilemap-creation-tool.facade';
import { TilemapAnalysisService, TilemapProject } from '../../../services/tools/tilemap-analysis.service';
import { TilemapFilesystemService } from '../../../services/mk2/tools/tilemap-filesystem.service';
import { AssetManagementService } from '../../../services/mk2/tools/asset-management.service';

class TilemapAnalysisStub {
  progress$ = new BehaviorSubject<number>(0);
  analyzing$ = new BehaviorSubject<boolean>(false);
  project$ = new BehaviorSubject<TilemapProject | null>(null);

  analyzePngFile = jasmine.createSpy('analyzePngFile');
  exportTilemapToFilesystem = jasmine.createSpy('exportTilemapToFilesystem').and.resolveTo();
  saveProject = jasmine.createSpy('saveProject').and.resolveTo();
  saveProjectAsJson = jasmine.createSpy('saveProjectAsJson').and.returnValue('{}');
  exportForTilePlacementTool = jasmine.createSpy('exportForTilePlacementTool').and.returnValue('{}');

  getAnalysisProgress() { return this.progress$.asObservable(); }
  getAnalyzingState() { return this.analyzing$.asObservable(); }
  getCurrentProject() { return this.project$.asObservable(); }
}

const filesystemStub = { initializeTilemapFolders: jasmine.createSpy('initializeTilemapFolders').and.resolveTo() };
const assetManagementStub = { initializeAssetFolders: jasmine.createSpy('initializeAssetFolders').and.resolveTo() };

describe('TilemapCreationToolFacade', () => {
  let facade: TilemapCreationToolFacade;
  let snackBar: MatSnackBar;
  let analysisStub: TilemapAnalysisStub;

  beforeEach(() => {
    analysisStub = new TilemapAnalysisStub();
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        TilemapCreationToolFacade,
        { provide: TilemapAnalysisService, useValue: analysisStub },
        { provide: TilemapFilesystemService, useValue: filesystemStub },
        { provide: AssetManagementService, useValue: assetManagementStub }
      ]
    });

    facade = TestBed.inject(TilemapCreationToolFacade);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('hydrates state from a selected project', () => {
    const project = createProject();
    const snackSpy = spyOn(snackBar, 'open');

    facade.loadProjectFromSelection(project);

    expect(snackSpy).toHaveBeenCalledWith(jasmine.stringMatching('Loaded project'), 'Close', jasmine.any(Object));
    expect((facade as any).currentProject$.value?.config.name).toBe('Demo Project');
    expect((facade as any).selectedTiles$.value.length).toBe(0);
  });

  it('rejects incompatible project schemas', () => {
    const snackSpy = spyOn(snackBar, 'open');

    facade.loadProjectFromSelection({});

    expect(snackSpy).toHaveBeenCalledWith(jasmine.stringMatching('Failed to load project'), 'Close', jasmine.any(Object));
    expect((facade as any).currentProject$.value).toBeNull();
  });

  it('exposes tile selection after hydration', () => {
    const project = createProject();
    facade.loadProjectFromSelection(project);

    facade.selectTiles(['tile-1']);

    expect((facade as any).selectedTiles$.value.map((tile: any) => tile.id)).toEqual(['tile-1']);
  });
});

function createProject(): TilemapProject {
  return {
    config: {
      id: 'demo',
      name: 'Demo Project',
      description: 'Project used for tests',
      imageUrl: 'demo.png',
      imageWidth: 32,
      imageHeight: 32,
      tileWidth: 16,
      tileHeight: 16,
      marginX: 0,
      marginY: 0,
      spacingX: 0,
      spacingY: 0,
      tilesPerRow: 2,
      tilesPerColumn: 2,
      exportFormat: 'json'
    },
    metadata: { exportFormat: 'json' },
    tiles: [
      {
        id: 'tile-1',
        name: 'Tile 1',
        gridX: 0,
        gridY: 0,
        pixelX: 0,
        pixelY: 0,
        width: 16,
        height: 16,
        tags: [],
        metadata: { cost: 0, rarity: 'common' }
      }
    ],
    categories: ['Default'],
    subcategories: { Default: ['Default'] }
  };
}
