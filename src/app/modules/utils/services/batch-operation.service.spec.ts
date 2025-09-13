/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BatchOperationService } from './batch-operation.service';

describe('Service: BatchOperation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BatchOperationService]
    });
  });

  it('should ...', inject([BatchOperationService], (service: BatchOperationService) => {
    expect(service).toBeTruthy();
  }));
});
