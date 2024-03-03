import { TestBed } from '@angular/core/testing';
import { DataInitFacadeService } from './data-init-facade.service';

describe('DataInitFacadeService', () => {
  let service: DataInitFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataInitFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
