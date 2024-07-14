import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsListModalComponent } from './accounts-list-modal.component';

describe('AccountsListModalComponent', () => {
  let component: AccountsListModalComponent;
  let fixture: ComponentFixture<AccountsListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsListModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountsListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
