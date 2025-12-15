import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { StructureType } from '../../../enums/StructureType';

interface ManagedStructure {
  name: string;
  type: StructureType;
  status: 'Queued' | 'Building' | 'Completed';
  owner: string;
}

@Component({
  selector: 'app-structuremanager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './structuremanager.component.html',
  styleUrls: ['./structuremanager.component.scss']
})
export class StructuremanagerComponent {
  private readonly formBuilder = new FormBuilder();

  readonly structureTypes = Object.values(StructureType);
  readonly statuses: ManagedStructure['status'][] = ['Queued', 'Building', 'Completed'];

  readonly filter = this.formBuilder.control<ManagedStructure['status'] | ''>('');

  readonly form = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control(''),
    type: this.formBuilder.nonNullable.control<StructureType>(StructureType.House),
    status: this.formBuilder.nonNullable.control<ManagedStructure['status']>('Queued'),
    owner: this.formBuilder.nonNullable.control('Unassigned'),
  });

  readonly structures = signal<ManagedStructure[]>([
    { name: 'Dawn Foundry', type: StructureType.Brickworks, status: 'Building', owner: 'Faded Guild' },
    { name: 'Harbor Gate', type: StructureType.Tower, status: 'Queued', owner: 'City Council' },
  ]);

  readonly filteredStructures = computed(() => {
    const target = this.filter.value;
    return target ? this.structures().filter(s => s.status === target) : this.structures();
  });

  addStructure(): void {
    const value = this.form.getRawValue();
    this.structures.update(list => [...list, value as ManagedStructure]);
    this.form.reset({
      name: '',
      type: StructureType.House,
      status: 'Queued',
      owner: 'Unassigned',
    });
  }

  markCompleted(structure: ManagedStructure): void {
    this.structures.update(list =>
      list.map(item => (item === structure ? { ...item, status: 'Completed' } : item))
    );
  }

  removeStructure(index: number): void {
    this.structures.update(list => list.filter((_, i) => i !== index));
  }
}
