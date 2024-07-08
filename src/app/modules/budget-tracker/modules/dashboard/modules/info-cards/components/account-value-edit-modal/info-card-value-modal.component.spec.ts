import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountValueEditModalComponent } from './account-value-edit-modal.component';

describe('InfoCardValueModalComponent', () => {
  let component: AccountValueEditModalComponent;
  let fixture: ComponentFixture<AccountValueEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountValueEditModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountValueEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
