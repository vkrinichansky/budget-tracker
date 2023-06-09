import { TestBed } from '@angular/core/testing';

import { RootValuesFacadeService } from './root-values-facade.service';

describe('RootValuesFacadeService', () => {
  let service: RootValuesFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RootValuesFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
