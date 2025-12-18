import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HazardType } from '../../../enums/HazardType';
import { RoomBlueprint } from '../../../models/room-blueprint.model';

@Component({
  selector: 'app-room-creator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './room-creator.component.html',
  styleUrls: ['./room-creator.component.scss']
})
export class RoomCreatorComponent {
  private readonly formBuilder = new FormBuilder();

  readonly hazards: HazardType[] = Object.values(HazardType);

  readonly form = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    width: this.formBuilder.nonNullable.control(8, [Validators.required, Validators.min(2)]),
    height: this.formBuilder.nonNullable.control(6, [Validators.required, Validators.min(2)]),
    purpose: this.formBuilder.nonNullable.control('Crew quarters', Validators.required),
    hazards: this.formBuilder.nonNullable.control<HazardType[]>([HazardType.Intrusion]),
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
    const room: RoomBlueprint = {
      ...value,
      hazards: [...value.hazards],
    };

    this.rooms.update(list => [...list, room]);
  }

  removeRoom(index: number): void {
    this.rooms.update(list => list.filter((_, i) => i !== index));
  }

  toggleHazard(hazard: HazardType, checked: boolean): void {
    const hazards = this.form.controls.hazards.value;
    const next = checked
      ? hazards.includes(hazard)
        ? hazards
        : [...hazards, hazard]
      : hazards.filter(existing => existing !== hazard);
    this.form.controls.hazards.setValue(next);
  }
}
