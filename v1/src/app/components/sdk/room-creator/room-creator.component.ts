import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { HazardEnumAdapterService, HazardOption } from '../../../services/sdk/hazard-enum-adapter.service';
import { HazardType } from '../../../enums/HazardType';

interface RoomBlueprint {
  name: string;
  width: number;
  height: number;
  purpose: string;
  hazards: HazardType[];
  features: string;
}

@Component({
  selector: 'app-room-creator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './room-creator.component.html',
  styleUrls: ['./room-creator.component.scss']
})
export class RoomCreatorComponent {
  private readonly formBuilder = new FormBuilder();

  constructor(private readonly hazardEnumAdapter: HazardEnumAdapterService) {}

  readonly hazardOptions: HazardOption[] = this.hazardEnumAdapter.getHazardOptions();

  readonly form = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    width: this.formBuilder.nonNullable.control(8, [Validators.required, Validators.min(2)]),
    height: this.formBuilder.nonNullable.control(6, [Validators.required, Validators.min(2)]),
    purpose: this.formBuilder.nonNullable.control('Crew quarters', Validators.required),
    hazards: this.formBuilder.nonNullable.control<HazardType[]>(
      this.hazardEnumAdapter.sortSelection(this.hazardEnumAdapter.normalizeSelection([HazardType.Intrusion]))
    ),
    features: this.formBuilder.nonNullable.control('Sleeping pods, lockers, emergency mask cache'),
  });

  readonly rooms = signal<RoomBlueprint[]>([]);

  readonly lastCreated = computed(() => this.rooms()[this.rooms().length - 1] ?? null);

  readonly area = computed(() => this.form.controls.width.value * this.form.controls.height.value);

  createRoom(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const hazards = this.hazardEnumAdapter.sortSelection(
      this.hazardEnumAdapter.normalizeSelection(value.hazards)
    );
    const room: RoomBlueprint = {
      ...value,
      hazards,
    };

    this.rooms.update(list => [...list, room]);
  }

  removeRoom(index: number): void {
    this.rooms.update(list => list.filter((_, i) => i !== index));
  }

  isHazardChecked(option: HazardOption): boolean {
    const candidate = option.canonical ?? (option.value as HazardType);
    return this.form.controls.hazards.value.includes(candidate);
  }

  toggleHazard(hazard: HazardOption['value'], checked: boolean): void {
    const canonical = this.hazardEnumAdapter.normalizeSelection([hazard])[0];
    if (!canonical) {
      return;
    }

    const hazards = this.form.controls.hazards.value;
    const next = checked
      ? hazards.includes(canonical)
        ? hazards
        : [...hazards, canonical]
      : hazards.filter(existing => existing !== canonical);

    const normalized = this.hazardEnumAdapter.normalizeSelection(next);
    this.form.controls.hazards.setValue(this.hazardEnumAdapter.sortSelection(normalized));
  }
}
