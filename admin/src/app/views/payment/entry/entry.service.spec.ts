import { TestBed } from '@angular/core/testing';

import { FirmService } from './firm.service';

describe('FirmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirmService = TestBed.get(FirmService);
    expect(service).toBeTruthy();
  });
});
