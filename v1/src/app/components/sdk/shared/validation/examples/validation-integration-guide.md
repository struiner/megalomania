# SDK Validation Components Integration Guide

This guide demonstrates how to integrate the validation notice components into existing SDK tools following the UI Charter principles.

## Components Overview

### 1. ValidationNoticeComponent
- **Purpose**: Display individual validation messages
- **Usage**: Detailed error information with suggestions
- **Features**: Severity styling, actionable buttons, accessibility

### 2. ValidationCollapsibleComponent  
- **Purpose**: Summary bar with expandable details
- **Usage**: Overall validation status for sections or pages
- **Features**: Count aggregation, severity-based summary, deterministic ordering

### 3. ValidationBadgeComponent
- **Purpose**: Compact per-row indicators for lists
- **Usage**: Quick visual status indicators
- **Features**: Severity-based styling, clickable interactions, accessibility

## Integration Patterns

### Pattern 1: Goods Manager Integration

```typescript
// In goods-manager.component.ts
import { ValidationNoticeComponent } from '../shared/validation/validation-notice.component';
import { ValidationCollapsibleComponent } from '../shared/validation/validation-collapsible.component';
import { ValidationBadgeComponent } from '../shared/validation/validation-badge.component';

@Component({
  selector: 'app-goods-manager',
  template: `
    <!-- Validation Summary -->
    <app-validation-collapsible
      [notices]="validationNotices"
      [showPaths]="true"
      [actionable]="true"
      [onNoticeAction]="handleValidationAction"
      title="Goods Validation Issues"
    ></app-validation-collapsible>

    <!-- Goods List with Badges -->
    <div *ngFor="let good of goods" class="goods-item">
      <app-validation-badge
        [notice]="getValidationNotice(good.id)"
        [clickable]="true"
        (onClick)="focusGood(good.id)"
      ></app-validation-badge>
      
      <div class="goods-item__content">
        <!-- Good details -->
      </div>
    </div>
  `
})
export class GoodsManagerComponent {
  validationNotices: ValidationNotice[] = [];
  
  handleValidationAction(notice: ValidationNotice): void {
    // Navigate to problematic field or trigger auto-fix
    this.navigationService.navigateToField(notice.path);
  }
}
```

### Pattern 2: Tech Editor Integration

```typescript
// In tech-editor.component.ts
@Component({
  selector: 'app-tech-editor',
  template: `
    <!-- Tech Tree Validation Panel -->
    <app-validation-collapsible
      [notices]="techValidationNotices"
      [showPaths]="false"
      [actionable]="true"
      [onNoticeAction]="handleTechValidationAction"
    ></app-validation-collapsible>

    <!-- Tech Nodes with Validation Badges -->
    <div *ngFor="let tech of techTree" class="tech-node">
      <app-validation-badge
        [severity]="getTechSeverity(tech)"
        [clickable]="true"
        (onClick)="showTechDetails(tech)"
      ></app-validation-badge>
      
      <div class="tech-node__content">
        <!-- Tech details -->
      </div>
    </div>
  `
})
export class TechEditorComponent {
  techValidationNotices: ValidationNotice[] = [];
  
  handleTechValidationAction(notice: ValidationNotice): void {
    // Focus on problematic tech node
    this.editorService.focusNode(notice.path);
  }
}
```

### Pattern 3: Room Blueprint Editor Integration

```typescript
// In room-blueprint-editor.component.ts
@Component({
  selector: 'app-room-blueprint-editor',
  template: `
    <!-- Blueprint Validation Summary -->
    <app-validation-collapsible
      [notices]="blueprintValidationNotices"
      [showPaths]="true"
      [actionable]="true"
      [onNoticeAction]="handleBlueprintValidationAction"
      title="Blueprint Validation"
    ></app-validation-collapsible>

    <!-- Feature List with Validation Badges -->
    <div *ngFor="let feature of blueprint.features" class="feature-item">
      <app-validation-badge
        [notice]="getFeatureValidationNotice(feature.id)"
        [clickable]="true"
        (onClick)="selectFeature(feature.id)"
      ></app-validation-badge>
      
      <div class="feature-item__content">
        <!-- Feature details and editor -->
      </div>
    </div>
  `
})
export class RoomBlueprintEditorComponent {
  blueprintValidationNotices: ValidationNotice[] = [];
  
  handleBlueprintValidationAction(notice: ValidationNotice): void {
    // Focus on problematic feature in blueprint
    this.blueprintService.selectFeature(notice.path);
  }
}
```

## Placement Guidelines

### UI Charter Compliance
- **No Center Clutter**: Place validation UI in secondary/peripheral zones
- **Deterministic Ordering**: Sort notices by severity (error → warning → info)
- **Stable Layout**: Avoid dynamic positioning that shifts primary content
- **Limited Actions**: Keep validation actions non-intrusive

### Recommended Placement Zones
1. **Top Panel**: Collapsible summary for page-level validation
2. **Sidebar**: Detailed notices for focused editing
3. **List Items**: Badges for quick status scanning
4. **Form Fields**: Inline notices for field-specific validation

### Accessibility Requirements
- **ARIA Roles**: Proper role assignment for screen readers
- **Keyboard Navigation**: Tab order and keyboard shortcuts
- **Color Contrast**: High contrast mode support
- **Focus Management**: Clear focus indicators

## Validation Data Integration

### Service Integration Pattern
```typescript
// validation.service.ts
@Injectable()
export class ValidationService {
  validateGoods(goods: Good[]): ValidationNotice[] {
    const notices: ValidationNotice[] = [];
    
    goods.forEach(good => {
      // Validation logic
      if (!good.mass || good.mass <= 0) {
        notices.push({
          path: `goods/${good.id}/properties/mass`,
          message: 'Mass value must be positive',
          severity: 'error',
          suggestion: 'Set mass to a value greater than 0',
          code: 'GOODS_MASS_INVALID'
        });
      }
    });
    
    return this.sortNotices(notices);
  }
}
```

### Real-time Validation Updates
```typescript
// Real-time validation with reactive patterns
@Component({
  template: `
    <app-validation-collapsible
      [notices]="validationNotices$ | async"
      [actionable]="true"
    ></app-validation-collapsible>
  `
})
export class ReactiveValidationComponent {
  validationNotices$ = this.goodsService.goods$.pipe(
    map(goods => this.validationService.validateGoods(goods))
  );
  
  constructor(
    private goodsService: GoodsService,
    private validationService: ValidationService
  ) {}
}
```

## Error Handling Patterns

### Graceful Degradation
- **No Validation Data**: Show neutral state
- **Network Errors**: Display retry mechanism
- **Validation Timeout**: Show fallback message

### Performance Considerations
- **Lazy Loading**: Load validation components on demand
- **Virtual Scrolling**: For large lists with validation badges
- **Debounced Updates**: Prevent excessive re-validation

## Testing Integration

### Component Testing
```typescript
// goods-validation-example.component.spec.ts
describe('GoodsValidationIntegration', () => {
  it('should display validation summary', () => {
    component.validationNotices = MOCK_VALIDATION_NOTICES;
    fixture.detectChanges();
    
    const summary = fixture.nativeElement.querySelector('.validation-collapsible');
    expect(summary).toBeTruthy();
  });
  
  it('should handle validation action', () => {
    spyOn(component, 'onNoticeAction');
    component.onNoticeAction(MOCK_VALIDATION_NOTICE);
    expect(component.onNoticeAction).toHaveBeenCalledWith(MOCK_VALIDATION_NOTICE);
  });
});
```

## Common Integration Scenarios

### Import/Export Flows
- **File Validation**: Pre-import validation with detailed error reporting
- **Batch Operations**: Progress tracking with validation summary
- **Error Recovery**: Retry mechanisms with specific error guidance

### Form Validation
- **Field-level**: Real-time validation with inline notices
- **Form-level**: Summary validation on submit
- **Progressive Enhancement**: Basic validation with enhanced features

### Data Migration
- **Schema Validation**: Data structure verification
- **Content Validation**: Business rule enforcement
- **Migration Reporting**: Comprehensive validation summary

This integration guide ensures consistent validation UI across all SDK tools while maintaining compliance with the UI Charter and accessibility standards.