import { TestBed } from '@angular/core/testing';

import { ResetCategoriesOrchestratorService } from './reset-categories-orchestrator.service';

describe('ResetCategoriesOrchestratorService', () => {
  let service: ResetCategoriesOrchestratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResetCategoriesOrchestratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
