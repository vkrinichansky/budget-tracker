import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyChangeRecordComponent } from './currency-change-record.component';

describe('CurrencyChangeRecordComponent', () => {
  let component: CurrencyChangeRecordComponent;
  let fixture: ComponentFixture<CurrencyChangeRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyChangeRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyChangeRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
