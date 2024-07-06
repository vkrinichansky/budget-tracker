import { TestBed } from '@angular/core/testing';

import { AccountsListModalService } from './accounts-list-modal.service';

describe('AccountsListModalService', () => {
  let service: AccountsListModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountsListModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
