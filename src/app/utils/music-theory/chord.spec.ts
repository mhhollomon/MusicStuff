import { Chord } from './chord';
import { Note } from './note';

describe('Chord', () => {
  it('should create an instance', () => {
    expect(new Chord()).toBeTruthy();
  });
});

describe('Chord.computeName', () => {
  it('should handle major triads', () => {
    const c = new Chord();

    c.chordTones = { 1: new Note('C'),  3 : new Note('E'),  5: new Note('G') };
    expect(c.name()).toBe('C');

    c.chordTones = { 1 : new Note('Bb'), 3 : new Note('D'), 5 : new Note('F') };
    expect(c.name()).toBe('Bb');

    c.chordTones = { 1: new Note('D'), 3 : new Note('F#'), 5 : new Note('A') };
    expect(c.name()).toBe('D');

  });

  it('should handle minor triads', () => {
    const c = new Chord();

    c.chordTones = { 1: new Note('C'), 3 : new Note('Eb'), 5 : new Note('G') };
    expect(c.name()).toBe('Cmin');

    c.chordTones = { 1 : new Note('Bb'), 3 : new Note('Db'), 5 : new Note('F') };
    expect(c.name()).toBe('Bbmin');

    c.chordTones = { 1: new Note('D'), 3: new Note('F'), 5 : new Note('A') };
    expect(c.name()).toBe('Dmin');

  });

  it('should handle diminished triads', () => {
    const c = new Chord();

    c.chordTones = { 1: new Note('C'), 3 : new Note('Eb'), 5 : new Note('Gb') };
    expect(c.name()).toBe('Cdim');

    c.chordTones = { 1: new Note('Bb'), 3 : new Note('Db'), 5 : new Note('Fb') };
    expect(c.name()).toBe('Bbdim');

    c.chordTones = { 1: new Note('D'), 3 : new Note('F'), 5 : new Note('Ab') };
    expect(c.name()).toBe('Ddim');

  }); 

  it('should handle augmented triads', () => {
    const c = new Chord();

    c.chordTones = { 1: new Note('C'), 3 : new Note('E'), 5 : new Note('G#') };
    expect(c.name()).toBe('Caug');

    c.chordTones = { 1: new Note('Bb'), 3 : new Note('D'), 5 : new Note('F#') };
    expect(c.name()).toBe('Bbaug');

    c.chordTones = { 1: new Note('D'), 3 : new Note('F#'), 5 : new Note('A#') };
    expect(c.name()).toBe('Daug');

  }); 

  it('should handle major 7th triads', () => {
    const c = new Chord();

    c.chordTones = { 1: new Note('C'), 3 : new Note('E'), 5 : new Note('G'), 7: new Note('B') };
    expect(c.name()).toBe('Cmaj7');

    c.chordTones = { 1: new Note('Bb'), 3 : new Note('D'), 5 : new Note('F'), 7: new Note('A') };
    expect(c.name()).toBe('Bbmaj7');

    c.chordTones = { 1: new Note('D'), 3 : new Note('F#'), 5 : new Note('A'), 7: new Note('C#') };
    expect(c.name()).toBe('Dmaj7');

  });

  it('should handle dominant 7th', () => {
    const c = new Chord();

    c.chordTones = { 1: new Note('C'), 3 : new Note('E'), 5 : new Note('G'), 7: new Note('Bb') };
    expect(c.name()).toBe('C7');

    c.chordTones = { 1: new Note('Bb'), 3 : new Note('D'), 5 : new Note('F'), 7: new Note('Ab') };
    expect(c.name()).toBe('Bb7');

    c.chordTones = { 1: new Note('D'), 3 : new Note('F#'), 5 : new Note('A'), 7: new Note('C') };
    expect(c.name()).toBe('D7');

  }); 

  it('should handle minor 7th', () => {
    const c = new Chord();

    c.chordTones = { 1: new Note('C'), 3 : new Note('Eb'), 5 : new Note('G'), 7: new Note('Bb') };
    expect(c.name()).toBe('Cmin7');

    c.chordTones = { 1: new Note('Bb'), 3 : new Note('Db'), 5 : new Note('F'), 7: new Note('Ab') };
    expect(c.name()).toBe('Bbmin7');

    c.chordTones = { 1: new Note('D'), 3 : new Note('F'), 5 : new Note('A'), 7: new Note('C') };
    expect(c.name()).toBe('Dmin7');

  });

  it('should handle minor 7 b5 (half diminshed)', () => {
    const c = new Chord();

    c.chordTones = { 1: new Note('C'), 3 : new Note('Eb'), 5 : new Note('Gb'), 7: new Note('Bb') };
    expect(c.name()).toBe('Cmin7b5');

    c.chordTones = { 1: new Note('Bb'), 3 : new Note('Db'), 5 : new Note('Fb'), 7: new Note('Ab') };
    expect(c.name()).toBe('Bbmin7b5');

    c.chordTones = { 1: new Note('D'), 3 : new Note('F'), 5 : new Note('Ab'), 7: new Note('C') };
    expect(c.name()).toBe('Dmin7b5');

  });

  it('should handle minor-major 7th', () => {
    const c = new Chord();

    c.chordTones = { 1: new Note('C'), 3 : new Note('Eb'), 5 : new Note('G'), 7: new Note('B') };
    expect(c.name()).toBe('Cminmaj7');

    c.chordTones = { 1: new Note('Bb'), 3 : new Note('Db'), 5 : new Note('F'), 7: new Note('A') };
    expect(c.name()).toBe('Bbminmaj7');

    c.chordTones = { 1: new Note('D'), 3 : new Note('F'), 5 : new Note('A'), 7: new Note('C#') };
    expect(c.name()).toBe('Dminmaj7');

  }); 

  it('should handle diminished 7th', () => {
    const c = new Chord();

    c.chordTones = { 1: new Note('C'), 3 : new Note('Eb'), 5 : new Note('Gb'), 7: new Note('Bbb') };
    expect(c.name()).toBe('Cdim7');

    c.chordTones = { 1:new Note('Bb'), 3 : new Note('Db'), 5 : new Note('Fb'), 7: new Note('Abb') };
    expect(c.name()).toBe('Bbdim7');

    c.chordTones = { 1: new Note('D'), 3 : new Note('F'), 5 : new Note('Ab'), 7: new Note('Cb') };
    expect(c.name()).toBe('Ddim7');

  });

  it('should fail with too few notes', () => {
    const c = new Chord();

    c.chordTones = { 1: new Note('C'), 3 : new Note('Eb') };
    expect(c.name()).toBe(undefined);

  });

  it('should fail when triad intervals are not correct', () => {
    const c = new Chord();

    c.chordTones = { 1: new Note('C'), 3 : new Note('D'), 5 : new Note('G') };
    expect(c.name()).toBe(undefined);
    c.chordTones = { 1: new Note('C'), 3 : new Note('F'), 5 : new Note('G') };
    expect(c.name()).toBe(undefined);
    c.chordTones = { 1: new Note('C'), 3 : new Note('E'), 5 : new Note('A') };
    expect(c.name()).toBe(undefined);
    c.chordTones = { 1: new Note('C'), 3 : new Note('E'), 5 : new Note('F#') };
    expect(c.name()).toBe(undefined);

  });

  it('should handle add 9', () => {
    const c = new Chord();
    c.chordType = '9th';

    c.chordTones = { 1: new Note('C'), 3 : new Note('E'), 5 : new Note('G'), 9: new Note('D') };
    expect(c.name()).toBe('Cmaj(add9)');

    c.chordTones = { 1: new Note('Bb'), 3 : new Note('D'), 5 : new Note('F'), 9: new Note('C') };
    expect(c.name()).toBe('Bbmaj(add9)');

    c.chordTones = { 1: new Note('D'), 3 : new Note('F#'), 5 : new Note('A'), 9: new Note('E') };
    expect(c.name()).toBe('Dmaj(add9)');

  }); 


});

describe('Chord.invertedChordTones', () => {

  it('should handle Emaj(add9)/G♯', () => {
    const c = new Chord();
    c.inversion = 1;
    c.chordType = '9th';
    c.addChordTone(1, new Note('E') ).addChordTone(3, new Note("G#"))
          .addChordTone(5, new Note("B"))
          .addChordTone(9, new Note("F#"))

    expect(c.invertedChordTones()).toEqual(
      [new Note("G#"), new Note("B"), new Note('E'), new Note("F#")]
    )

  });
});