import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { StructureType } from '../../../enums/StructureType';

interface StructureBlueprint {
  name: string;
  type: StructureType;
  complexity: number;
  upkeep: string;
  modules: string[];
  notes: string;
}

@Component({
  selector: 'app-structure-creator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './structure-creator.component.html',
  styleUrls: ['./structure-creator.component.scss']
})
export class StructureCreatorComponent {
  private readonly formBuilder = new FormBuilder();

  readonly types = Object.values(StructureType);
  readonly moduleOptions = ['Dock', 'Foundry', 'Garden', 'Hangar', 'Library', 'Brewery'];

  readonly form = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    type: this.formBuilder.nonNullable.control<StructureType>(StructureType.House, Validators.required),
    complexity: this.formBuilder.nonNullable.control(2, [Validators.required, Validators.min(1), Validators.max(5)]),
    upkeep: this.formBuilder.nonNullable.control('Stone + timber each week'),
    modules: this.formBuilder.nonNullable.control<string[]>(['Dock']),
    notes: this.formBuilder.nonNullable.control(''),
  });

  readonly blueprints = signal<StructureBlueprint[]>([]);

  readonly averageComplexity = computed(() => {
    if (!this.blueprints().length) return 0;
    const total = this.blueprints().reduce((sum, blueprint) => sum + blueprint.complexity, 0);
    return (total / this.blueprints().length).toFixed(1);
  });

  addBlueprint(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.blueprints.update(list => [...list, { ...value, modules: [...value.modules] }]);
  }

  removeBlueprint(index: number): void {
    this.blueprints.update(list => list.filter((_, i) => i !== index));
  }

  toggleModule(module: string, checked: boolean): void {
    const modules = this.form.controls.modules.value;
    const updated = checked
      ? modules.includes(module)
        ? modules
        : [...modules, module]
      : modules.filter(m => m !== module);
    this.form.controls.modules.setValue(updated);
  }
}
