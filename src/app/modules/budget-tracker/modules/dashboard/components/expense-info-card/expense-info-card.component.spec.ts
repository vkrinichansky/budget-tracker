import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseInfoCardComponent } from './expense-info-card.component';

describe('ExpenseInfoCardComponent', () => {
  let component: ExpenseInfoCardComponent;
  let fixture: ComponentFixture<ExpenseInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseInfoCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
