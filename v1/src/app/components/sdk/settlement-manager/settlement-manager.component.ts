import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { SettlementType } from '../../../enums/SettlementType';

interface SettlementDraft {
  name: string;
  type: SettlementType;
  population: number;
  prosperity: number;
  concerns: string[];
  notes: string;
}

@Component({
  selector: 'app-settlement-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settlement-manager.component.html',
  styleUrls: ['./settlement-manager.component.scss']
})
export class SettlementManagerComponent {
  private readonly formBuilder = new FormBuilder();

  readonly settlementTypes = Object.values(SettlementType);
  readonly concernOptions = ['Supply', 'Security', 'Morale', 'Disease', 'Weather', 'Trade'];

  readonly form = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    type: this.formBuilder.nonNullable.control<SettlementType>(SettlementType.Village, Validators.required),
    population: this.formBuilder.nonNullable.control(120, [Validators.required, Validators.min(10)]),
    prosperity: this.formBuilder.nonNullable.control(50, [Validators.required, Validators.min(0), Validators.max(100)]),
    concerns: this.formBuilder.nonNullable.control<string[]>(['Supply']),
    notes: this.formBuilder.nonNullable.control(''),
  });

  readonly settlements = signal<SettlementDraft[]>([]);

  readonly averageProsperity = computed(() => {
    if (!this.settlements().length) return 0;
    const total = this.settlements().reduce((sum, s) => sum + s.prosperity, 0);
    return Math.round(total / this.settlements().length);
  });

  readonly mostStressed = computed(() =>
    [...this.settlements()].sort((a, b) => b.concerns.length - a.concerns.length)[0] ?? null
  );

  addSettlement(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.settlements.update(list => [...list, { ...value, concerns: [...value.concerns] }]);
  }

  removeSettlement(index: number): void {
    this.settlements.update(list => list.filter((_, i) => i !== index));
  }

  toggleConcern(concern: string, checked: boolean): void {
    const concerns = this.form.controls.concerns.value;
    const updated = checked
      ? concerns.includes(concern)
        ? concerns
        : [...concerns, concern]
      : concerns.filter(item => item !== concern);
    this.form.controls.concerns.setValue(updated);
  }
}
