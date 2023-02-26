import { TestBed } from '@angular/core/testing';

import { InitDataGuard } from './init-data.guard';

describe('InitDataGuard', () => {
  let guard: InitDataGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(InitDataGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
