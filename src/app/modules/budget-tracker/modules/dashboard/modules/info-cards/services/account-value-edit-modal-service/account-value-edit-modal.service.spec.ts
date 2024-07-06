import { TestBed } from '@angular/core/testing';

import { InfoCardValueModalService } from './account-value-edit-modal.service';

describe('InfoCardValueModalService', () => {
  let service: InfoCardValueModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoCardValueModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
