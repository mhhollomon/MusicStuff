import { TestBed } from '@angular/core/testing';

import { Chord, RandomChordService } from './random-chord.service';

describe('RandomChordService', () => {
  let service: RandomChordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomChordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("gen_chords", () => {
    it('should fail if requested count < 1', () => {
      expect(()=> { service.gen_chords(null, 0, 'any', ['triad'])}).toThrow();
    });

    it('should fail if no chord types are given' , () => {
      expect(()=> { service.gen_chords(null, 1, 'any', [])}).toThrow();
    });

    it('should fail if it can\'t dedup', () => {
      spyOn(service, 'gen_one_chord').and.returnValue(new Chord("C", "maj", 'triad', 0));

      expect(() => {service.gen_chords(null, 2, 'none', ['triad'])}).withContext('none').toThrowError();
      expect(() => {service.gen_chords(null, 2, 'not adjacent', ['triad'])}).withContext('not adjacent').toThrowError();
      expect(() => {service.gen_chords(null, 2, 'any', ['triad'])}).withContext('any').not.toThrowError();

    });

  });
});
