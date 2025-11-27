import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructuremanagerComponent } from './structuremanager.component';

describe('StructuremanagerComponent', () => {
  let component: StructuremanagerComponent;
  let fixture: ComponentFixture<StructuremanagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructuremanagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StructuremanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
