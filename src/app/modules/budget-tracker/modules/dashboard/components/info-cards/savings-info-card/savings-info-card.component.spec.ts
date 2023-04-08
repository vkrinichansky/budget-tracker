import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsInfoCardComponent } from './savings-info-card.component';

describe('SavingsInfoCardComponent', () => {
  let component: SavingsInfoCardComponent;
  let fixture: ComponentFixture<SavingsInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavingsInfoCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingsInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
