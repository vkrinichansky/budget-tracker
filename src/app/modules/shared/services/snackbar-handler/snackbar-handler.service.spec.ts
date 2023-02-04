import { TestBed } from '@angular/core/testing';

import { SnackbarHandlerService } from './snackbar-handler.service';

describe('SnackbarHandlerService', () => {
  let service: SnackbarHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnackbarHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
