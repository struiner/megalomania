import { Injectable, ElementRef } from '@angular/core';
import { Application } from '@pixi/app';
import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { Texture } from '@pixi/core';
import { Assets } from '@pixi/assets';
import { Graphics } from '@pixi/graphics';
import { Text } from '@pixi/text';
import { CellData, Tile } from './worldGeneration/world-map.service';
import { CityRendererService } from '../mk2/rendering/city-renderer.service';
import { TradeRouteRendererService } from '../mk2/rendering/trade-route-renderer.service';
import { UIOverlayRendererService } from '../mk2/rendering/ui-overlay-renderer.service';
import { ParticleEffectsService } from '../mk2/rendering/particle-effects.service';
import { KenneySpriteAtlasService } from '../mk2/rendering/kenney-sprite-atlas.service';
import { ProceduralTilesheetGeneratorService } from '../mk2/rendering/procedural-tilesheet-generator.service';
import { CameraControlsService } from '../mk2/rendering/camera-controls.service';
import { BiomeMapRendererService } from '../mk2/rendering/biome-map-renderer.service';
import { SeedService } from '../mk2/seed.service';
import { ClimateService } from '../mk2/world/gen/climate.service';
import { BiomeService } from '../mk2/world/gen/biome.service';
import { Biome } from '../../shared/enums/Biome';
import { ChunkService } from '../mk2/world/chunk/chunk.service';

@Injectable({ providedIn: 'root' })
export class TilemapRendererService {
  private app!: any;
  private layerContainers: any[] = [];
  private textures: Record<string, any> = {};
  private worldContainer!: any;
  private uiContainer!: any;
  private effectsContainer!: any;
  private biomeGraphics!: any;
  private biomeMapVisible = false;
  private lastCameraX = 0;
  private lastCameraY = 0;
  private lastZoomLevel = 1.0;
  private biomeChunkSize = 512; // Size of each biome chunk in world units

  constructor(
    private cityRenderer: CityRendererService,
    private tradeRouteRenderer: TradeRouteRendererService,
    private uiOverlayRenderer: UIOverlayRendererService,
    private particleEffects: ParticleEffectsService,
    private kenneyAtlas: KenneySpriteAtlasService,
    private proceduralTilesheet: ProceduralTilesheetGeneratorService,
    private cameraControls: CameraControlsService,
    private biomeMapRenderer: BiomeMapRendererService,
    private seedService: SeedService,
    private climateService: ClimateService,
    private biomeService: BiomeService,
    private chunkService: ChunkService
  ) {}

  async initialize(viewport: ElementRef, layerCount: number = 4): Promise<void> {
    console.log('🎮 TILEMAP RENDERER INITIALIZATION STARTING...');
    console.log('🌐 Browser info:', navigator.userAgent);
    console.log('🖥️ Screen resolution:', screen.width, 'x', screen.height);
    console.log('🎨 WebGL support:', this.checkWebGLSupport());
    console.log('📱 Viewport element:', viewport.nativeElement);
    console.log('📏 Viewport dimensions:', viewport.nativeElement.clientWidth, 'x', viewport.nativeElement.clientHeight);
    console.log('👁️ Viewport visible:', viewport.nativeElement.offsetParent !== null);

    try {
      // Create PIXI Application
      console.log('📱 Creating PIXI Application...');
      this.app = new Application({
        width: viewport.nativeElement.clientWidth || 800,
        height: viewport.nativeElement.clientHeight || 600,
        backgroundColor: 0x1a0f08, // Renaissance dark brown
      });

      console.log('✅ PIXI Application created successfully');
      console.log('📏 Canvas size:', this.app.screen.width, 'x', this.app.screen.height);
      console.log('🖼️ Canvas element:', this.app.view);
      console.log('🎨 Background color set to:', '0x1a0f08 (Renaissance brown)');

      // Add canvas to viewport
      console.log('🔗 Appending canvas to viewport...');
      viewport.nativeElement.appendChild(this.app.view as HTMLCanvasElement);
      console.log('✅ Canvas successfully added to DOM');

      // Log basic canvas info
      console.log('🔍 Canvas basic info:');
      console.log('  📐 Canvas width:', (this.app.view as any).width);
      console.log('  📐 Canvas height:', (this.app.view as any).height);
      console.log('  🎨 Canvas style:', (this.app.view as any).style?.display || 'unknown');

    } catch (error) {
      console.error('❌ Failed to create PIXI Application:', error);
      throw error;
    }

    // Create main containers with proper z-indexing
    console.log('🏗️ Creating main containers...');
    this.worldContainer = new Container();
    this.worldContainer.zIndex = 0;
    this.app.stage.addChild(this.worldContainer);
    console.log('✅ World container created and added to stage');

    this.effectsContainer = new Container();
    this.effectsContainer.zIndex = 500;
    this.app.stage.addChild(this.effectsContainer);
    console.log('✅ Effects container created and added to stage');

    this.uiContainer = new Container();
    this.uiContainer.zIndex = 1000;
    this.app.stage.addChild(this.uiContainer);
    console.log('✅ UI container created and added to stage');

    // Create tilemap layers
    console.log(`🏗️ Creating ${layerCount} tilemap layers...`);
    for (let i = 0; i < layerCount; i++) {
      const container = new Container();
      container.zIndex = i;
      this.layerContainers.push(container);
      this.worldContainer.addChild(container);
      console.log(`✅ Layer ${i} created and added to world container`);
    }
    this.app.stage.sortableChildren = true;
    console.log('✅ Stage sortable children enabled');

    // Initialize Kenney atlas first
    console.log('🎨 Initializing Kenney sprite atlas...');
    await this.kenneyAtlas.initialize();
    console.log('✅ Kenney atlas initialization complete');

    // Generate procedural tilesheet instead of loading static one
    console.log('🔄 Generating procedural tilesheet...');
    const proceduralTilesheet = await this.proceduralTilesheet.generateTilesheet(
      'main-world',
      [], // Will be populated with actual settlements
      [
        { type: 'temperate' },
        { type: 'coastal' },
        { type: 'mountain' }
      ],
      'Spring'
    );

    // Use procedural textures
    this.textures = proceduralTilesheet.textures;
    console.log(`✅ Loaded ${Object.keys(this.textures).length} procedural tiles`);
    console.log('📋 Available texture keys:', Object.keys(this.textures).slice(0, 10), '...');

    // Initialize rendering services with Kenney sprites
    await this.cityRenderer.initialize(this.textures);
    await this.tradeRouteRenderer.initialize(this.textures);
    await this.particleEffects.initialize(this.textures);

    this.uiOverlayRenderer.initialize(
      this.uiContainer,
      this.app.screen.width,
      this.app.screen.height
    );

    // Initialize camera controls (simplified for compatibility)
    console.log('📷 Setting up basic camera controls...');
    this.setupBasicCameraControls();

    // Initialize biome map renderer (simplified)
    console.log('🗺️ Setting up basic biome map...');
    this.setupBasicBiomeMap();

    // Add test content to verify PIXI.js is working
    this.addTestContent();

    // Add fallback content if Kenney sprites failed to load
    this.addFallbackContent();

    // Log final state before starting render loop
    console.log('🎬 FINAL STATE BEFORE RENDER LOOP:');
    console.log('  📱 App renderer type:', this.app.renderer.type);

    // Safely check canvas properties
    try {
      const canvasElement = this.app.view as unknown as HTMLElement;
      console.log('  🖼️ Canvas in DOM:', document.contains(canvasElement));
      console.log('  📏 Canvas computed style:', window.getComputedStyle(canvasElement).display);
    } catch (e) {
      console.log('  🖼️ Canvas DOM check failed:', e);
    }

    try {
      console.log('  🎨 Canvas background color:', this.app.renderer.background.color);
    } catch (e) {
      console.log('  🎨 Background color check failed:', e);
    }

    console.log('  📦 Stage children count:', this.app.stage.children.length);
    console.log('  🌍 World container children count:', this.worldContainer.children.length);

    // Start render loop
    console.log('🔄 Starting PIXI render loop...');
    this.app.ticker.add((deltaTime: number) => {
      this.update(deltaTime);
    });
    console.log('✅ Render loop started successfully');

    // Force an initial render
    console.log('🎨 Forcing initial render...');
    this.app.render();
    console.log('✅ Initial render complete');
  }

  /**
   * Add test content to verify PIXI.js rendering is working
   */
  private addTestContent(): void {
    console.log('🧪 ADDING TEST CONTENT TO VERIFY RENDERING...');

    let testItemsAdded = 0;

    // Create a simple test sprite using Kenney atlas
    console.log('🌱 Attempting to create Kenney grass sprite...');
    const testSprite = this.kenneyAtlas.getSprite('grass');
    if (testSprite) {
      const sprite = new Sprite(testSprite);
      sprite.x = 100;
      sprite.y = 100;
      sprite.width = 64;
      sprite.height = 64;
      this.worldContainer.addChild(sprite);
      testItemsAdded++;
      console.log('✅ Added Kenney grass sprite at (100, 100), size: 64x64');
      console.log('🔍 Sprite properties:', {
        x: sprite.x,
        y: sprite.y,
        width: sprite.width,
        height: sprite.height,
        visible: sprite.visible,
        alpha: sprite.alpha
      });
    } else {
      console.log('❌ Failed to get Kenney grass sprite');
    }

    // Create a simple colored rectangle as fallback
    console.log('🟩 Creating green test rectangle...');
    const testRect = new Graphics();
    testRect.beginFill(0x00FF00); // Green
    testRect.drawRect(0, 0, 64, 64);
    testRect.endFill();
    testRect.x = 200;
    testRect.y = 100;
    this.worldContainer.addChild(testRect);
    testItemsAdded++;
    console.log('✅ Added green test rectangle at (200, 100), size: 64x64');
    console.log('🔍 Rectangle properties:', {
      x: testRect.x,
      y: testRect.y,
      width: testRect.width,
      height: testRect.height,
      visible: testRect.visible,
      alpha: testRect.alpha
    });

    // Add some text
    console.log('📝 Creating test text...');
    const testText = new Text('PIXI.js Working!', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xFFFFFF
    });
    testText.x = 100;
    testText.y = 200;
    this.worldContainer.addChild(testText);
    testItemsAdded++;
    console.log('✅ Added test text at (100, 200)');
    console.log('🔍 Text properties:', {
      x: testText.x,
      y: testText.y,
      text: testText.text,
      visible: testText.visible,
      alpha: testText.alpha
    });

    // Log container hierarchy
    console.log('📊 CONTAINER HIERARCHY:');
    console.log('  📦 App stage children:', this.app.stage.children.length);
    console.log('  🌍 World container children:', this.worldContainer.children.length);
    console.log('  🎯 Test items added:', testItemsAdded);
    console.log('  📍 World container position:', { x: this.worldContainer.x, y: this.worldContainer.y });
    console.log('  👁️ World container visible:', this.worldContainer.visible);
    console.log('  🎨 World container alpha:', this.worldContainer.alpha);
    console.log('  📏 World container bounds:', this.worldContainer.getBounds());

    // Log each child in world container
    console.log('🔍 WORLD CONTAINER CHILDREN:');
    this.worldContainer.children.forEach((child: any, index: number) => {
      console.log(`  ${index + 1}. ${child.constructor.name} at (${child.x}, ${child.y}) visible:${child.visible} alpha:${child.alpha}`);
    });
  }

  /**
   * Add fallback content when sprites fail to load
   */
  private addFallbackContent(): void {
    console.log('Adding optimized fallback content...');

    // Create a single graphics object for better performance
    const fallbackGraphics = new Graphics();
    const colors = [0x228B22, 0x8B4513, 0x4169E1, 0xD2691E, 0x32CD32]; // Green, brown, blue, orange, lime
    const tileSize = 32;
    const gridSize = 8; // Reduced grid size for better performance

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const colorIndex = (x + y) % colors.length;
        fallbackGraphics.beginFill(colors[colorIndex], 0.8);
        fallbackGraphics.drawRect(
          x * tileSize + 300, // Offset from test content
          y * tileSize + 50,
          tileSize - 2, // Small gap between tiles
          tileSize - 2
        );
        fallbackGraphics.endFill();
      }
    }

    this.worldContainer.addChild(fallbackGraphics);

    // Add a title for the fallback content
    const fallbackText = new Text('Fallback World Grid', {
      fontFamily: 'Arial',
      fontSize: 16,
      fill: 0xFFFFFF
    });
    fallbackText.x = 300;
    fallbackText.y = 20;
    this.worldContainer.addChild(fallbackText);

    console.log(`Added fallback grid: ${gridSize}x${gridSize} tiles`);
  }

  /**
   * Add a visual marker at the player position
   */
  addPlayerMarker(playerX: number, playerY: number): void {
    console.log(`🎯 Adding player marker at world position (${playerX}, ${playerY})`);

    // Create a bright red circle to mark player position
    const playerMarker = new Graphics();
    playerMarker.beginFill(0xFF0000, 0.8); // Bright red
    playerMarker.drawCircle(0, 0, 10); // 10 pixel radius
    playerMarker.endFill();

    // Add a white border
    playerMarker.lineStyle(2, 0xFFFFFF);
    playerMarker.drawCircle(0, 0, 10);

    // Position the marker
    playerMarker.x = playerX;
    playerMarker.y = playerY;

    // Add to world container
    this.worldContainer.addChild(playerMarker);

    // Add text label
    const playerLabel = new Text('PLAYER', {
      fontFamily: 'Arial',
      fontSize: 12,
      fill: 0xFFFFFF,
      stroke: 0x000000,
      strokeThickness: 2
    });
    playerLabel.x = playerX - 20;
    playerLabel.y = playerY - 30;
    this.worldContainer.addChild(playerLabel);

    console.log('✅ Player marker added');
  }

  getApp(): Application {
    return this.app;
  }

  /**
   * Main update loop for all rendering systems
   */
  private update(deltaTime: number): void {
    // Log only first frame for debugging
    if (this.frameCount === 0) {
      console.log(`🎬 First frame: deltaTime=${deltaTime.toFixed(3)}`);
      console.log(`  📦 Stage children: ${this.app.stage.children.length}`);
      console.log(`  🌍 World children: ${this.worldContainer.children.length}`);
    }

    this.frameCount++;

    // Update particle effects
    this.particleEffects.updateParticles(deltaTime);

    // Update trade route animations
    this.tradeRouteRenderer.updateTradeRoutes(deltaTime);

    // Update infinite biome map if visible
    if (this.biomeMapVisible) {
      this.updateInfiniteBiomeMap();
    }
  }

  private frameCount = 0;

  /**
   * Check WebGL support
   */
  private checkWebGLSupport(): string {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl && gl instanceof WebGLRenderingContext) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';
        return `Available (${renderer})`;
      } else {
        return 'Not available';
      }
    } catch (e) {
      return 'Error checking WebGL';
    }
  }

  /**
   * Render cities on the world map
   */
  renderCities(cities: any[]): void {
    console.log('🏙️ RENDERING CITIES...');
    console.log('  📊 City count:', cities.length);
    console.log('  🎯 Target container:', this.worldContainer ? 'Available' : 'Not available');

    if (cities.length === 0) {
      console.log('⚠️ No cities to render');
      return;
    }

    cities.forEach((city, index) => {
      console.log(`  🏘️ City ${index + 1}:`, {
        name: city.name,
        type: city.type,
        position: `(${city.x}, ${city.y})`,
        structures: city.structures?.length || 0
      });

      this.cityRenderer.renderCity(city, this.worldContainer, city.x, city.y);

      // Add smoke effects for industrial buildings
      if (city.structures) {
        city.structures.forEach((structure: any) => {
          if (this.isIndustrialBuilding(structure.type)) {
            this.particleEffects.createSmokeEffect(
              `smoke_${structure.id}`,
              this.effectsContainer,
              city.x + (structure.location?.position?.x || 0),
              city.y + (structure.location?.position?.y || 0),
              0.5
            );
          }
        });
      }
    });
  }

  /**
   * Render trade routes between cities
   */
  renderTradeRoutes(routes: any[]): void {
    routes.forEach(route => {
      this.tradeRouteRenderer.renderTradeRoute(
        route,
        this.worldContainer,
        route.fromCity.x,
        route.fromCity.y,
        route.toCity.x,
        route.toCity.y
      );
    });
  }

  /**
   * Add weather effects
   */
  addWeatherEffect(type: 'rain' | 'snow', intensity: number = 1): void {
    if (type === 'rain') {
      this.particleEffects.createRainEffect(
        'weather_rain',
        this.effectsContainer,
        this.app.screen.width,
        this.app.screen.height,
        intensity
      );
    }
  }

  /**
   * Show notification to player
   */
  showNotification(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
    this.uiOverlayRenderer.showNotification(message, type);
  }

  /**
   * Update minimap with current world state
   */
  updateMinimap(cities: any[], playerX: number, playerY: number): void {
    const camera = this.worldContainer;
    this.uiOverlayRenderer.updateMinimap(
      cities,
      playerX,
      playerY,
      -camera.x,
      -camera.y
    );
  }


  renderViewport(
    chunkProvider: (x: number, y: number) => CellData | null,
    centerWorldX: number,
    centerWorldY: number,
    viewportWidth: number,
    viewportHeight: number,
    tileSize: number,
    tilesPerCellX: number,
    tilesPerCellY: number
  ) {
    const cellPixelWidth = tileSize * tilesPerCellX;
    const cellPixelHeight = tileSize * tilesPerCellY;

    const firstCellX = Math.floor((centerWorldX - viewportWidth / 2) / cellPixelWidth);
    const firstCellY = Math.floor((centerWorldY - viewportHeight / 2) / cellPixelHeight);
    const visibleCellsX = Math.ceil(viewportWidth / cellPixelWidth) + 2;
    const visibleCellsY = Math.ceil(viewportHeight / cellPixelHeight) + 2;

    this.layerContainers.forEach(layer => layer.removeChildren());

    for (let cy = firstCellY; cy < firstCellY + visibleCellsY; cy++) {
      for (let cx = firstCellX; cx < firstCellX + visibleCellsX; cx++) {
        const cell = chunkProvider(cx, cy);
        if (!cell) continue;

        for (let layerIdx = 0; layerIdx < cell.tiles!.length; layerIdx++) {
            const tileGrid: Tile[][] = cell.tiles![layerIdx];
            for (let ty = 0; ty < tileGrid.length; ty++) {
              for (let tx = 0; tx < tileGrid[ty].length; tx++) {
                const tile = tileGrid[ty][tx];
                if (!tile.sprite) continue;
                const texture = this.textures[tile.sprite];
                if (!texture) continue;
                const sprite = new Sprite(texture);
              const worldX = cx * cellPixelWidth + tx * tileSize;
              const worldY = cy * cellPixelHeight + ty * tileSize;
              const screenX = worldX - centerWorldX + viewportWidth / 2;
              const screenY = worldY - centerWorldY + viewportHeight / 2;

              sprite.x = screenX;
              sprite.y = screenY;
              sprite.width = tileSize;
              sprite.height = tileSize;

              this.layerContainers[layerIdx].addChild(sprite);
            }
          }
        }
      }
    }
  }

  /**
   * Check if building type is industrial (produces smoke)
   */
  private isIndustrialBuilding(structureType: any): boolean {
    const industrialTypes = [
      'Blacksmith', 'Brewery', 'Woodcutter', 'Papermill',
      'Tannery', 'CopperMine', 'Fishery'
    ];
    return industrialTypes.includes(structureType);
  }

  /**
   * Add visual effects for special events
   */
  addEventEffect(x: number, y: number, type: 'celebration' | 'disaster' | 'magic'): void {
    switch (type) {
      case 'celebration':
        this.particleEffects.createFireEffect(
          `celebration_${Date.now()}`,
          this.effectsContainer,
          x, y, 2
        );
        break;
      case 'magic':
        this.particleEffects.createMagicEffect(
          `magic_${Date.now()}`,
          this.effectsContainer,
          x, y, 0x9966FF
        );
        break;
    }
  }

  /**
   * Focus camera on specific world coordinates
   */
  focusOnPosition(worldX: number, worldY: number): void {
    const centerX = this.app.screen.width / 2;
    const centerY = this.app.screen.height / 2;

    this.worldContainer.x = centerX - worldX;
    this.worldContainer.y = centerY - worldY;
  }

  /**
   * Get world coordinates from screen coordinates
   */
  screenToWorld(screenX: number, screenY: number): { x: number, y: number } {
    return {
      x: screenX - this.worldContainer.x,
      y: screenY - this.worldContainer.y
    };
  }

  /**
   * Get screen coordinates from world coordinates
   */
  worldToScreen(worldX: number, worldY: number): { x: number, y: number } {
    return {
      x: worldX + this.worldContainer.x,
      y: worldY + this.worldContainer.y
    };
  }

  /**
   * Setup basic camera controls (simplified)
   */
  private setupBasicCameraControls(): void {
    if (!this.app) return;

    const canvas = this.app.view as HTMLCanvasElement;

    // Add mouse wheel zoom
    canvas.addEventListener('wheel', (event: WheelEvent) => {
      event.preventDefault();

      const currentScale = this.worldContainer.scale.x;
      let zoomDirection;

      // Use different zoom speeds for different zoom levels
      if (currentScale > 0.01) {
        zoomDirection = event.deltaY > 0 ? -0.1 : 0.1; // Normal zoom speed
      } else {
        zoomDirection = event.deltaY > 0 ? -0.001 : 0.001; // Fine zoom speed for extreme levels
      }

      const newScale = Math.max(0.0001, Math.min(4.0, currentScale + zoomDirection));

      this.worldContainer.scale.set(newScale);
      console.log(`🔍 Zoom: ${newScale.toFixed(4)}x`);

      // Show/hide biome map based on zoom level (much more zoomed out)
      if (newScale <= 0.001) {
        console.log('🌍 INFINITE BIOME MAP ACTIVE - Continental Overview');
        console.log(`📐 At ${newScale.toFixed(4)}x zoom, each 512px chunk appears as ${(512 * newScale).toFixed(2)}px on screen`);
        this.showInfiniteBiomeMap();
      } else if (newScale <= 0.01) {
        console.log('🗺️ Regional overview - zoom out more for biome map');
        this.hideInfiniteBiomeMap();
      } else {
        console.log('🏘️ Detailed view - keep zooming out for biome map');
        this.hideInfiniteBiomeMap();
      }
    });

    // Add keyboard controls
    const keys: Record<string, boolean> = {};
    const moveSpeed = 10;

    document.addEventListener('keydown', (event) => {
      keys[event.key.toLowerCase()] = true;

      // Quick zoom shortcuts for testing
      if (event.key === '1') {
        this.setZoomScale(1.0);
        console.log('🔍 Quick zoom: Normal view (1.0x)');
      } else if (event.key === '2') {
        this.setZoomScale(0.1);
        console.log('🔍 Quick zoom: Area view (0.1x)');
      } else if (event.key === '3') {
        this.setZoomScale(0.01);
        console.log('🔍 Quick zoom: Regional view (0.01x)');
      } else if (event.key === '4') {
        this.setZoomScale(0.001);
        console.log('🔍 Quick zoom: BIOME MAP VIEW (0.001x)');
      } else if (event.key === '5') {
        this.setZoomScale(0.0001);
        console.log('🔍 Quick zoom: Continental view (0.0001x)');
      }
    });

    document.addEventListener('keyup', (event) => {
      keys[event.key.toLowerCase()] = false;
    });

    const updateMovement = () => {
      if (!this.worldContainer) return;

      let deltaX = 0;
      let deltaY = 0;

      if (keys['w'] || keys['arrowup']) deltaY += moveSpeed;
      if (keys['s'] || keys['arrowdown']) deltaY -= moveSpeed;
      if (keys['a'] || keys['arrowleft']) deltaX += moveSpeed;
      if (keys['d'] || keys['arrowright']) deltaX -= moveSpeed;

      if (deltaX !== 0 || deltaY !== 0) {
        this.worldContainer.x += deltaX;
        this.worldContainer.y += deltaY;
      }

      requestAnimationFrame(updateMovement);
    };

    updateMovement();
    console.log('✅ Enhanced camera controls enabled:');
    console.log('   🖱️ Mouse wheel: Zoom in/out (0.0001x to 4.0x)');
    console.log('   ⌨️ WASD/Arrow keys: Camera movement');
    console.log('   🔢 Number keys: Quick zoom (1=1.0x, 2=0.1x, 3=0.01x, 4=0.001x BIOME MAP, 5=0.0001x)');
    console.log('   🌍 Biome map appears at 0.001x zoom level');
  }

  /**
   * Setup infinite biome map system using ChunkService
   */
  private setupBasicBiomeMap(): void {
    console.log('🗺️ Setting up infinite biome map system...');

    // Initialize seed service for consistent generation
    this.seedService.setSeed('biome-map-seed');

    // Create biome graphics container for infinite rendering
    this.biomeGraphics = new Graphics();

    // Add biome graphics directly to stage (not world container) for screen coordinates
    this.biomeGraphics.zIndex = 10000; // Put it way on top for debugging
    this.biomeGraphics.visible = false; // Start hidden
    this.biomeGraphics.alpha = 1.0; // Ensure full opacity

    // Add to stage instead of world container to avoid zoom scaling
    this.app.stage.addChild(this.biomeGraphics);

    // Sort children by z-index to ensure proper layering
    this.app.stage.sortChildren();

    console.log('📦 Biome graphics added to stage (not world container):', {
      stageChildrenCount: this.app.stage.children.length,
      biomeGraphicsIndex: this.app.stage.children.indexOf(this.biomeGraphics),
      biomeGraphicsZIndex: this.biomeGraphics.zIndex,
      stageVisible: this.app.stage.visible,
      stageAlpha: this.app.stage.alpha
    });

    console.log('✅ Infinite biome map system ready (initially hidden)');
  }

  /**
   * Show infinite biome map based on current camera position
   */
  private async showInfiniteBiomeMap(): Promise<void> {
    console.log('🎯 showInfiniteBiomeMap called');

    if (this.biomeMapVisible) {
      // Update existing biome map if camera moved significantly
      console.log('🔄 Updating existing biome map');
      await this.updateInfiniteBiomeMap();
      return;
    }

    console.log('🆕 Creating new biome map');
    this.biomeMapVisible = true;

    if (this.biomeGraphics) {
      this.biomeGraphics.visible = true;
      console.log('✅ Biome graphics set to visible');
      await this.renderInfiniteBiomeMap();
    } else {
      console.error('❌ biomeGraphics is null!');
    }
  }

  /**
   * Hide infinite biome map
   */
  private hideInfiniteBiomeMap(): void {
    this.biomeMapVisible = false;
    if (this.biomeGraphics) {
      this.biomeGraphics.visible = false;
      this.biomeGraphics.clear(); // Clear to save memory
    }
  }

  /**
   * Render infinite biome map using ChunkService
   */
  private async renderInfiniteBiomeMap(): Promise<void> {
    if (!this.biomeGraphics || !this.worldContainer) {
      console.error('❌ Missing required objects:', {
        biomeGraphics: !!this.biomeGraphics,
        worldContainer: !!this.worldContainer
      });
      return;
    }

    console.log('🌍 Rendering infinite biome map...');
    console.log('📊 Container info:', {
      worldContainerChildren: this.worldContainer.children.length,
      biomeGraphicsVisible: this.biomeGraphics.visible,
      biomeGraphicsAlpha: this.biomeGraphics.alpha,
      biomeGraphicsZIndex: this.biomeGraphics.zIndex
    });

    // Clear existing graphics
    this.biomeGraphics.clear();

    // Get current camera position in world coordinates
    const cameraX = -this.worldContainer.x;
    const cameraY = -this.worldContainer.y;
    const scale = this.worldContainer.scale.x;

    console.log('📍 Camera debug info:', {
      worldContainerX: this.worldContainer.x,
      worldContainerY: this.worldContainer.y,
      cameraWorldX: cameraX,
      cameraWorldY: cameraY,
      scale: scale,
      screenSize: { width: this.app.screen.width, height: this.app.screen.height }
    });

    // SIMPLIFIED: At extreme zoom out, just load a small grid around camera
    // Since the tilemap fits in one chunk, we only need a few chunks for biome overview
    const tilesX = 5; // Just 5x5 = 25 chunks total
    const tilesY = 5;

    console.log(`📐 SIMPLIFIED: Loading only ${tilesX}x${tilesY} = ${tilesX * tilesY} chunks`);
    console.log(`📐 Scale: ${scale.toFixed(4)}x, Camera: (${cameraX.toFixed(0)}, ${cameraY.toFixed(0)})`);

    const biomeTileSize = 512; // Each chunk is 512x512 world units
    const startX = Math.floor(cameraX / biomeTileSize) - Math.floor(tilesX / 2);
    const startY = Math.floor(cameraY / biomeTileSize) - Math.floor(tilesY / 2);
    const endX = startX + tilesX;
    const endY = startY + tilesY;

    // Biome color mapping
    const biomeColors: Record<string, number> = {
      'ocean': 0x0066CC,
      'water': 0x4488DD,
      'beach': 0xF4E4BC,
      'grassland': 0x90EE90,
      'forest': 0x228B22,
      'woodland': 0x32A032,
      'taiga': 0x2F5F2F,
      'tundra': 0xE6E6FA,
      'desert': 0xF4A460,
      'rock': 0xB0B0B0,
      'alpine': 0xC0C0C0,
      'alpine grassland': 0x8FBC8F,
      'rainforest': 0x006400
    };

    console.log(`🌍 Rendering ${tilesX}x${tilesY} biome chunks (ONLY ${tilesX * tilesY} total!)`);

    // Add test graphics in SCREEN coordinates (not world coordinates)
    console.log('🧪 Adding test graphics in SCREEN coordinates...');

    const screenWidth = this.app.screen.width;
    const screenHeight = this.app.screen.height;

    // Test 1: Red square at top-left
    this.biomeGraphics.beginFill(0xFF0000, 1.0);
    this.biomeGraphics.drawRect(50, 50, 200, 200);
    this.biomeGraphics.endFill();

    // Test 2: Green square at top-right
    this.biomeGraphics.beginFill(0x00FF00, 1.0);
    this.biomeGraphics.drawRect(screenWidth - 250, 50, 200, 200);
    this.biomeGraphics.endFill();

    // Test 3: Blue square at bottom-center
    this.biomeGraphics.beginFill(0x0000FF, 1.0);
    this.biomeGraphics.drawRect(screenWidth / 2 - 100, screenHeight - 250, 200, 200);
    this.biomeGraphics.endFill();

    console.log('🔴🟢🔵 Added 3 test squares in SCREEN coordinates (200x200 each)');

    let tilesRendered = 0;
    let tilesWithData = 0;
    let tilesFailed = 0;

    // Render biome tiles using chunk data (limited number)
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const worldX = x * biomeTileSize;
        const worldY = y * biomeTileSize;
        tilesRendered++;

        // Convert world coordinates to screen coordinates
        const screenX = (worldX + this.worldContainer.x) * this.worldContainer.scale.x;
        const screenY = (worldY + this.worldContainer.y) * this.worldContainer.scale.x;
        const screenSize = biomeTileSize * this.worldContainer.scale.x;

        // Make sure screen size is at least 10 pixels for visibility
        const minScreenSize = 20;
        const visibleSize = Math.max(screenSize, minScreenSize);

        // Render placeholder in screen coordinates
        this.biomeGraphics.beginFill(0x404040, 0.8); // Dark gray loading
        this.biomeGraphics.drawRect(screenX, screenY, visibleSize, visibleSize);
        this.biomeGraphics.endFill();

        // Add thick border for visibility
        this.biomeGraphics.lineStyle(2, 0xFFFF00, 1.0); // Yellow border
        this.biomeGraphics.drawRect(screenX, screenY, visibleSize, visibleSize);
        this.biomeGraphics.lineStyle(0);

        console.log(`📦 Chunk at world (${worldX}, ${worldY}) -> screen (${screenX.toFixed(1)}, ${screenY.toFixed(1)}) size ${visibleSize}px`);

        // Load chunk data asynchronously and update
        this.loadAndRenderChunkTile(worldX, worldY, biomeTileSize, biomeColors, screenX, screenY, visibleSize).then((success) => {
          if (success) {
            tilesWithData++;
          } else {
            tilesFailed++;
          }

          // Force render update after each tile
          if (this.app) {
            this.app.render();
            console.log(`🔄 Rendered chunk ${tilesWithData + tilesFailed}/${tilesX * tilesY}`);
          }

          // Log graphics state after a few chunks
          if ((tilesWithData + tilesFailed) === 5) {
            console.log('🔍 Graphics state after 5 chunks:', {
              biomeGraphicsVisible: this.biomeGraphics.visible,
              biomeGraphicsBounds: this.biomeGraphics.getBounds(),
              worldContainerBounds: this.worldContainer.getBounds()
            });
          }
        });
      }
    }

    // Force immediate render and check visibility
    console.log('🔍 Checking graphics state before render:', {
      biomeGraphicsVisible: this.biomeGraphics.visible,
      biomeGraphicsAlpha: this.biomeGraphics.alpha,
      biomeGraphicsChildren: this.biomeGraphics.children.length,
      worldContainerScale: this.worldContainer.scale.x,
      worldContainerPosition: { x: this.worldContainer.x, y: this.worldContainer.y }
    });

    if (this.app) {
      this.app.render();
      console.log('🔄 Forced immediate render of placeholders and test graphics');

      // Force another render after a brief delay
      setTimeout(() => {
        this.app.render();
        console.log('🔄 Forced delayed render');
      }, 100);
    }

    // Store current camera position for update checks
    this.lastCameraX = cameraX;
    this.lastCameraY = cameraY;
    this.lastZoomLevel = scale;

    console.log(`✅ Biome map initial rendering complete:`);
    console.log(`   📐 Grid: ${tilesX}x${tilesY} chunks (ONLY ${tilesX * tilesY} total!)`);
    console.log(`   📊 Placeholders: ${tilesRendered} rendered`);
    console.log(`   📍 Camera: (${cameraX.toFixed(0)}, ${cameraY.toFixed(0)}) scale: ${scale.toFixed(4)}x`);
    console.log(`   🎨 Graphics: visible=${this.biomeGraphics.visible}, alpha=${this.biomeGraphics.alpha}`);
    console.log(`   🔄 Loading ONLY ${tilesX * tilesY} chunks asynchronously...`);

    const totalTiles = tilesX * tilesY;
    console.log(`📊 Expected to load ONLY ${totalTiles} chunks total (not thousands!)`);

    // No progress tracking needed for such small numbers
    if (totalTiles <= 25) {
      console.log('📊 Small chunk count - no progress tracking needed');
    }
  }

  /**
   * Generate fallback biome when chunk loading fails
   */
  private generateFallbackBiome(worldX: number, worldY: number): string {
    // Simple procedural biome generation for fallback
    const noise = this.seedService.getNoise();
    const scale = 0.001;
    const elevation = (noise(worldX * scale, worldY * scale) + 1) / 2;
    const moisture = (noise(worldX * scale * 1.3, worldY * scale * 1.3) + 1) / 2;
    const temperature = (noise(worldX * scale * 0.7, worldY * scale * 0.7) + 1) / 2;

    // Simple biome classification
    if (elevation < 0.2) return 'ocean';
    if (elevation < 0.25) return 'water';
    if (elevation < 0.3) return 'beach';
    if (elevation > 0.8) return 'rock';
    if (elevation > 0.6) return temperature < 0.3 ? 'tundra' : 'alpine';

    if (temperature < 0.3) return moisture > 0.5 ? 'taiga' : 'tundra';
    if (temperature > 0.7) return moisture > 0.5 ? 'rainforest' : 'desert';

    if (moisture < 0.3) return 'grassland';
    if (moisture > 0.7) return 'forest';

    return 'woodland';
  }

  /**
   * Load and render individual chunk tile
   */
  private async loadAndRenderChunkTile(
    worldX: number,
    worldY: number,
    tileSize: number,
    biomeColors: Record<string, number>,
    screenX: number,
    screenY: number,
    screenSize: number
  ): Promise<boolean> {
    try {
      // Sample the center of the chunk
      const sampleX = worldX + tileSize / 2;
      const sampleY = worldY + tileSize / 2;

      console.log(`🔍 Loading chunk ${worldX/512}, ${worldY/512} at world (${worldX}, ${worldY})`);
      const tileData = await this.chunkService.getTile(sampleX, sampleY);

      if (tileData && tileData.biome) {
        const biomeColor = biomeColors[tileData.biome] || 0x808080;
        console.log(`✅ Loaded chunk: ${tileData.biome} -> color: 0x${biomeColor.toString(16)}`);

        // Draw the actual biome in screen coordinates
        this.biomeGraphics.beginFill(biomeColor, 0.9);
        this.biomeGraphics.drawRect(screenX, screenY, screenSize, screenSize);
        this.biomeGraphics.endFill();

        // Add thick colored border for visibility
        this.biomeGraphics.lineStyle(2, 0x000000, 1.0);
        this.biomeGraphics.drawRect(screenX, screenY, screenSize, screenSize);
        this.biomeGraphics.lineStyle(0);

        return true;
      } else {
        console.log(`⚠️ No biome data for chunk at (${worldX}, ${worldY})`);
        // Use fallback
        const fallbackBiome = this.generateFallbackBiome(worldX, worldY);
        const fallbackColor = biomeColors[fallbackBiome] || 0x808080;

        this.biomeGraphics.beginFill(fallbackColor, 0.7);
        this.biomeGraphics.drawRect(worldX, worldY, tileSize, tileSize);
        this.biomeGraphics.endFill();

        return false;
      }
    } catch (error) {
      console.error(`❌ Failed to load chunk at (${worldX}, ${worldY}):`, error);

      // Use fallback for failed chunks
      const fallbackBiome = this.generateFallbackBiome(worldX, worldY);
      const fallbackColor = biomeColors[fallbackBiome] || 0x808080;

      this.biomeGraphics.beginFill(fallbackColor, 0.6);
      this.biomeGraphics.drawRect(worldX, worldY, tileSize, tileSize);
      this.biomeGraphics.endFill();

      return false;
    }
  }

  /**
   * Update infinite biome map if camera moved significantly
   */
  private async updateInfiniteBiomeMap(): Promise<void> {
    if (!this.worldContainer) return;

    const cameraX = -this.worldContainer.x;
    const cameraY = -this.worldContainer.y;
    const scale = this.worldContainer.scale.x;

    // Check if camera moved significantly (more than one chunk)
    const moveThreshold = 512; // One chunk size
    const deltaX = Math.abs(cameraX - this.lastCameraX);
    const deltaY = Math.abs(cameraY - this.lastCameraY);

    if (deltaX > moveThreshold || deltaY > moveThreshold || scale !== this.lastZoomLevel) {
      console.log(`🔄 Camera moved significantly: Δx=${deltaX.toFixed(0)}, Δy=${deltaY.toFixed(0)}`);
      await this.renderInfiniteBiomeMap();
    }
  }

  /**
   * Generate elevation using noise (simplified version of existing elevation generation)
   */
  private generateElevation(x: number, y: number): number {
    const noise = this.seedService.getNoise();

    // Multiple octaves of noise for realistic terrain
    const scale1 = 0.005; // Large features
    const scale2 = 0.01;  // Medium features
    const scale3 = 0.02;  // Small features

    let elevation = 0;
    elevation += noise(x * scale1, y * scale1) * 0.5;
    elevation += noise(x * scale2, y * scale2) * 0.3;
    elevation += noise(x * scale3, y * scale3) * 0.2;

    // Normalize to 0-1 range
    elevation = (elevation + 1) / 2;

    // Add distance-based falloff for island-like generation
    const centerX = 0;
    const centerY = 0;
    const maxDistance = 2000;
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    const falloff = Math.max(0, 1 - (distance / maxDistance));

    elevation *= falloff;

    return Math.max(0, Math.min(1, elevation));
  }

  /**
   * Setup zoom level change listener (simplified)
   */
  private setupZoomLevelListener(): void {
    document.addEventListener('zoomLevelChanged', (event: any) => {
      const { newLevel, scale } = event.detail;
      console.log(`🔍 Zoom level changed to: ${newLevel.name} (${scale.toFixed(2)}x)`);

      // Update biome map visibility
      this.biomeMapRenderer.updateForZoomLevel(newLevel);

      // Update other rendering systems based on zoom level
      this.updateRenderingForZoomLevel(newLevel);
    });
  }

  /**
   * Update rendering systems based on zoom level
   */
  private updateRenderingForZoomLevel(zoomLevel: any): void {
    // Show/hide settlements based on zoom level
    if (zoomLevel.showSettlements) {
      // Enable settlement rendering
      console.log('🏘️ Showing settlements');
    } else {
      // Hide settlement details
      console.log('🏘️ Hiding settlement details');
    }

    // Show/hide detailed elements
    if (zoomLevel.showDetails) {
      // Enable detailed rendering (characters, small objects)
      console.log('🔍 Showing detailed elements');
    } else {
      // Hide detailed elements for performance
      console.log('🔍 Hiding detailed elements');
    }
  }

  /**
   * Get current camera state
   */
  getCameraState(): any {
    return this.cameraControls.getCameraState();
  }

  /**
   * Get current zoom level
   */
  getCurrentZoomLevel(): any {
    return this.cameraControls.getCurrentZoomLevel();
  }

  /**
   * Test biome graphics rendering (for debugging)
   */
  testBiomeGraphics(): void {
    console.log('🧪 Testing biome graphics rendering...');

    if (!this.biomeGraphics) {
      console.error('❌ biomeGraphics is null');
      return;
    }

    // Clear and add multiple test rectangles
    this.biomeGraphics.clear();

    // Add multiple colored rectangles for visibility test
    const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF];
    for (let i = 0; i < colors.length; i++) {
      const x = (i % 3) * 300 - 300;
      const y = Math.floor(i / 3) * 300 - 150;

      this.biomeGraphics.beginFill(colors[i], 1.0);
      this.biomeGraphics.drawRect(x, y, 250, 250);
      this.biomeGraphics.endFill();

      // Add white border
      this.biomeGraphics.lineStyle(3, 0xFFFFFF, 1.0);
      this.biomeGraphics.drawRect(x, y, 250, 250);
      this.biomeGraphics.lineStyle(0);
    }

    this.biomeGraphics.visible = true;
    this.biomeGraphics.alpha = 1.0;

    console.log('✅ Test rectangles added:', {
      visible: this.biomeGraphics.visible,
      alpha: this.biomeGraphics.alpha,
      worldContainerChildren: this.worldContainer.children.length,
      biomeGraphicsInContainer: this.worldContainer.children.includes(this.biomeGraphics)
    });

    // Force render
    if (this.app) {
      this.app.render();
      console.log('🔄 Forced render update');
    }
  }

  /**
   * Toggle biome map visibility
   */
  toggleBiomeMap(): void {
    if (this.biomeGraphics) {
      this.biomeGraphics.visible = !this.biomeGraphics.visible;
      console.log(`🗺️ Biome map ${this.biomeGraphics.visible ? 'shown' : 'hidden'}`);
    }
  }

  /**
   * Get current zoom scale
   */
  getCurrentZoomScale(): number {
    return this.worldContainer ? this.worldContainer.scale.x : 1.0;
  }

  /**
   * Set zoom scale
   */
  setZoomScale(scale: number): void {
    if (this.worldContainer) {
      const clampedScale = Math.max(0.0001, Math.min(4.0, scale));
      this.worldContainer.scale.set(clampedScale);

      // Update biome map visibility
      if (clampedScale <= 0.001) {
        console.log('🗺️ Showing infinite biome overview');
        this.showInfiniteBiomeMap();
      } else {
        console.log('🏘️ Showing detailed view');
        this.hideInfiniteBiomeMap();
      }

      console.log(`🔍 Zoom set to: ${clampedScale.toFixed(2)}x`);
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.cityRenderer.getRenderedCities().clear();
    this.tradeRouteRenderer.getRenderedRoutes().clear();
    this.particleEffects.getParticleSystems().clear();
    this.uiOverlayRenderer.destroy();
    this.app.destroy(true);
  }
}
