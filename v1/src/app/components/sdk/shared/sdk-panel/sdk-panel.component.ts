import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sdk-panel',
  templateUrl: './sdk-panel.component.html',
  styleUrls: ['./sdk-panel.component.scss']
})
export class SdkPanelComponent {
  @Input() title?: string;
  @Input() compact = false;

  // Track if content has been projected to named slots
  hasHeaderContent = false;
  hasActionsContent = false;
  hasFooterContent = false;

  // These would be populated by content projection checks in a real implementation
  // For now, we'll keep them as simple boolean flags that can be set programmatically
}