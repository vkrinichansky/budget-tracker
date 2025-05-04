import { TestBed } from '@angular/core/testing';

import { StatisticsInitApiService } from './statistics-init-api.service';

describe('StatisticsInitApiService', () => {
  let service: StatisticsInitApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatisticsInitApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
