import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryValueModalComponent } from './category-value-modal.component';

describe('CategoryValueModalComponent', () => {
  let component: CategoryValueModalComponent;
  let fixture: ComponentFixture<CategoryValueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryValueModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryValueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
