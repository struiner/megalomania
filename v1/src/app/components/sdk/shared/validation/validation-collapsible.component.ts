import { Component, Input } from '@angular/core';
import { ValidationNotice } from '../../../../models/validation.models';

@Component({
  selector: 'app-validation-collapsible',
  templateUrl: './validation-collapsible.component.html',
  styleUrls: ['./validation-collapsible.component.scss']
})
export class ValidationCollapsibleComponent {
  @Input() notices: ValidationNotice[] = [];
  @Input() showPaths = false;
  @Input() actionable = false;
  @Input() onNoticeAction?: (notice: ValidationNotice) => void;
  @Input() title?: string;

  expanded = false;

  get noticeCount(): number {
    return this.notices.length;
  }

  getHighestSeverity(): ValidationNotice['severity'] {
    if (this.notices.length === 0) return 'info';
    
    const severityOrder: Record<ValidationNotice['severity'], number> = { error: 0, warning: 1, info: 2 };
    let highest: ValidationNotice['severity'] = 'info';
    
    for (const notice of this.notices) {
      if (severityOrder[notice.severity] < severityOrder[highest]) {
        highest = notice.severity;
      }
    }
    
    return highest;
  }

  getSummaryText(): string {
    if (this.title) return this.title;
    
    const errorCount = this.notices.filter(n => n.severity === 'error').length;
    const warningCount = this.notices.filter(n => n.severity === 'warning').length;
    const infoCount = this.notices.filter(n => n.severity === 'info').length;

    if (errorCount > 0) {
      return `${errorCount} error${errorCount > 1 ? 's' : ''}`;
    } else if (warningCount > 0) {
      return `${warningCount} warning${warningCount > 1 ? 's' : ''}`;
    } else if (infoCount > 0) {
      return `${infoCount} information item${infoCount > 1 ? 's' : ''}`;
    }
    
    return 'Validation issues';
  }

  getAriaLabel(): string {
    const summary = this.getSummaryText();
    return `${summary}: ${this.noticeCount} validation ${this.noticeCount === 1 ? 'issue' : 'issues'}`;
  }

  getAriaRole(): string {
    return this.getHighestSeverity() === 'error' ? 'alert' : 'status';
  }

  getHeaderId(): string {
    return `validation-header-${Math.random().toString(36).substr(2, 9)}`;
  }

  getContentId(): string {
    return `validation-content-${Math.random().toString(36).substr(2, 9)}`;
  }

  toggleExpanded(): void {
    this.expanded = !this.expanded;
  }

  trackByNotice(index: number, notice: ValidationNotice): string {
    return `${notice.path}-${notice.message}`;
  }
}