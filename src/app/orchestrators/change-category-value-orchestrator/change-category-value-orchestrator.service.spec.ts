import { TestBed } from '@angular/core/testing';

import { ChangeCategoryValueOrchestratorService } from './change-category-value-orchestrator.service';

describe('ChangeCategoryValueOrchestratorService', () => {
  let service: ChangeCategoryValueOrchestratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeCategoryValueOrchestratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
