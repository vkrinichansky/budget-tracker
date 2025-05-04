import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentMonthBalanceInfoCardComponent } from './current-month-balance-info-card.component';

describe('CurrentMonthBalanceInfoCardComponent', () => {
  let component: CurrentMonthBalanceInfoCardComponent;
  let fixture: ComponentFixture<CurrentMonthBalanceInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentMonthBalanceInfoCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentMonthBalanceInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
