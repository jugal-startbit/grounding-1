import { TestBed } from '@angular/core/testing';

import { IndividualService } from './individual.service';

describe('IndividualService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndividualService = TestBed.get(IndividualService);
    expect(service).toBeTruthy();
  });
});
