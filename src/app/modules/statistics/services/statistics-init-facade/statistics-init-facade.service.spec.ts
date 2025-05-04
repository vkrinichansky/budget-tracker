import { TestBed } from '@angular/core/testing';

import { StatisticsInitFacadeService } from './statistics-init-facade.service';

describe('StatisticsInitFacadeService', () => {
  let service: StatisticsInitFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatisticsInitFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
