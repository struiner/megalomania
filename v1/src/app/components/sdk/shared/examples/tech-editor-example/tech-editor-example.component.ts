import { Component } from '@angular/core';
import { SdkShellTab } from '../../sdk-shell/sdk-shell.component';
import { TechTreeIntegrationComponent } from '../tech-tree/tech-tree-integration.component';
import { TechNode } from '../tech-tree';

@Component({
  selector: 'app-tech-editor-example',
  templateUrl: './tech-editor-example.component.html',
  styleUrls: ['./tech-editor-example.component.scss']
})
export class TechEditorExampleComponent {
  activeTab = 'editor';
  
  techStats = [
    { label: 'Technologies', value: 24 },
    { label: 'Max Tier', value: 5 },
    { label: 'Dependencies', value: 47 }
  ];

  bottomActions = [
    { label: 'Save Tree', variant: 'primary' },
    { label: 'Validate', variant: 'secondary' },
    { label: 'Export', variant: 'secondary' }
  ];

  techTabs: SdkShellTab[] = [
    {
      id: 'editor',
      label: 'Editor',
      content: null // Will be provided via ngTemplate
    },
    {
      id: 'dependencies',
      label: 'Dependencies',
      content: null
    },
    {
      id: 'validation',
      label: 'Validation',
      content: null
    }
  ];

  // Mock technology data for the integrated editor
  mockTechs: TechNode[] = [
    {
      id: 'basic-metallurgy',
      name: 'Basic Metallurgy',
      description: 'Learn to work with basic metals and fundamental smelting techniques.',
      tier: 1,
      cost: 50,
      prerequisites: [],
      effects: ['Unlocks basic metal tools', 'Enables copper and bronze working'],
      cultureTags: ['metalworking'],
      position: { x: 0, y: 0 },
      isUnlocked: true,
      isDiscovered: true,
      isResearched: false,
      isResearching: false
    },
    {
      id: 'advanced-metallurgy',
      name: 'Advanced Metallurgy',
      description: 'Advanced metalworking techniques and alloy creation.',
      tier: 2,
      cost: 100,
      prerequisites: ['basic-metallurgy'],
      effects: ['Enables steel production', 'Improves tool durability by 25%'],
      cultureTags: ['metalworking', 'engineering'],
      position: { x: 0, y: 150 },
      isUnlocked: false,
      isDiscovered: false,
      isResearched: false,
      isResearching: false
    },
    {
      id: 'steel-production',
      name: 'Steel Production',
      description: 'Master the art of creating steel from iron and carbon.',
      tier: 3,
      cost: 200,
      prerequisites: ['advanced-metallurgy'],
      effects: ['Unlocks steel weapons and armor', 'Enables advanced machinery'],
      cultureTags: ['metalworking', 'engineering', 'military'],
      position: { x: 0, y: 300 },
      isUnlocked: false,
      isDiscovered: false,
      isResearched: false,
      isResearching: false
    },
    {
      id: 'fire-control',
      name: 'Fire Control',
      description: 'Master advanced fire management and heat control.',
      tier: 2,
      cost: 75,
      prerequisites: ['basic-metallurgy'],
      effects: ['Improves smelting efficiency', 'Enables glass production'],
      cultureTags: ['firecraft', 'craftsmanship'],
      position: { x: 200, y: 150 },
      isUnlocked: false,
      isDiscovered: false,
      isResearched: false,
      isResearching: false
    }
  ];

  // Integration configuration
  integrationConfig = {
    enableAutoSave: true,
    enableRealTimeSync: true,
    enableStatePersistence: true,
    enableValidation: true,
    enableErrorRecovery: true,
    debounceMs: 300,
    validationIntervalMs: 2000
  };
}