import { TestBed } from '@angular/core/testing';

import { MetadataFacadeService } from './metadata-facade.service';

describe('MetadataFacadeService', () => {
  let service: MetadataFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetadataFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
