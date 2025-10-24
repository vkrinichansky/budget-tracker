import { TestBed } from '@angular/core/testing';

import { CategoryFacadeService } from './category-facade.service';

describe('CategoryFacadeService', () => {
  let service: CategoryFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
