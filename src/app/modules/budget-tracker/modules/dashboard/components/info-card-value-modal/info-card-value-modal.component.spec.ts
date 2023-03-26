import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCardValueModalComponent } from './info-card-value-modal.component';

describe('InfoCardValueModalComponent', () => {
  let component: InfoCardValueModalComponent;
  let fixture: ComponentFixture<InfoCardValueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoCardValueModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoCardValueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
