import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LostConnectionMessageComponent } from './lost-connection-message.component';

describe('LostConnectionMessageComponent', () => {
  let component: LostConnectionMessageComponent;
  let fixture: ComponentFixture<LostConnectionMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LostConnectionMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LostConnectionMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
