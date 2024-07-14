import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLogRemoveMenuComponent } from './activity-log-remove-menu.component';

describe('ActivityLogRemoveMenuComponent', () => {
  let component: ActivityLogRemoveMenuComponent;
  let fixture: ComponentFixture<ActivityLogRemoveMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityLogRemoveMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityLogRemoveMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
