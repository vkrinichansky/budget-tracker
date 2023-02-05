import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationBarItemComponent } from './navigation-bar-item.component';

describe('NavigationBarItemComponent', () => {
  let component: NavigationBarItemComponent;
  let fixture: ComponentFixture<NavigationBarItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationBarItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationBarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
