import { TestBed } from '@angular/core/testing';

import { CategoriesFacadeService } from './categories-facade.service';

describe('CategoriesFacadeService', () => {
  let service: CategoriesFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
