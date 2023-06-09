import { TestBed } from '@angular/core/testing';

import { CategoryModalsService } from './category-modals.service';

describe('CategoryModalsService', () => {
  let service: CategoryModalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryModalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
