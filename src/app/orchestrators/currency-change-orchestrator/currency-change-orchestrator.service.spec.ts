import { TestBed } from '@angular/core/testing';

import { CurrencyChangeOrchestratorService } from './currency-change-orchestrator.service';

describe('CurrencyChangeOrchestratorService', () => {
  let service: CurrencyChangeOrchestratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencyChangeOrchestratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
