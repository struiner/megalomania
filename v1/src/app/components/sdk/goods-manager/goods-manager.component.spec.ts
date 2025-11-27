import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsManagerComponent } from './goods-manager.component';

describe('GoodsManagerComponent', () => {
  let component: GoodsManagerComponent;
  let fixture: ComponentFixture<GoodsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoodsManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
