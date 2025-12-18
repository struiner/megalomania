import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { HazardPickerComponent } from '../hazard-picker/hazard-picker.component';
import { HazardIconRegistryService } from '../../../services/hazard-icon-registry.service';
import { HazardType, HAZARD_DISPLAY_ORDER } from '../../../enums/HazardType';

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
  imports: [CommonModule, ReactiveFormsModule, HazardPickerComponent],
  templateUrl: './room-creator.component.html',
  styleUrls: ['./room-creator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomCreatorComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly hazardRegistry = inject(HazardIconRegistryService);

  readonly hazardOrder: HazardType[] = [...HAZARD_DISPLAY_ORDER];

  readonly form = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    width: this.formBuilder.nonNullable.control(8, [Validators.required, Validators.min(2)]),
    height: this.formBuilder.nonNullable.control(6, [Validators.required, Validators.min(2)]),
    purpose: this.formBuilder.nonNullable.control('Crew quarters', Validators.required),
    hazards: this.formBuilder.nonNullable.control<HazardType[]>([
      this.hazardOrder.find((hazard) => hazard === HazardType.Intrusion) ?? HazardType.Intrusion,
    ]),
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

  updateHazards(next: HazardType[]): void {
    const normalized = this.hazardRegistry.sortHazards(next);
    this.form.controls.hazards.setValue(normalized);
  }

  readableHazard(hazard: HazardType): string {
    return this.hazardRegistry.labelFor(hazard);
  }
}
