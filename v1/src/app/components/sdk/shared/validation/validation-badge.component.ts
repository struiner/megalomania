import { Component, Input } from '@angular/core';
import { ValidationNotice } from '../../../../models/validation.models';

@Component({
  selector: 'app-validation-badge',
  templateUrl: './validation-badge.component.html',
  styleUrls: ['./validation-badge.component.scss']
})
export class ValidationBadgeComponent {
  @Input() notice?: ValidationNotice;
  @Input() severity?: ValidationNotice['severity'];
  @Input() showIcon = true;
  @Input() compact = false;
  @Input() clickable = false;
  @Input() onClick?: () => void;

  get displaySeverity(): ValidationNotice['severity'] {
    return this.notice?.severity || this.severity || 'info';
  }

  get displayIcon(): string {
    const icons = {
      error: '✗',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[this.displaySeverity];
  }

  get ariaLabel(): string {
    if (this.notice) {
      const severityLabel = this.displaySeverity === 'error' ? 'Error' : 
                           this.displaySeverity === 'warning' ? 'Warning' : 'Information';
      return `${severityLabel}: ${this.notice.message}`;
    }
    
    const severityLabel = this.displaySeverity === 'error' ? 'Error' : 
                         this.displaySeverity === 'warning' ? 'Warning' : 'Information';
    return severityLabel;
  }

  get badgeClasses(): string[] {
    const classes = [`validation-badge--${this.displaySeverity}`];
    
    if (this.compact) {
      classes.push('validation-badge--compact');
    }
    
    if (this.clickable) {
      classes.push('validation-badge--clickable');
    }
    
    return classes;
  }

  handleClick(): void {
    if (this.clickable && this.onClick) {
      this.onClick();
    }
  }
}