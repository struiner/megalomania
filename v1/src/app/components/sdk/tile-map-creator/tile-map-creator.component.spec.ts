import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TilemapCreationToolComponent } from './tile-map-creator.component';

describe('TilemapCreationToolComponent', () => {
  let component: TilemapCreationToolComponent;
  let fixture: ComponentFixture<TilemapCreationToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TilemapCreationToolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TilemapCreationToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
