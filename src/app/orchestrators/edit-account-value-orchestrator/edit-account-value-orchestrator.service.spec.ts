import { TestBed } from '@angular/core/testing';

import { EditAccountValueOrchestratorService } from './edit-account-value-orchestrator.service';

describe('EditAccountValueOrchestratorService', () => {
  let service: EditAccountValueOrchestratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditAccountValueOrchestratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
