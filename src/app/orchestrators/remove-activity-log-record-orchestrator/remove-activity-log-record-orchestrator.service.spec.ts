import { TestBed } from '@angular/core/testing';

import { RemoveAlRecordOrchestratorService } from './remove-activity-log-record-orchestrator.service';

describe('RemoveAlRecordOrchestratorService', () => {
  let service: RemoveAlRecordOrchestratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoveAlRecordOrchestratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
