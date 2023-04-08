import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeMoneyInfoCardComponent } from './free-money-info-card.component';

describe('FreeMoneyInfoCardComponent', () => {
  let component: FreeMoneyInfoCardComponent;
  let fixture: ComponentFixture<FreeMoneyInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeMoneyInfoCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreeMoneyInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
