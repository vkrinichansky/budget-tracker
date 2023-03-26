import { TestBed } from '@angular/core/testing';

import { BudgetTrackerService } from './budget-tracker.service';

describe('BudgetTrackerService', () => {
  let service: BudgetTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
