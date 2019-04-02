import { TestBed } from '@angular/core/testing';

import { WorkNewService } from './workNew.service';

describe('WorkNewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkNewService = TestBed.get(WorkNewService);
    expect(service).toBeTruthy();
  });
});
