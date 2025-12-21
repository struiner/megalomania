import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechTreeCanvasComponent } from './tech-tree-canvas.component';
import { VirtualScrollComponent } from './virtual-scroll.component';
import { ConnectionOverlayComponent } from './connection-overlay.component';
import { PerformanceMonitorComponent } from './performance-monitor.component';
import { TechTreeVirtualizationService } from './tech-tree-virtualization.service';
import { TechNode } from './tech-node.interface';

describe('Performance Virtualization Integration', () => {
  let component: TechTreeCanvasComponent;
  let fixture: ComponentFixture<TechTreeCanvasComponent>;
  let virtualizationService: TechTreeVirtualizationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TechTreeCanvasComponent,
        VirtualScrollComponent,
        ConnectionOverlayComponent,
        PerformanceMonitorComponent
      ],
      providers: [TechTreeVirtualizationService]
    }).compileComponents();

    fixture = TestBed.createComponent(TechTreeCanvasComponent);
    component = fixture.componentInstance;
    virtualizationService = TestBed.inject(TechTreeVirtualizationService);
  });

  describe('P1-15 Acceptance Criteria Validation', () => {
    
    describe('Maintains smooth performance with 100+ nodes at all zoom levels', () => {
      
      it('should handle 100 nodes at minimum zoom without frame rate dropping below 30fps', (done) => {
        // Arrange
        const largeNodeSet = createTestNodes(100);
        component.nodes = largeNodeSet;
        component.config.zoomMin = 0.25;
        component.setZoomForTesting(0.25);
        
        // Act & Measure
        const startTime = performance.now();
        component.updateVirtualNodesForTesting();
        
        // Allow rendering to complete
        setTimeout(() => {
          const metrics = component.getPerformanceMetrics();
          
          // Assert
          expect(metrics.frameRate).toBeGreaterThanOrEqual(30);
          expect(metrics.renderTime).toBeLessThan(33); // 33ms = 30fps
          done();
        }, 100);
      });

      it('should handle 150 nodes at maximum zoom efficiently', (done) => {
        // Arrange
        const veryLargeNodeSet = createTestNodes(150);
        component.nodes = veryLargeNodeSet;
        component.setZoomForTesting(3.0);
        
        // Act
        const startTime = performance.now();
        component.updateVirtualNodesForTesting();
        const endTime = performance.now();
        
        // Assert
        expect(endTime - startTime).toBeLessThan(100); // Should render within 100ms
        done();
      });
    });

    describe('Viewport-based rendering prevents unnecessary DOM operations', () => {
      
      it('should only render nodes visible in viewport with buffer zone', () => {
        // Arrange
        const nodes = createTestNodes(50);
        component.nodes = nodes;
        component.updateVirtualNodesForTesting();
        
        // Act
        const visibleNodes = component.getVirtualNodes();
        
        // Assert
        // Should be significantly less than total nodes due to virtualization
        expect(visibleNodes.length).toBeLessThan(nodes.length);
        expect(visibleNodes.length).toBeGreaterThan(0);
      });

      it('should not render nodes outside viewport even with large dataset', () => {
        // Arrange
        const nodes = createTestNodes(1000);
        component.nodes = nodes;
        component.panPosition = { x: 0, y: 0 }; // Start at origin
        component.updateVirtualNodesForTesting();
        
        // Act
        const visibleNodes = component.getVirtualNodes();
        
        // Assert - should only show a small fraction of nodes
        expect(visibleNodes.length).toBeLessThan(100);
      });
    });

    describe('Connection caching improves interaction responsiveness', () => {
      
      it('should cache connection paths for faster subsequent rendering', () => {
        // Arrange
        const nodes = createTestNodesWithConnections(20);
        component.nodes = nodes;
        
        // Act - First render (uncached)
        const startTime1 = performance.now();
        component.generateConnectionsForTesting();
        const renderTime1 = performance.now() - startTime1;
        
        // Act - Second render (should use cache)
        const startTime2 = performance.now();
        component.generateConnectionsForTesting();
        const renderTime2 = performance.now() - startTime2;
        
        // Assert - Second render should be faster
        expect(renderTime2).toBeLessThan(renderTime1);
      });

      it('should only render connections between visible nodes', () => {
        // Arrange
        const nodes = createTestNodesWithConnections(50);
        component.nodes = nodes;
        component.updateVirtualNodesForTesting();
        
        // Act
        const visibleConnections = component.getVisibleConnections();
        const visibleNodeIds = new Set(component.getVirtualNodes().map(n => n.id));
        
        // Assert - All connections should be between visible nodes
        visibleConnections.forEach(connection => {
          expect(visibleNodeIds.has(connection.fromNodeId)).toBe(true);
          expect(visibleNodeIds.has(connection.toNodeId)).toBe(true);
        });
      });
    });

    describe('Performance Baseline Establishment', () => {
      
      it('should establish baseline metrics for small datasets', () => {
        // Arrange
        const smallDataset = createTestNodes(10);
        component.nodes = smallDataset;
        
        // Act
        component.updateVirtualNodesForTesting();
        const metrics = component.getPerformanceMetrics();
        
        // Establish baseline expectations
        expect(metrics.frameRate).toBeGreaterThanOrEqual(55); // Near 60fps for small datasets
        expect(metrics.renderTime).toBeLessThan(10); // Very fast rendering
        expect(metrics.nodeCount).toBe(10);
        expect(metrics.visibleNodeCount).toBeLessThanOrEqual(10);
      });

      it('should establish baseline metrics for large datasets', () => {
        // Arrange
        const largeDataset = createTestNodes(100);
        component.nodes = largeDataset;
        
        // Act
        component.updateVirtualNodesForTesting();
        const metrics = component.getPerformanceMetrics();
        
        // Establish baseline expectations
        expect(metrics.frameRate).toBeGreaterThanOrEqual(30); // Minimum acceptable performance
        expect(metrics.renderTime).toBeLessThan(33); // 30fps threshold
      });
    });

    describe('Virtualization Configuration and Controls', () => {
      
      it('should allow enabling/disabling virtualization', () => {
        // Act
        component.setVirtualizationEnabled(false);
        
        // Assert
        expect(component.isVirtualizationEnabled()).toBe(false);
        
        // Act
        component.setVirtualizationEnabled(true);
        
        // Assert
        expect(component.isVirtualizationEnabled()).toBe(true);
      });

      it('should maintain functionality when virtualization is disabled', () => {
        // Arrange
        const nodes = createTestNodes(20);
        component.nodes = nodes;
        component.setVirtualizationEnabled(false);
        
        // Act
        const virtualNodes = component.getVirtualNodes();
        
        // Assert - Should return all nodes when virtualization is disabled
        expect(virtualNodes.length).toBe(nodes.length);
      });

      it('should cache and retrieve connection data efficiently', () => {
        // Arrange
        const testConnectionId = 'test-connection-123';
        const testData = { path: 'M 0 0 L 100 100', complexity: 'full' as const };
        
        // Act
        component.cacheConnection(testConnectionId, testData);
        const cachedData = component.getCachedConnection(testConnectionId);
        
        // Assert
        expect(cachedData).toEqual(testData);
      });
    });
  });
});

// Test data generators
function createTestNodes(count: number, prefix: string = 'node'): TechNode[] {
  const nodes: TechNode[] = [];
  
  for (let i = 0; i < count; i++) {
    nodes.push({
      id: `${prefix}-${i}`,
      name: `Tech Node ${i}`,
      description: `Description for tech node ${i}`,
      tier: Math.floor(i / 10) + 1, // Spread across tiers
      cost: 100,
      prerequisites: i > 0 ? [`${prefix}-${i - 1}`] : [],
      effects: [],
      cultureTags: [],
      icon: 'tech-icon.svg',
      position: { x: (i % 10) * 200, y: Math.floor(i / 10) * 150 },
      isUnlocked: i < 5,
      isDiscovered: i < 3,
      isResearching: false,
      isResearched: i < 3
    });
  }
  
  return nodes;
}

function createTestNodesWithConnections(count: number, prefix: string = 'node'): TechNode[] {
  const nodes = createTestNodes(count, prefix);
  
  // Add some prerequisites to create connections
  nodes.forEach((node, index) => {
    if (index > 0 && index % 3 === 0) {
      node.prerequisites = [`${prefix}-${index - 1}`];
    }
  });
  
  return nodes;
}