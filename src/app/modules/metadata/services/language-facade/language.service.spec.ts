import { TestBed } from '@angular/core/testing';

import { LanguageFacadeService } from './language-facade.service';

describe('LanguageFacadeService', () => {
  let service: LanguageFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
