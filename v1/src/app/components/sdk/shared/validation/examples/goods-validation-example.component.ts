import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationNoticeComponent } from '../validation-notice.component';
import { ValidationCollapsibleComponent } from '../validation-collapsible.component';
import { ValidationBadgeComponent } from '../validation-badge.component';
import { GOODS_VALIDATION_FIXTURES } from '../validation-fixtures';

@Component({
  selector: 'app-goods-validation-example',
  standalone: true,
  imports: [CommonModule, ValidationNoticeComponent, ValidationCollapsibleComponent, ValidationBadgeComponent],
  templateUrl: './goods-validation-example.component.html',
  styleUrls: ['./goods-validation-example.component.scss']
})
export class GoodsValidationExampleComponent {
  // Sample goods data with validation notices
  goodsItems = [
    {
      id: 'copper-ingot',
      name: 'Copper Ingot',
      status: 'error',
      notice: GOODS_VALIDATION_FIXTURES[0]
    },
    {
      id: 'iron-ore',
      name: 'Iron Ore',
      status: 'error',
      notice: GOODS_VALIDATION_FIXTURES[1]
    },
    {
      id: 'wood',
      name: 'Wood',
      status: 'warning',
      notice: GOODS_VALIDATION_FIXTURES[2]
    },
    {
      id: 'cloth',
      name: 'Cloth',
      status: 'warning',
      notice: GOODS_VALIDATION_FIXTURES[3]
    },
    {
      id: 'steel',
      name: 'Steel',
      status: 'info',
      notice: GOODS_VALIDATION_FIXTURES[4]
    }
  ];

  // Get all validation notices for collapsible summary
  get allNotices() {
    return this.goodsItems.map(item => item.notice);
  }

  // Handle notice action
  onNoticeAction(notice: any): void {
    console.log('Action requested for:', notice);
    // Implement navigation to problematic field or auto-fix logic
  }

  // Handle badge click
  onBadgeClick(item: any): void {
    console.log('Badge clicked for:', item.name);
    // Implement detail view or focus logic
  }
}