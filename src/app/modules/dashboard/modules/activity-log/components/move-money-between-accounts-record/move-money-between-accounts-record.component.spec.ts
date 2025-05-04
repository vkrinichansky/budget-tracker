import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoveMoneyBetweenAccountsRecordComponent } from './move-money-between-accounts-record.component';

describe('MoveMoneyBetweenAccountsRecordComponent', () => {
  let component: MoveMoneyBetweenAccountsRecordComponent;
  let fixture: ComponentFixture<MoveMoneyBetweenAccountsRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveMoneyBetweenAccountsRecordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MoveMoneyBetweenAccountsRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
