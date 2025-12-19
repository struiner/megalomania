import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface SdkShellAction {
  label: string;
  icon?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface SdkShellTab {
  id: string;
  label: string;
  content: any; // TemplateRef
}

export interface SdkShellStat {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-sdk-shell',
  templateUrl: './sdk-shell.component.html',
  styleUrls: ['./sdk-shell.component.scss']
})
export class SdkShellComponent {
  @Input() eyebrowText = '';
  @Input() title = '';
  @Input() ledeText?: string;
  @Input() headerActions: SdkShellAction[] = [];
  @Input() bottomActions: SdkShellAction[] = [];
  @Input() summaryStats: SdkShellStat[] = [];
  
  // Tab support
  @Input() tabs: SdkShellTab[] = [];
  @Input() activeTabId?: string;
  @Output() activeTabIdChange = new EventEmitter<string>();

  get hasTabs(): boolean {
    return this.tabs?.length > 0;
  }

  selectTab(tabId: string): void {
    this.activeTabId = tabId;
    this.activeTabIdChange.emit(tabId);
  }

  trackByTab(index: number, tab: SdkShellTab): string {
    return tab.id;
  }

  trackByAction(index: number, action: SdkShellAction): string {
    return action.label;
  }

  getActionButtonClass(action: SdkShellAction): string {
    const baseClass = 'sdk-shell__action-btn';
    const variant = action.variant || 'secondary';
    return `${baseClass} ${baseClass}--${variant}`;
  }
}