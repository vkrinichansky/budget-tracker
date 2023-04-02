import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootValueChangeRecordComponent } from './root-value-change-record.component';

describe('RootValueChangeRecordComponent', () => {
  let component: RootValueChangeRecordComponent;
  let fixture: ComponentFixture<RootValueChangeRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RootValueChangeRecordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RootValueChangeRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
