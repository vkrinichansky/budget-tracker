import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryManagementRecordComponent } from './category-management-record.component';

describe('CategoryManagementRecordComponent', () => {
  let component: CategoryManagementRecordComponent;
  let fixture: ComponentFixture<CategoryManagementRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryManagementRecordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryManagementRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
