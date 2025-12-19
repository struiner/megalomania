import { Component, Input } from '@angular/core';

export interface SdkActionGroupAction {
  label: string;
  icon?: string;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

@Component({
  selector: 'app-sdk-action-group',
  templateUrl: './sdk-action-group.component.html',
  styleUrls: ['./sdk-action-group.component.scss']
})
export class SdkActionGroupComponent {
  @Input() actions: SdkActionGroupAction[] = [];
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';

  trackByAction(index: number, action: SdkActionGroupAction): string {
    return action.label;
  }

  getActionButtonClass(action: SdkActionGroupAction): string {
    const baseClass = 'sdk-action-group__btn';
    const variant = action.variant || 'secondary';
    return `${baseClass} ${baseClass}--${variant}`;
  }
}