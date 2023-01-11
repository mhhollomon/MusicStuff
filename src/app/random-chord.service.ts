import { Injectable } from '@angular/core';
import { Choice, Chooser, equalWeightedChooser, mkch, yesno } from './utils/chooser';
import { Scale, Note, Chord, ScaleType, ChordType, ExtensionType } from './utils/music-theory/music-theory';
import { ScaleService } from './scale.service';
import { range } from './utils/util-library';


const qualityToScaleType : { [key : string] : ScaleType } = {
  'min' : 'minor',
  'maj' : 'major',
  'dim' : 'phrygian',
  'aug' : 'augmented'
}

const invertChooser = new Chooser([mkch(0, 5), mkch(1, 3), mkch(2, 2)]);

/* This is for Chromatic generation - much simpler */

const chromaticNotes = ['A', 'Bb', 'C', 'C#', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'Ab'];
const chromaticQualityChooser = new Chooser([ mkch('min', 3), mkch('maj', 3), mkch('dim', 1), mkch('aug', 1) ]);


export type DuplicateControl = 'any' | 'not-adjacent' | 'none';

export class ChordSequenceBuilder {


  // The options 
  public key : Scale | null = null;
  public min_count = 1;
  public max_count = 1;
  public duplicates : DuplicateControl = 'any';
  public chordTypes : ChordType[] = [];

  public chordList : Chord[] = [];

  public extensions : {[index : string ] : number } = {};


  private noteChooser = equalWeightedChooser(range(1,8));
  private chromaticChooser = new Chooser(chromaticNotes.map(v => mkch(v)));
  private chordTypeChooser = new Chooser([mkch<ChordType>('triad', 1)])


  constructor(private scaleService : ScaleService) { }

  setKey(newKey : Scale | null) : ChordSequenceBuilder;
  setKey(newKey : string, scaleType : ScaleType) : ChordSequenceBuilder;
  setKey(newKey : string | Scale | null, scaleType? : ScaleType) : ChordSequenceBuilder {

    if (typeof newKey === 'string') {
      if (! scaleType) { 
        throw Error("No scale Type given with key name")
      }
      this.key = new Scale(newKey, scaleType);
    } else {
      this.key = newKey;
    }

    return this;
  }

  setCount(min : number, max? : number) : ChordSequenceBuilder {

    min = Math.floor(min);

    if (max == undefined) max=min;

    if (max < min) {
      throw Error ("max must be >= min");
    }

    if (min < 1) {
      throw Error("min must be >= 1");
    }

    this.min_count = min;
    this.max_count = max;

    return this;
  }

  setDuplicate(dc : DuplicateControl) : ChordSequenceBuilder {
    this.duplicates = dc;
    return this;
  }

  setChordTypes(ct : ChordType[]) : ChordSequenceBuilder {
    this.chordTypes = ct;

    this.chordTypeChooser = equalWeightedChooser(this.chordTypes);

    return this;
  }

  addChordType(ct : ChordType, weight = 1) : ChordSequenceBuilder {
    if (! this.chordTypes.includes(ct)) {
      this.chordTypes.push(ct);

      const choices : Choice<ChordType>[] = 
            (this.chordTypes.length > 0) ? this.chordTypeChooser.choices : [];

      choices.push(mkch(ct, weight));

      this.chordTypeChooser = new Chooser(choices);
    }
    return this;
  }

  addExtension (ext : ExtensionType, weight : number) : ChordSequenceBuilder {

    this.extensions[ext] = weight;

    return this;
  }

  generate_chords() : Chord[] {


    if (this.chordTypes.length < 1) {
      throw Error("must give at least one allowed chord type");
    }

    const chord_count = equalWeightedChooser(range(this.min_count, this.max_count+1)).choose();

    this.chordList = [];

    for (let index = 0; index < chord_count; ++index) {
      this.chordList.push(this.find_a_chord());
    }

    return this.chordList;
  }

  /* This tries to find a chord that meets the duplicates criteria */
  find_a_chord() : Chord {

    let try_again = true;
    let newChord = new Chord();
    let attempts = 300;
    while (try_again) {
      newChord = this.gen_one_chord();
      try_again = false;
      attempts -= 1;

      if (attempts < 1) throw Error("Could not create a nonduplicate chord after 300 tries.")
      if (this.chordList.length > 0) {
        if (this.duplicates === 'not-adjacent') {
          if (this.chordList[this.chordList.length-1].isSame(newChord)) {
            try_again = true;
          }
        } else if (this.duplicates === 'none') {
          for (const c of this.chordList) {
            if (c.isSame(newChord)) {
              try_again = true;
            }
          }
        }
      }
    }

    return newChord;
  }

  private gen_diatonic_chord() {

    if (! this.key) {
      throw("somebody goofed");
    }

    const chord = new Chord();

    const scale = this.scaleService.getScaleNotes(this.key);
    const rootDegree = this.noteChooser.choose();
    const note = scale[rootDegree-1];

    chord.root = note;

    chord.chordType = this.chordTypeChooser.choose();

    chord.inversion = invertChooser.choose();

    return this.mkchord(this.key, chord, rootDegree);

  }

  private gen_chromatic_chord() : Chord {

    const note = new Note(this.chromaticChooser.choose());
    const chQual = chromaticQualityChooser.choose();

    const chord = new Chord();

    chord.chordType = this.chordTypeChooser.choose();

    const scale = new Scale(note, qualityToScaleType[chQual]);
    chord.root = note;

    chord.inversion = invertChooser.choose();

    return this.mkchord(scale, chord, 1);
  }

  gen_one_chord() : Chord {

    if (this.key) {
      return this.gen_diatonic_chord();
    } else {
      return this.gen_chromatic_chord();
    }

  }

  private mkchord(key : Scale, chord : Chord, rootDegree : number) : Chord {


    const scale = this.scaleService.getScaleNotes(key);

    chord.addChordTone(1, scale[degreeToScale(rootDegree, 1)]);
    chord.addChordTone(5, scale[degreeToScale(rootDegree, 5)]);

    // The chord quality is a diminished - can't have a sus chord.
    if ((chord.chordType === 'sus2' || chord.chordType === 'sus4') && 
            chord.chordTones[1].interval(chord.chordTones[5]) !== 7 ) {
      chord.chordType = 'triad';
    }

    if (chord.chordType === 'sus2') {
      chord.addChordTone(2, scale[degreeToScale(rootDegree, 2)]);
    } else if (chord.chordType === 'sus4') {
      chord.addChordTone(4, scale[degreeToScale(rootDegree, 4)]);
    } else {
      chord.addChordTone(3, scale[degreeToScale(rootDegree, 3)]);
    }


    if (this.extensions['7th']) {
      chord.addChordTone(7, scale[degreeToScale(rootDegree, 7)]);
    }
    if (this.extensions['9th']) {
      if (yesno(this.extensions['9th'], 3)) {
        chord.addChordTone(9, scale[degreeToScale(rootDegree, 9)]);
        chord.extensions['9th'] = true;
      }
    }

    if (this.extensions['11th']) {
      if (yesno(this.extensions['11th'], 3)) {
        chord.addChordTone(11, scale[degreeToScale(rootDegree, 11)]);
        chord.extensions['11th'] = true;
      }
    }


    return chord;

  }

}

function degreeToScale(rootDegree : number, chordal : number) {
  return (chordal-1 + rootDegree-1)%7
}

/********************************************************
 * The SERVICE
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class RandomChordService {

  constructor(private scaleService : ScaleService) { }

  builder() : ChordSequenceBuilder {
    return new ChordSequenceBuilder(this.scaleService);
  }

}
