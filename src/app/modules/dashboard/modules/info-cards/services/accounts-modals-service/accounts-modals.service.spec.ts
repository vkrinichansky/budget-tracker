import { TestBed } from '@angular/core/testing';

import { AccountsModalsService } from './accounts-modals.service';

describe('AccountsModalsService', () => {
  let service: AccountsModalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountsModalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
