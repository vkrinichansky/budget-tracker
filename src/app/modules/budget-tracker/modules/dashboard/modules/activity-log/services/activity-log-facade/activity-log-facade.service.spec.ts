import { TestBed } from '@angular/core/testing';

import { ActivityLogFacadeService } from './activity-log-facade.service';

describe('ActivityLogFacadeService', () => {
  let service: ActivityLogFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityLogFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
