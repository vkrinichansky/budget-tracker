import { TestBed } from '@angular/core/testing';

import { SnapshotFacadeService } from './snapshot-facade.service';

describe('SnapshotFacadeService', () => {
  let service: SnapshotFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnapshotFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
