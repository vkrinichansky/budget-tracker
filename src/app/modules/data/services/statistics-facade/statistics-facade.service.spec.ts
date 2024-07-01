/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StatisticsFacadeService } from './statistics-facade.service';

describe('Service: StatisticsFacade', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatisticsFacadeService]
    });
  });

  it('should ...', inject([StatisticsFacadeService], (service: StatisticsFacadeService) => {
    expect(service).toBeTruthy();
  }));
});
