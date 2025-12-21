import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  OnChanges, 
  SimpleChanges,
  HostListener 
} from '@angular/core';
import { TechNode, TechNodeState } from './tech-node.interface';

@Component({
  selector: 'app-tech-node',
  templateUrl: './tech-node.component.html',
  styleUrls: ['./tech-node.component.scss']
})
export class TechNodeComponent implements OnChanges {
  @Input() node!: TechNode;
  @Input() state: TechNodeState = {
    selected: false,
    focused: false,
    invalid: false,
    disabled: false,
    activePath: false,
    prerequisiteSatisfied: false,
    prerequisiteUnsatisfied: false
  };
  @Input() zoomLevel = 1.0;
  @Input() compactMode = false;
  
  @Output() nodeClick = new EventEmitter<TechNode>();
  @Output() nodeFocus = new EventEmitter<TechNode>();
  @Output() nodeSelect = new EventEmitter<TechNode>();

  currentTemplate: 'compact' | 'standard' | 'detailed' = 'standard';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['zoomLevel'] || changes['compactMode']) {
      this.updateTemplate();
    }
  }

  private updateTemplate(): void {
    if (this.compactMode || this.zoomLevel < 0.5) {
      this.currentTemplate = 'compact';
    } else if (this.zoomLevel < 1.5) {
      this.currentTemplate = 'standard';
    } else {
      this.currentTemplate = 'detailed';
    }
  }

  get nodeClasses(): string[] {
    const classes = ['tech-node'];
    
    // State-based classes
    if (this.state.selected) classes.push('tech-node--selected');
    if (this.state.focused) classes.push('tech-node--focused');
    if (this.state.invalid) classes.push('tech-node--invalid');
    if (this.state.disabled) classes.push('tech-node--disabled');
    if (this.state.activePath) classes.push('tech-node--active-path');
    if (this.state.prerequisiteSatisfied) classes.push('tech-node--prereq-satisfied');
    if (this.state.prerequisiteUnsatisfied) classes.push('tech-node--prereq-unsatisfied');
    
    // Template-based classes
    classes.push(`tech-node--${this.currentTemplate}`);
    
    return classes;
  }

  get tierClass(): string {
    return `tech-tier--tier-${this.node.tier}`;
  }

  get stateIcon(): string {
    if (this.state.invalid) return '⚠';
    if (this.state.disabled) return '⏸';
    if (this.node.isResearched) return '✓';
    if (this.node.isResearching) return '⟳';
    if (this.node.isUnlocked) return '●';
    return '○';
  }

  get stateIconClass(): string {
    if (this.state.invalid) return 'tech-state-icon--warning';
    if (this.state.disabled) return 'tech-state-icon--disabled';
    if (this.node.isResearched) return 'tech-state-icon--success';
    if (this.node.isResearching) return 'tech-state-icon--researching';
    if (this.node.isUnlocked) return 'tech-state-icon--unlocked';
    return 'tech-state-icon--locked';
  }

  onNodeClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.nodeClick.emit(this.node);
  }

  onNodeFocus(event: FocusEvent): void {
    event.preventDefault();
    this.nodeFocus.emit(this.node);
  }

  onNodeSelect(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.nodeSelect.emit(this.node);
  }

  getTooltipText(): string {
    let tooltip = `${this.node.name}`;
    
    if (this.currentTemplate === 'compact') {
      return tooltip;
    }
    
    tooltip += `\nTier ${this.node.tier} • Cost: ${this.node.cost}`;
    
    if (this.currentTemplate === 'detailed') {
      tooltip += `\n\n${this.node.description}`;
      
      if (this.node.prerequisites.length > 0) {
        tooltip += `\n\nPrerequisites:\n${this.node.prerequisites.join(', ')}`;
      }
      
      if (this.node.effects.length > 0) {
        tooltip += `\n\nEffects:\n${this.node.effects.join(', ')}`;
      }
    }
    
    return tooltip;
  }
  
  getSpatialDescription(): string {
    // Generate spatial context for screen readers
    return `Technology ${this.node.name} in tier ${this.node.tier}. ` +
           `Status: ${this.getStatusDescription()}. ` +
           `Position: ${this.getPositionDescription()}.`;
  }
  
  private getStatusDescription(): string {
    if (this.state.invalid) return 'invalid';
    if (this.state.disabled) return 'disabled';
    if (this.node.isResearched) return 'researched';
    if (this.node.isResearching) return 'researching';
    if (this.node.isUnlocked) return 'unlocked';
    return 'locked';
  }
  
  private getPositionDescription(): string {
    // This would need to be provided by the parent component
    // For now, return a basic description
    return 'grid position';
  }
  
  getAriaLabel(): string {
    return this.getSpatialDescription();
  }
  
  getGridCellAriaLabel(): string {
    let label = `${this.node.name}, `;
    label += `Tier ${this.node.tier}, `;
    label += `Cost ${this.node.cost}, `;
    label += this.getStatusDescription();
    
    if (this.state.selected) {
      label += ', selected';
    }
    
    if (this.state.focused) {
      label += ', focused';
    }
    
    if (this.node.prerequisites.length > 0) {
      label += `, requires ${this.node.prerequisites.join(', ')}`;
    }
    
    return label;
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.nodeSelect.emit(this.node);
    }
  }
}