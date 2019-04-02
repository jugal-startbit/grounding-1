import { TestBed } from '@angular/core/testing';

import { WorkExistingService } from './workExisting.service';

describe('WorkExistingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkExistingService = TestBed.get(WorkExistingService);
    expect(service).toBeTruthy();
  });
});
