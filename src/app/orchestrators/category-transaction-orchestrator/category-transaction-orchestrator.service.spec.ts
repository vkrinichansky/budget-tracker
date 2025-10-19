import { TestBed } from '@angular/core/testing';

import { CategoryTransactionOrchestratorService } from './category-transaction-orchestrator.service';

describe('CategoryTransactionOrchestratorService', () => {
  let service: CategoryTransactionOrchestratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryTransactionOrchestratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
