import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsInfoCardComponent } from './accounts-info-card.component';

describe('AccountsInfoCardComponent', () => {
  let component: AccountsInfoCardComponent;
  let fixture: ComponentFixture<AccountsInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsInfoCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountsInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
