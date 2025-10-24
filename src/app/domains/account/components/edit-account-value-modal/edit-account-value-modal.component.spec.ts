import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccountValueModalComponent } from './edit-account-value-modal.component';

describe('EditAccountValueModalComponent', () => {
  let component: EditAccountValueModalComponent;
  let fixture: ComponentFixture<EditAccountValueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAccountValueModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAccountValueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
