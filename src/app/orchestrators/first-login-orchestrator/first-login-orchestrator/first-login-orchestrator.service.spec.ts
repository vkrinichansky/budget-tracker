import { TestBed } from '@angular/core/testing';

import { FirstLoginOrchestratorService } from './first-login-orchestrator.service';

describe('FirstLoginOrchestratorService', () => {
  let service: FirstLoginOrchestratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirstLoginOrchestratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
