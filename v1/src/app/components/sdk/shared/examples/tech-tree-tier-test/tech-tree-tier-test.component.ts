import { Component, OnInit } from '@angular/core';
import { TechNode, TechTreeCanvasConfig } from '../../tech-tree';

@Component({
  selector: 'app-tech-tree-tier-test',
  templateUrl: './tech-tree-tier-test.component.html',
  styleUrls: ['./tech-tree-tier-test.component.scss']
})
export class TechTreeTierTestComponent implements OnInit {
  techTreeConfig: TechTreeCanvasConfig = {
    zoomMin: 0.25,
    zoomMax: 3.0,
    zoomStep: 0.1,
    initialZoom: 1.0,
    nodeSpacing: { x: 200, y: 150 },
    gridSize: 20,
    tierBandHeight: 160,
    tierBandOpacity: 0.05,
    enableTierBands: true,
    enableSnapToTier: true
  };

  currentZoom = 1.0;
  selectedTech: TechNode | null = null;
  testLogs: string[] = [];

  // Comprehensive test data with different tier configurations
  testTechTrees: { [key: string]: TechNode[] } = {
    'basic-tree': [
      {
        id: 'tech-1',
        name: 'Basic Technology',
        description: 'A basic starting technology',
        tier: 1,
        cost: 50,
        prerequisites: [],
        effects: ['Basic benefit'],
        cultureTags: ['general'],
        position: { x: 0, y: 0 },
        isUnlocked: true,
        isDiscovered: true,
        isResearched: false,
        isResearching: false
      },
      {
        id: 'tech-2',
        name: 'Tier 2 Tech',
        description: 'A second tier technology',
        tier: 2,
        cost: 100,
        prerequisites: ['tech-1'],
        effects: ['Advanced benefit'],
        cultureTags: ['advanced'],
        position: { x: 0, y: 160 },
        isUnlocked: false,
        isDiscovered: false,
        isResearched: false,
        isResearching: false
      },
      {
        id: 'tech-3',
        name: 'Tier 3 Tech',
        description: 'A third tier technology',
        tier: 3,
        cost: 200,
        prerequisites: ['tech-2'],
        effects: ['Master benefit'],
        cultureTags: ['master'],
        position: { x: 0, y: 320 },
        isUnlocked: false,
        isDiscovered: false,
        isResearched: false,
        isResearching: false
      }
    ],
    'sparse-tree': [
      {
        id: 'sparse-1',
        name: 'Sparse Tier 1',
        description: 'Only one tech in tier 1',
        tier: 1,
        cost: 50,
        prerequisites: [],
        effects: ['Basic benefit'],
        cultureTags: ['general'],
        position: { x: 0, y: 0 },
        isUnlocked: true,
        isDiscovered: true,
        isResearched: false,
        isResearching: false
      },
      {
        id: 'sparse-5',
        name: 'Empty Tiers Demo',
        description: 'Tech in tier 5 with empty tiers in between',
        tier: 5,
        cost: 500,
        prerequisites: [],
        effects: ['Late game benefit'],
        cultureTags: ['late'],
        position: { x: 0, y: 640 },
        isUnlocked: false,
        isDiscovered: false,
        isResearched: false,
        isResearching: false
      }
    ],
    'dense-tree': [
      {
        id: 'dense-1a',
        name: 'Dense Tier 1-A',
        description: 'First tech in dense tier 1',
        tier: 1,
        cost: 50,
        prerequisites: [],
        effects: ['Basic benefit A'],
        cultureTags: ['general'],
        position: { x: 0, y: 0 },
        isUnlocked: true,
        isDiscovered: true,
        isResearched: false,
        isResearching: false
      },
      {
        id: 'dense-1b',
        name: 'Dense Tier 1-B',
        description: 'Second tech in dense tier 1',
        tier: 1,
        cost: 50,
        prerequisites: [],
        effects: ['Basic benefit B'],
        cultureTags: ['general'],
        position: { x: 200, y: 0 },
        isUnlocked: true,
        isDiscovered: true,
        isResearched: false,
        isResearching: false
      },
      {
        id: 'dense-1c',
        name: 'Dense Tier 1-C',
        description: 'Third tech in dense tier 1',
        tier: 1,
        cost: 50,
        prerequisites: [],
        effects: ['Basic benefit C'],
        cultureTags: ['general'],
        position: { x: 400, y: 0 },
        isUnlocked: true,
        isDiscovered: true,
        isResearched: false,
        isResearching: false
      },
      {
        id: 'dense-2a',
        name: 'Dense Tier 2-A',
        description: 'First tech in dense tier 2',
        tier: 2,
        cost: 100,
        prerequisites: ['dense-1a'],
        effects: ['Advanced benefit A'],
        cultureTags: ['advanced'],
        position: { x: 0, y: 160 },
        isUnlocked: false,
        isDiscovered: false,
        isResearched: false,
        isResearching: false
      },
      {
        id: 'dense-2b',
        name: 'Dense Tier 2-B',
        description: 'Second tech in dense tier 2',
        tier: 2,
        cost: 100,
        prerequisites: ['dense-1b'],
        effects: ['Advanced benefit B'],
        cultureTags: ['advanced'],
        position: { x: 200, y: 160 },
        isUnlocked: false,
        isDiscovered: false,
        isResearched: false,
        isResearching: false
      }
    ]
  };

  currentTreeKey = 'basic-tree';
  currentNodes: TechNode[] = [];

  ngOnInit(): void {
    this.loadTree(this.currentTreeKey);
    this.logTest('Test component initialized');
  }

  loadTree(treeKey: string): void {
    this.currentTreeKey = treeKey;
    this.currentNodes = [...this.testTechTrees[treeKey]];
    this.logTest(`Loaded tree: ${treeKey} with ${this.currentNodes.length} nodes`);
  }

  onNodeSelected(node: TechNode): void {
    this.selectedTech = node;
    this.logTest(`Node selected: ${node.name} (Tier ${node.tier})`);
  }

  onNodeFocused(node: TechNode): void {
    this.logTest(`Node focused: ${node.name} (Tier ${node.tier})`);
  }

  onZoomChanged(zoom: number): void {
    this.currentZoom = zoom;
    this.logTest(`Zoom changed to: ${zoom}`);
  }

  // Test tier management functionality
  addTestTier(): void {
    const maxTier = Math.max(...this.currentNodes.map(n => n.tier));
    const newTier = maxTier + 1;
    
    const newNode: TechNode = {
      id: `test-tier-${newTier}`,
      name: `Test Tier ${newTier} Node`,
      description: `A test node in the newly created tier ${newTier}`,
      tier: newTier,
      cost: 100 * newTier,
      prerequisites: this.currentNodes.filter(n => n.tier === newTier - 1).map(n => n.id),
      effects: [`Tier ${newTier} benefit`],
      cultureTags: ['test'],
      position: { x: 0, y: (newTier - 1) * 160 },
      isUnlocked: false,
      isDiscovered: false,
      isResearched: false,
      isResearching: false
    };
    
    this.currentNodes.push(newNode);
    this.logTest(`Added new tier ${newTier} with node: ${newNode.name}`);
  }

  testSnapToTier(): void {
    const testYPositions = [50, 100, 150, 200, 250, 300];
    const tierBandHeight = this.techTreeConfig.tierBandHeight;
    
    testYPositions.forEach(yPos => {
      const expectedTier = Math.round(yPos / tierBandHeight) + 1;
      this.logTest(`Y position ${yPos}px should snap to Tier ${expectedTier}`);
    });
  }

  validateTierConsistency(): void {
    const tiers = [...new Set(this.currentNodes.map(n => n.tier))].sort((a, b) => a - b);
    const expectedTiers = Array.from({ length: Math.max(...tiers) }, (_, i) => i + 1);
    
    const missingTiers = expectedTiers.filter(tier => !tiers.includes(tier));
    const hasGaps = missingTiers.length > 0;
    
    this.logTest(`Tier consistency check:`);
    this.logTest(`  Found tiers: ${tiers.join(', ')}`);
    this.logTest(`  Expected continuous tiers: ${expectedTiers.join(', ')}`);
    this.logTest(`  Has gaps: ${hasGaps ? 'YES' : 'NO'}`);
    if (hasGaps) {
      this.logTest(`  Missing tiers: ${missingTiers.join(', ')}`);
    }
  }

  testZoomLevels(): void {
    const testZooms = [0.25, 0.5, 1.0, 1.5, 2.0, 3.0];
    
    testZooms.forEach(zoom => {
      this.logTest(`Testing zoom level ${zoom}:`);
      
      // Calculate effective tier band height at this zoom
      const effectiveBandHeight = this.techTreeConfig.tierBandHeight * zoom;
      this.logTest(`  Effective tier band height: ${effectiveBandHeight}px`);
      
      // Calculate if tier labels would be readable
      const labelReadable = zoom >= 0.5;
      this.logTest(`  Tier labels readable: ${labelReadable ? 'YES' : 'NO'}`);
      
      // Calculate if band borders would be visible
      const bordersVisible = zoom >= 0.3;
      this.logTest(`  Band borders visible: ${bordersVisible ? 'YES' : 'NO'}`);
    });
  }

  private logTest(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.testLogs.unshift(`[${timestamp}] ${message}`);
    
    // Keep only last 50 logs
    if (this.testLogs.length > 50) {
      this.testLogs = this.testLogs.slice(0, 50);
    }
  }

  clearLogs(): void {
    this.testLogs = [];
  }

  exportTestResults(): string {
    const results = {
      timestamp: new Date().toISOString(),
      treeType: this.currentTreeKey,
      nodeCount: this.currentNodes.length,
      tiers: [...new Set(this.currentNodes.map(n => n.tier))].sort((a, b) => a - b),
      logs: [...this.testLogs]
    };
    
    return JSON.stringify(results, null, 2);
  }

  trackByTreeKey(index: number, treeKey: string): string {
    return treeKey;
  }

  trackByLogIndex(index: number, log: string): number {
    return index;
  }
}