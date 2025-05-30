import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomTooltipComponent } from './custom-tooltip.component';

describe('CustomTooltipComponent', () => {
  let component: CustomTooltipComponent;
  let fixture: ComponentFixture<CustomTooltipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomTooltipComponent],
    });
    fixture = TestBed.createComponent(CustomTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
