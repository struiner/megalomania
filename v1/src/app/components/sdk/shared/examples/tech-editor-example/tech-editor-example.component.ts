import { Component } from '@angular/core';
import { SdkShellTab } from '../../sdk-shell/sdk-shell.component';

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

  mockTechs = [
    {
      name: 'Basic Metallurgy',
      description: 'Learn to work with basic metals',
      tier: 1,
      dependencies: []
    },
    {
      name: 'Advanced Metallurgy',
      description: 'Advanced metalworking techniques',
      tier: 2,
      dependencies: ['Basic Metallurgy']
    },
    {
      name: 'Steel Production',
      description: 'Create steel from iron',
      tier: 3,
      dependencies: ['Advanced Metallurgy', 'Fire Control']
    }
  ];
}