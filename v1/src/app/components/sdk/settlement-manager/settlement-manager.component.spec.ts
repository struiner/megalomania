import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementManagerComponent } from './settlement-manager.component';

describe('SettlementManagerComponent', () => {
  let component: SettlementManagerComponent;
  let fixture: ComponentFixture<SettlementManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettlementManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettlementManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
