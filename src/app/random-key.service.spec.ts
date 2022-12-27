import { TestBed } from '@angular/core/testing';

import { RandomKeyService } from './random-key.service';

describe('RandomKeyService', () => {
  let service: RandomKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
