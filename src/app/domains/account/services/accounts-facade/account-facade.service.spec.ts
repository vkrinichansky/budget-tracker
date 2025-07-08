import { TestBed } from '@angular/core/testing';

import { AccountsFacadeService } from './account-facade.service';

describe('AccountsFacadeService', () => {
  let service: AccountsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
