import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCardOrderItemComponent } from './info-card-order-item.component';

describe('InfoCardOrderItemComponent', () => {
  let component: InfoCardOrderItemComponent;
  let fixture: ComponentFixture<InfoCardOrderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoCardOrderItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoCardOrderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
