import { TestBed } from '@angular/core/testing';

import { MoveMoneyBetweenAccountsOrchestratorService } from './move-money-between-accounts-orchestrator.service';

describe('MoveMoneyBetweenAccountsOrchestratorService', () => {
  let service: MoveMoneyBetweenAccountsOrchestratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoveMoneyBetweenAccountsOrchestratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
