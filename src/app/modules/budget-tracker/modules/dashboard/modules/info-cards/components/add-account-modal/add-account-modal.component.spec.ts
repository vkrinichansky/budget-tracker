import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccountModalComponent } from './add-account-modal.component';

describe('AddAccountModalComponent', () => {
  let component: AddAccountModalComponent;
  let fixture: ComponentFixture<AddAccountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAccountModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
