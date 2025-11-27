import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureCreatorComponent } from './structure-creator.component';

describe('StructureCreatorComponent', () => {
  let component: StructureCreatorComponent;
  let fixture: ComponentFixture<StructureCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructureCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StructureCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
