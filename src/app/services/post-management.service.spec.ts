import { TestBed } from '@angular/core/testing';

import { PostManagementService } from './post-management.service';

describe('PostManagementService', () => {
  let service: PostManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
