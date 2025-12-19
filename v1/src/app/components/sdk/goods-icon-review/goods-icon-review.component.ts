import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { GoodsIconRegistryService, GoodsIconDefinition, GoodsIconValidationIssue } from '../../../services/goods-icon-registry.service';
import { GoodCategory } from '../../../models/goods.model';
import { GoodsType } from '../../../enums/GoodsType';

interface FilterState {
  category: GoodCategory | 'all';
  status: 'all' | 'complete' | 'placeholder' | 'missing';
  era: string | 'all';
  searchText: string;
}

@Component({
  selector: 'app-goods-icon-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goods-icon-review.component.html',
  styleUrls: ['./goods-icon-review.component.scss']
})
export class GoodsIconReviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data
  allIcons: GoodsIconDefinition[] = [];
  filteredIcons: GoodsIconDefinition[] = [];
  validationIssues: GoodsIconValidationIssue[] = [];
  categories: (GoodCategory | 'all')[] = [];
  eras: string[] = [];
  
  // UI State
  isLoading = false;
  selectedIcon: GoodsIconDefinition | null = null;
  showValidationPanel = false;
  showExportDialog = false;
  
  // Filters
  filters: FilterState = {
    category: 'all',
    status: 'all', 
    era: 'all',
    searchText: ''
  };

  // Statistics
  stats = {
    total: 0,
    complete: 0,
    placeholder: 0,
    missing: 0,
    byCategory: new Map<GoodCategory, number>(),
    byEra: new Map<string, number>()
  };

  constructor(private iconRegistry: GoodsIconRegistryService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.isLoading = true;
    
    // Load all icons and validation issues
    this.allIcons = this.iconRegistry.getIcons();
    this.validationIssues = this.iconRegistry.validateRegistry();
    
    // Extract unique categories and eras for filter dropdowns
    this.categories = ['all', ...Array.from(new Set(this.allIcons.map(icon => icon.category)))];
    this.eras = ['all', ...Array.from(new Set(this.allIcons.map(icon => icon.era)))];
    
    // Calculate statistics
    this.calculateStats();
    
    // Apply initial filters
    this.applyFilters();
    
    this.isLoading = false;
  }

  private calculateStats(): void {
    this.stats.total = this.allIcons.length;
    this.stats.complete = this.allIcons.filter(icon => icon.status === 'complete').length;
    this.stats.placeholder = this.allIcons.filter(icon => icon.status === 'placeholder').length;
    this.stats.missing = this.allIcons.filter(icon => icon.status === 'missing').length;
    
    // Category breakdown
    this.stats.byCategory.clear();
    this.allIcons.forEach(icon => {
      const count = this.stats.byCategory.get(icon.category) || 0;
      this.stats.byCategory.set(icon.category, count + 1);
    });
    
    // Era breakdown  
    this.stats.byEra.clear();
    this.allIcons.forEach(icon => {
      const count = this.stats.byEra.get(icon.era) || 0;
      this.stats.byEra.set(icon.era, count + 1);
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredIcons = this.allIcons.filter(icon => {
      // Category filter
      if (this.filters.category !== 'all' && icon.category !== this.filters.category) {
        return false;
      }
      
      // Status filter
      if (this.filters.status !== 'all' && icon.status !== this.filters.status) {
        return false;
      }
      
      // Era filter
      if (this.filters.era !== 'all' && icon.era !== this.filters.era) {
        return false;
      }
      
      // Search text filter
      if (this.filters.searchText.trim()) {
        const searchLower = this.filters.searchText.toLowerCase();
        const matchesType = icon.type.toLowerCase().includes(searchLower);
        const matchesLabel = icon.label.toLowerCase().includes(searchLower);
        const matchesCategory = icon.category.toLowerCase().includes(searchLower);
        if (!matchesType && !matchesLabel && !matchesCategory) {
          return false;
        }
      }
      
      return true;
    });
  }

  clearFilters(): void {
    this.filters = {
      category: 'all',
      status: 'all',
      era: 'all', 
      searchText: ''
    };
    this.applyFilters();
  }

  selectIcon(icon: GoodsIconDefinition): void {
    this.selectedIcon = icon;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'complete': return 'status-complete';
      case 'placeholder': return 'status-placeholder';
      case 'missing': return 'status-missing';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'complete': return '✅';
      case 'placeholder': return '🔄';
      case 'missing': return '❌';
      default: return '❓';
    }
  }

  refreshValidation(): void {
    this.validationIssues = this.iconRegistry.validateRegistry();
  }

  exportValidationReport(): void {
    const report = this.iconRegistry.exportValidationReport();
    this.downloadFile(report, 'goods-icon-validation-report.md', 'text/markdown');
  }

  exportIconData(): void {
    const csvData = this.generateCsvData();
    this.downloadFile(csvData, 'goods-icon-data.csv', 'text/csv');
  }

  private generateCsvData(): string {
    const headers = [
      'GoodsType',
      'Label', 
      'Category',
      'Era',
      'Status',
      'IconID',
      'SpritePath',
      'Resolution',
      'Contrast'
    ];
    
    const rows = this.filteredIcons.map(icon => [
      icon.type,
      icon.label,
      icon.category,
      icon.era,
      icon.status,
      icon.iconId,
      icon.spritePath || 'N/A',
      icon.resolution,
      icon.contrast
    ]);
    
    return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  getValidationIssueCount(): number {
    return this.validationIssues.length;
  }

  getPlaceholderCount(): number {
    return this.stats.placeholder + this.stats.missing;
  }

  getCompletionPercentage(): number {
    return this.stats.total > 0 ? Math.round((this.stats.complete / this.stats.total) * 100) : 0;
  }

  // TrackBy functions for ngFor optimization
  trackByIcon(index: number, icon: GoodsIconDefinition): string {
    return icon.type;
  }

  trackByIssue(index: number, issue: GoodsIconValidationIssue): string {
    return issue.kind + '_' + index;
  }
}