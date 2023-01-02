import { TestBed } from '@angular/core/testing';

import { AudioService } from './audio.service';

describe('AudioService', () => {
  let service: AudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns correct frequency information', () => {
    expect(service.get_note_freq("C#5")).toEqual(554.4);
    expect(service.get_note_freq("Db5")).toEqual(554.4);
  });
});
