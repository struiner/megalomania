import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NodeIdentityFieldsComponent, NodeIdentityData } from './node-identity-fields.component';

@Component({
  selector: 'app-identity-fields-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, NodeIdentityFieldsComponent],
  template: `
    <div class="identity-fields-demo">
      <header class="identity-fields-demo__header">
        <h1>Node Identity Fields - Interactive Demo</h1>
        <p class="identity-fields-demo__subtitle">
          Demonstrating guarded editing for Node ID and inline editing for display name and description
        </p>
      </header>

      <div class="identity-fields-demo__content">
        <!-- Demo Controls -->
        <div class="identity-fields-demo__controls">
          <h3>Demo Controls</h3>
          <div class="identity-fields-demo__control-group">
            <label>
              <input 
                type="checkbox" 
                [(ngModel)]="isReadOnly">
              Read-Only Mode
            </label>
          </div>
          
          <div class="identity-fields-demo__control-group">
            <button 
              type="button"
              class="identity-fields-demo__button"
              (click)="loadSampleNode()">
              Load Sample Node
            </button>
            <button 
              type="button"
              class="identity-fields-demo__button"
              (click)="clearNode()">
              Clear Node
            </button>
          </div>

          <div class="identity-fields-demo__control-group">
            <h4>Quick Node Presets:</h4>
            <button 
              type="button"
              class="identity-fields-demo__preset-button"
              (click)="loadPreset('manufacturing')">
              Manufacturing Tech
            </button>
            <button 
              type="button"
              class="identity-fields-demo__preset-button"
              (click)="loadPreset('research')">
              Research Lab
            </button>
            <button 
              type="button"
              class="identity-fields-demo__preset-button"
              (click)="loadPreset('military')">
              Military Base
            </button>
          </div>
        </div>

        <!-- Identity Fields Component -->
        <div class="identity-fields-demo__component">
          <h3>Node Identity Fields Component</h3>
          <app-node-identity-fields
            *ngIf="currentNodeData"
            [nodeData]="currentNodeData"
            [isReadOnly]="isReadOnly"
            (identityChanged)="onIdentityChanged($event)"
            (validationRequested)="onValidationRequested($event)">
          </app-node-identity-fields>

          <div 
            *ngIf="!currentNodeData"
            class="identity-fields-demo__empty-state">
            <p>No node selected. Use the controls above to load a sample node.</p>
          </div>
        </div>

        <!-- Change Log -->
        <div class="identity-fields-demo__changelog">
          <h3>Change Log</h3>
          <div class="identity-fields-demo__log-entries">
            <div 
              *ngFor="let entry of changeLog; trackBy: trackByIndex"
              class="identity-fields-demo__log-entry"
              [class.identity-fields-demo__log-entry--identity]="entry.type === 'identity'"
              [class.identity-fields-demo__log-entry--validation]="entry.type === 'validation'">
              
              <div class="identity-fields-demo__log-header">
                <span class="identity-fields-demo__log-type">{{ entry.type }}</span>
                <span class="identity-fields-demo__log-time">{{ entry.timestamp | date:'short' }}</span>
              </div>
              
              <div class="identity-fields-demo__log-content">
                <strong>{{ entry.field }}:</strong> {{ entry.message }}
              </div>
              
              <div 
                *ngIf="entry.oldValue || entry.newValue"
                class="identity-fields-demo__log-values">
                <span *ngIf="entry.oldValue">
                  <strong>Old:</strong> {{ entry.oldValue }}
                </span>
                <span *ngIf="entry.newValue">
                  <strong>New:</strong> {{ entry.newValue }}
                </span>
              </div>
            </div>
          </div>

          <div 
            *ngIf="changeLog.length === 0"
            class="identity-fields-demo__log-empty">
            <p>No changes yet. Start editing the node identity fields to see the change log.</p>
          </div>
        </div>
      </div>

      <!-- Usage Instructions -->
      <div class="identity-fields-demo__instructions">
        <h3>How to Test</h3>
        <ol>
          <li><strong>Node ID Editing:</strong> Click "Edit ID" to enter guarded editing mode. You'll need to type the ID twice to confirm the change.</li>
          <li><strong>Display Name:</strong> Click "Edit" next to the display name for inline editing. Press Enter or click ✓ to save.</li>
          <li><strong>Description:</strong> Click "Edit" next to the description for inline editing with character counting.</li>
          <li><strong>Validation:</strong> Try entering invalid data to see validation warnings and error messages.</li>
          <li><strong>Downstream Impact:</strong> Change the Node ID to see downstream impact analysis (simulated for demo).</li>
          <li><strong>Read-Only Mode:</strong> Enable read-only mode to see how the component behaves when editing is disabled.</li>
        </ol>
      </div>
    </div>
  `,
  styleUrls: ['./identity-fields-demo.component.scss']
})
export class IdentityFieldsDemoComponent implements OnInit {
  currentNodeData: NodeIdentityData | null = null;
  isReadOnly = false;
  changeLog: ChangeLogEntry[] = [];

  ngOnInit(): void {
    // Load initial sample node
    this.loadSampleNode();
  }

  loadSampleNode(): void {
    this.currentNodeData = {
      id: 'tech_advanced_manufacturing',
      displayName: 'Advanced Manufacturing',
      description: 'Unlock advanced production techniques and automated manufacturing processes.',
      originalId: 'tech_advanced_manufacturing'
    };
    
    this.addLogEntry({
      type: 'system',
      field: 'system',
      message: 'Sample node loaded: Advanced Manufacturing',
      timestamp: new Date()
    });
  }

  clearNode(): void {
    this.currentNodeData = null;
    this.addLogEntry({
      type: 'system',
      field: 'system',
      message: 'Node cleared',
      timestamp: new Date()
    });
  }

  loadPreset(preset: 'manufacturing' | 'research' | 'military'): void {
    const presets = {
      manufacturing: {
        id: 'tech_automated_assembly',
        displayName: 'Automated Assembly Line',
        description: 'Fully automated production lines that operate 24/7 without human intervention.',
        originalId: 'tech_automated_assembly'
      },
      research: {
        id: 'lab_quantum_research',
        displayName: 'Quantum Research Laboratory',
        description: 'Cutting-edge facility dedicated to quantum computing and physics research.',
        originalId: 'lab_quantum_research'
      },
      military: {
        id: 'base_strategic_defense',
        displayName: 'Strategic Defense Command',
        description: 'Central command for coordinating defensive operations and threat assessment.',
        originalId: 'base_strategic_defense'
      }
    };

    this.currentNodeData = presets[preset];
    this.addLogEntry({
      type: 'system',
      field: 'system',
      message: `Loaded preset: ${presets[preset].displayName}`,
      timestamp: new Date()
    });
  }

  onIdentityChanged(identityData: NodeIdentityData): void {
    if (this.currentNodeData) {
      const oldData = { ...this.currentNodeData };
      this.currentNodeData = identityData;

      // Log individual field changes
      if (oldData.id !== identityData.id) {
        this.addLogEntry({
          type: 'identity',
          field: 'Node ID',
          message: 'Node ID changed',
          oldValue: oldData.id,
          newValue: identityData.id,
          timestamp: new Date()
        });
      }

      if (oldData.displayName !== identityData.displayName) {
        this.addLogEntry({
          type: 'identity',
          field: 'Display Name',
          message: 'Display name updated',
          oldValue: oldData.displayName,
          newValue: identityData.displayName,
          timestamp: new Date()
        });
      }

      if (oldData.description !== identityData.description) {
        this.addLogEntry({
          type: 'identity',
          field: 'Description',
          message: 'Description modified',
          oldValue: oldData.description,
          newValue: identityData.description,
          timestamp: new Date()
        });
      }
    }
  }

  onValidationRequested(request: { field: string, value: string }): void {
    this.addLogEntry({
      type: 'validation',
      field: request.field,
      message: `Validation requested for: ${request.value}`,
      timestamp: new Date()
    });

    // Simulate validation response
    setTimeout(() => {
      if (request.field === 'id' && request.value !== this.currentNodeData?.originalId) {
        this.addLogEntry({
          type: 'validation',
          field: request.field,
          message: `Downstream impact analysis completed for ID change`,
          timestamp: new Date()
        });
      }
    }, 1000);
  }

  addLogEntry(entry: Omit<ChangeLogEntry, 'id'>): void {
    const logEntry: ChangeLogEntry = {
      id: Date.now() + Math.random(),
      ...entry
    };
    
    this.changeLog.unshift(logEntry);
    
    // Keep only the last 20 entries
    if (this.changeLog.length > 20) {
      this.changeLog = this.changeLog.slice(0, 20);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}

interface ChangeLogEntry {
  id: number;
  type: 'identity' | 'validation' | 'system';
  field: string;
  message: string;
  oldValue?: string;
  newValue?: string;
  timestamp: Date;
}