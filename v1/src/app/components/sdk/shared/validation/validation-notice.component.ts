import { Component, Input } from '@angular/core';
import { ValidationNotice } from '../../../../models/validation.models';

@Component({
  selector: 'app-validation-notice',
  templateUrl: './validation-notice.component.html',
  styleUrls: ['./validation-notice.component.scss']
})
export class ValidationNoticeComponent {
  @Input() notice!: ValidationNotice;
  @Input() showPath = false;
  @Input() actionable = false;
  @Input() onAction?: () => void;

  getAriaLabel(): string {
    const severityLabel = this.notice.severity === 'error' ? 'Error' : 
                         this.notice.severity === 'warning' ? 'Warning' : 'Information';
    return `${severityLabel}: ${this.notice.message}`;
  }

  getAriaRole(): string {
    // Errors and warnings should be announced as alert role
    return this.notice.severity === 'info' ? 'status' : 'alert';
  }

  getActionAriaLabel(): string {
    return `Fix: ${this.notice.message}`;
  }
}