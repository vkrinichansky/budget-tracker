import { TestBed } from '@angular/core/testing';

import { ActionListenerService } from './action-listener.service';

describe('ActionListenerService', () => {
  let service: ActionListenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionListenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
