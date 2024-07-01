import { TestBed } from '@angular/core/testing';

import { LostConnectionService } from './lost-connection.service';

describe('LostConnectionService', () => {
  let service: LostConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LostConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
