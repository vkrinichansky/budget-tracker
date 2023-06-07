import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesResetRecordComponent } from './categories-reset-record.component';

describe('CategoriesResetRecordComponent', () => {
  let component: CategoriesResetRecordComponent;
  let fixture: ComponentFixture<CategoriesResetRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriesResetRecordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesResetRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
