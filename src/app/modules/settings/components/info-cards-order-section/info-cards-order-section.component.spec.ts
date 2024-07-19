import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCardsOrderSectionComponent } from './info-cards-order-section.component';

describe('InfoCardsOrderSectionComponent', () => {
  let component: InfoCardsOrderSectionComponent;
  let fixture: ComponentFixture<InfoCardsOrderSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoCardsOrderSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoCardsOrderSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
