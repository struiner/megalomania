import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { TilemapCreationToolComponent } from './tile-map-creator.component';
import { TilemapCreationToolFacade } from './tilemap-creation-tool.facade';
import { TileInfo, TilemapProject } from '../../../services/tools/tilemap-analysis.service';

class MockTilemapCreationToolFacade {
  currentProject$ = new BehaviorSubject<TilemapProject | null>(null);
  selectedFile$ = new BehaviorSubject<File | null>(null);
  selectedTiles$ = new BehaviorSubject<TileInfo[]>([]);
  isAnalyzing$ = new BehaviorSubject<boolean>(false);
  analysisProgress$ = new BehaviorSubject<number>(0);
  isDragOver$ = new BehaviorSubject<boolean>(false);

  loadProjectFromFile = jasmine.createSpy('loadProjectFromFile').and.resolveTo();
  loadProjectFromSelection = jasmine.createSpy('loadProjectFromSelection');
  loadRecentProjects = jasmine.createSpy('loadRecentProjects').and.resolveTo([]);
  initializeFilesystem = jasmine.createSpy('initializeFilesystem').and.resolveTo();

  getCurrentProject() { return this.currentProject$.asObservable(); }
  getSelectedFile() { return this.selectedFile$.asObservable(); }
  getSelectedTiles() { return this.selectedTiles$.asObservable(); }
  getSelectedTileIds() { return this.selectedTiles$.pipe(map(tiles => tiles.map(tile => tile.id))); }
  getIsAnalyzing() { return this.isAnalyzing$.asObservable(); }
  getAnalysisProgress() { return this.analysisProgress$.asObservable(); }
  getIsDragOver() { return this.isDragOver$.asObservable(); }

  selectTiles(tileIds: string[]): void {
    const project = this.currentProject$.value;
    if (!project) return;
    const tiles = project.tiles.filter((tile: TileInfo) => tileIds.includes(tile.id));
    this.selectedTiles$.next(tiles);
  }

  updateProject(project: TilemapProject): void {
    this.currentProject$.next(project);
  }
}

describe('TilemapCreationToolComponent', () => {
  let component: TilemapCreationToolComponent;
  let fixture: ComponentFixture<TilemapCreationToolComponent>;
  let facade: MockTilemapCreationToolFacade;
  const dialogRefMock = { close: jasmine.createSpy('close') } as unknown as MatDialogRef<TilemapCreationToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TilemapCreationToolComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: TilemapCreationToolFacade, useClass: MockTilemapCreationToolFacade }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TilemapCreationToolComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(TilemapCreationToolFacade) as unknown as MockTilemapCreationToolFacade;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load a project from a chosen file', fakeAsync(async () => {
    const mockProject = createProject();
    const mockFile = new File([JSON.stringify(mockProject)], 'project.json', { type: 'application/json' });

    const mockInput: any = {
      type: '',
      accept: '',
      files: [mockFile],
      onclick: null,
      onchange: null,
      click: jasmine.createSpy('click').and.callFake(() => {
        if (mockInput.onchange) {
          mockInput.onchange({} as any);
        }
      })
    };

    spyOn(document, 'createElement').and.returnValue(mockInput as HTMLInputElement);

    component.onLoadProject();
    flushMicrotasks();

    expect(mockInput.click).toHaveBeenCalled();
    expect(facade.loadProjectFromFile).toHaveBeenCalledWith(mockFile);
    expect(component.selectedTabIndex).toBe(1);
  }));

  it('should update selection state when tiles are selected', fakeAsync(() => {
    const mockProject = createProject();
    facade.currentProject$.next(mockProject);

    component.onTileSelectionChange(['tile-1']);
    tick();
    fixture.detectChanges();

    expect(component.selectedTileIds).toEqual(['tile-1']);
    expect(component.selectedTiles.length).toBe(1);
  }));
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
