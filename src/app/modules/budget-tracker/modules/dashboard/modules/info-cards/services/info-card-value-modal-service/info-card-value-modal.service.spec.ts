import { TestBed } from '@angular/core/testing';

import { InfoCardValueModalService } from './info-card-value-modal.service';

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
