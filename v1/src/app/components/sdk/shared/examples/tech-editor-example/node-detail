import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeDetailPanelComponent, ValidationMessage } from './node-detail-panel/node-detail-panel.component';

// Example integration showing how to use the Node Detail Panel
// This demonstrates the layout structure without implementing actual form controls

@Component({
  selector: 'app-node-detail-panel-demo',
  standalone: true,
  imports: [CommonModule, NodeDetailPanelComponent],
  template: `
    <div class="demo-container">
      <h2>Node Detail Panel Layout Demo</h2>
      
      <!-- Demo Controls -->
      <div class="demo-controls">
        <button (click)="selectNode('tech1')">Select Technology 1</button>
        <button (click)="selectNode('tech2')">Select Technology 2</button>
        <button (click)="selectNode('tech3')">Select Technology 3</button>
        <button (click)="clearSelection()">Clear Selection</button>
        
        <button (click)="addSampleValidations()">Add Sample Validations</button>
        <button (click)="clearValidations()">Clear Validations</button>
      </div>
      
      <!-- Node Detail Panel Integration -->
      <app-node-detail-panel
        #nodeDetailPanel
        [selectedNode]="selectedNode"
        [isVisible]="!!selectedNode"
        (nodeUpdated)="onNodeUpdated($event)">
      </app-node-detail-panel>
      
      <!-- Demo Info -->
      <div class="demo-info" *ngIf="selectedNode">
        <h3>Selected Node Details:</h3>
        <pre>{{ selectedNode | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 20px;
      font-family: 'Inter', sans-serif;
    }
    
    .demo-controls {
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .demo-controls button {
      padding: 8px 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: #f5f5f5;
      cursor: pointer;
    }
    
    .demo-controls button:hover {
      background: #e0e0e0;
    }
    
    .demo-info {
      margin-top: 20px;
      padding: 16px;
      background: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .demo-info pre {
      background: white;
      padding: 12px;
      border-radius: 4px;
      overflow-x: auto;
    }
  `]
})
export class NodeDetailPanelDemoComponent {
  @ViewChild('nodeDetailPanel') nodeDetailPanel!: NodeDetailPanelComponent;
  
  selectedNode: any = null;
  
  // Sample node data for demonstration
  sampleNodes = {
    tech1: {
      id: 'advanced-farming',
      name: 'Advanced Farming',
      type: 'Agriculture',
      description: 'Unlock modern agricultural techniques',
      tier: 2,
      icon: '🌾'
    },
    tech2: {
      id: 'steam-engine',
      name: 'Steam Engine',
      type: 'Engineering',
      description: 'Harness the power of steam',
      tier: 3,
      icon: '⚙️'
    },
    tech3: {
      id: 'basic-trade',
      name: 'Basic Trade',
      type: 'Economics',
      description: 'Establish fundamental trade routes',
      tier: 1,
      icon: '💰'
    }
  };
  
  selectNode(nodeId: string): void {
    this.selectedNode = this.sampleNodes[nodeId as keyof typeof this.sampleNodes];
    
    // Clear any existing validations when selecting a new node
    setTimeout(() => {
      this.nodeDetailPanel?.clearValidationMessages();
    });
  }
  
  clearSelection(): void {
    this.selectedNode = null;
  }
  
  addSampleValidations(): void {
    if (!this.selectedNode || !this.nodeDetailPanel) return;
    
    // Add some sample validation messages to demonstrate the system
    this.nodeDetailPanel.addGlobalValidationMessage({
      type: 'warning',
      message: 'This technology affects multiple game systems and may need balance review',
      field: 'global'
    });
    
    this.nodeDetailPanel.addValidationMessage('identity', {
      type: 'error',
      message: 'Technology name must be unique across all tiers',
      field: 'name'
    });
    
    this.nodeDetailPanel.addValidationMessage('visual', {
      type: 'warning',
      message: 'Consider using a more distinctive icon for better player recognition',
      field: 'icon'
    });
    
    this.nodeDetailPanel.addValidationMessage('prerequisites', {
      type: 'info',
      message: 'Prerequisite validation will check for circular dependencies',
      field: 'dependencies'
    });
    
    this.nodeDetailPanel.addValidationMessage('effects', {
      type: 'success',
      message: 'Effect configuration appears valid',
      field: 'bonuses'
    });
  }
  
  clearValidations(): void {
    this.nodeDetailPanel?.clearValidationMessages();
  }
  
  onNodeUpdated(node: any): void {
    console.log('Node updated:', node);
    // Handle node updates here
  }
}

// Integration example for the existing tech editor
// This shows how to replace the current simple form with the new sectioned layout

/*
INTEGRATION WITH EXISTING TECH EDITOR EXAMPLE:

1. Update the imports in tech-editor-example.component.ts:
   import { NodeDetailPanelComponent } from './node-detail-panel/node-detail-panel.component';

2. Add the component to the imports array:
   @Component({
     imports: [CommonModule, NodeDetailPanelComponent, ...]
   })

3. Replace the existing Node Properties panel:
   
   OLD:
   <app-sdk-panel title="Node Properties">
     <form class="tech-form">
       <!-- Simple form fields -->
     </form>
   </app-sdk-panel>
   
   NEW:
   <app-sdk-panel title="Node Properties">
     <app-node-detail-panel
       [selectedNode]="selectedNode"
       [isVisible]="true"
       (nodeUpdated)="onNodeUpdated($event)">
     </app-node-detail-panel>
   </app-sdk-panel>

4. Update the node selection handler:
   onNodeSelected(node: TechNode): void {
     this.selectedNode = node;
     // Clear any existing validations
     this.clearValidationMessages();
     
     // Add validation logic here if needed
     this.validateNode(node);
   }

5. Add validation method:
   private validateNode(node: TechNode): void {
     // Implement validation logic
     // Use the NodeDetailPanelComponent methods to add validation messages
   }

6. Style integration:
   The component uses design system tokens and will automatically
   integrate with the existing Hanseatic theme styling.
*/