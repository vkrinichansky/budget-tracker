import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryValueChangeRecordComponent } from './category-value-change-record.component';

describe('CategoryValueChangeRecordComponent', () => {
  let component: CategoryValueChangeRecordComponent;
  let fixture: ComponentFixture<CategoryValueChangeRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryValueChangeRecordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryValueChangeRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
