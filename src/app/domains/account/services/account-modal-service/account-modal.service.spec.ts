import { TestBed } from '@angular/core/testing';

import { AccountModalService } from './account-modal.service';

describe('AccountModalService', () => {
  let service: AccountModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
