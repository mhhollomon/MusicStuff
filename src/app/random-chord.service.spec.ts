import { TestBed } from '@angular/core/testing';

import { RandomChordService } from './random-chord.service';

describe('RandomChordService', () => {
  let service: RandomChordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomChordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
