import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FullBalanceInfoCardComponent } from './full-balance-info-card.component';

describe('FullBalanceInfoCardComponent', () => {
  let component: FullBalanceInfoCardComponent;
  let fixture: ComponentFixture<FullBalanceInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FullBalanceInfoCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FullBalanceInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
