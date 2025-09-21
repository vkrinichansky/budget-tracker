import { TestBed } from '@angular/core/testing';

import { MonthResetOrchestratorService } from './month-reset-orchestrator.service';

describe('MonthResetOrchestratorService', () => {
  let service: MonthResetOrchestratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonthResetOrchestratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
