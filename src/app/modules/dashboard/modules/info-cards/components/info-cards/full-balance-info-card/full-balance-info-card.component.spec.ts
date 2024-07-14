import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceInfoCardComponent } from './full-balance-info-card.component';

describe('BalanceInfoCardComponent', () => {
  let component: BalanceInfoCardComponent;
  let fixture: ComponentFixture<BalanceInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceInfoCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
