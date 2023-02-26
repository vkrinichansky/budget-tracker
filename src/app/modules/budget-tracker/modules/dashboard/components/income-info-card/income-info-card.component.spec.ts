import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeInfoCardComponent } from './income-info-card.component';

describe('IncomeInfoCardComponent', () => {
  let component: IncomeInfoCardComponent;
  let fixture: ComponentFixture<IncomeInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomeInfoCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
