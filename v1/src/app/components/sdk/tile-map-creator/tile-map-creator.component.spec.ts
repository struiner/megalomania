import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileMapCreatorComponent } from './tile-map-creator.component';

describe('TileMapCreatorComponent', () => {
  let component: TileMapCreatorComponent;
  let fixture: ComponentFixture<TileMapCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileMapCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TileMapCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
