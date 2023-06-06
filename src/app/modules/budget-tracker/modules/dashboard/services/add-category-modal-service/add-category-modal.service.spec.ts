import { TestBed } from '@angular/core/testing';

import { AddCategoryModalService } from './add-category-modal.service';

describe('AddCategoryModalService', () => {
  let service: AddCategoryModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddCategoryModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
