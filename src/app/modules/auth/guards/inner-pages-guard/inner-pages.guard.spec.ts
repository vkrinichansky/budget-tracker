import { TestBed } from '@angular/core/testing';

import { InnerPagesGuard } from './inner-pages.guard';

describe('InnerPagesGuard', () => {
  let guard: InnerPagesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(InnerPagesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
