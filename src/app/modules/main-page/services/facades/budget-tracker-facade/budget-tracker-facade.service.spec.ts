import { TestBed } from '@angular/core/testing';

import { BudgetTrackerFacadeService } from './budget-tracker-facade.service';

describe('BudgetTrackerFacadeService', () => {
  let service: BudgetTrackerFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetTrackerFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
