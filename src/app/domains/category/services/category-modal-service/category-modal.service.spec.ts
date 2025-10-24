import { TestBed } from '@angular/core/testing';

import { CategoryModalService } from './category-modals.service';

describe('CategoryModalService', () => {
  let service: CategoryModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
