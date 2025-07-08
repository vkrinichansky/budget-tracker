import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoveMoneyBetweenAccountsModalComponent } from './move-money-between-accounts-modal.component';

describe('MoveMoneyBetweenAccountsModalComponent', () => {
  let component: MoveMoneyBetweenAccountsModalComponent;
  let fixture: ComponentFixture<MoveMoneyBetweenAccountsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveMoneyBetweenAccountsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MoveMoneyBetweenAccountsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
