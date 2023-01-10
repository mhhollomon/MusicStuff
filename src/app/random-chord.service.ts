import { Injectable } from '@angular/core';
import { Choice, Chooser, equalWeightedChooser, mkch } from './utils/chooser';
import { Scale, Note, Chord, ScaleType, ChordType } from './utils/music-theory/music-theory';
import { ScaleService } from './scale.service';
import { range } from './utils/util-library';


const qualityToScaleType : { [key : string] : ScaleType } = {
  'min' : 'minor',
  'maj' : 'major',
  'dim' : 'phrygian',
  'aug' : 'augmented'
}

const inversionOffset = [0, 2, 4, 6, 8];

const invertChooser = new Chooser([mkch(0, 5), mkch(1, 3), mkch(2, 2)]);

/* This is for Chromatic generation - much simpler */

const chromaticNotes = ['A', 'Bb', 'C', 'C#', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'Ab'];
const chromaticQualityChooser = new Chooser([ mkch('min', 3), mkch('maj', 3), mkch('dim', 1), mkch('aug', 1) ]);


export type DuplicateControl = 'any' | 'not-adjacent' | 'none';

export class ChordSequenceBuilder {


  // The options 
  public key : Scale | null = null;
  public count  = 1;
  public duplicates : DuplicateControl = 'any';
  public chordTypes : ChordType[] = [];

  public chordList : Chord[] = [];


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

  setCount(c : number) : ChordSequenceBuilder {

    if (c < 1) {
      throw Error("Count must be 1 or greater");
    }
    this.count = Math.floor(c);

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

  generate_chords() : Chord[] {

    if (this.count < 1) {
      throw Error("count must be at least 1");
    }

    if (this.chordTypes.length < 1) {
      throw Error("must give at least one allowed chord type");
    }

    this.chordList = [];

    for (let index = 0; index < this.count; ++index) {
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

    const scale = this.scaleService.getScaleNotes(this.key);
    const root = this.noteChooser.choose();
    const note = scale[root-1];

    const chordType = this.chordTypeChooser.choose();

    const inversion = invertChooser.choose();

    return this.mkchord(this.key, note, inversion, chordType, root);

  }

  private gen_chromatic_chord() : Chord {

    const note = new Note(this.chromaticChooser.choose());
    const chQual = chromaticQualityChooser.choose();

    const chordType = this.chordTypeChooser.choose();
   
    const sn = new Scale(note, qualityToScaleType[chQual]);

    const inversion = invertChooser.choose();

    return this.mkchord(sn, note, inversion, chordType, 1);
  }

  gen_one_chord() : Chord {

    if (this.key) {
      return this.gen_diatonic_chord();
    } else {
      return this.gen_chromatic_chord();
    }

  }

  private mkchord(key: Scale, note : Note, 
          inv : number, 
          chordType : ChordType, 
          rootDegree : number) : Chord {

    const scale = this.scaleService.getScaleNotes(key);
    const toneCount = chordType === 'triad' ? 3 : (chordType === '7th' ? 4 : 5);
    let tones = inversionOffset.slice(0, toneCount).map(i => scale[(i+(rootDegree-1))%7]);

    if (chordType === '9th') {
      if (equalWeightedChooser([true, false]).choose()) {
        // true = "add9", false = "9"
        // get rid of the 7th
        tones = tones.splice(0, 3).concat(tones.splice(-1));
      }

    }

    const chord = new Chord(note, chordType, inv);
    chord.addChordTone(1, tones[0]);
    chord.addChordTone(3, tones[1]);
    chord.addChordTone(5, tones[2]);

    if (chordType === '7th') {
      chord.addChordTone(7, tones[3]);     
    } else if (chordType === '9th') {
      if (tones.length == 4) {
        chord.addChordTone(9, tones[3])
      } else {
        chord.addChordTone(7, tones[3])
        chord.addChordTone(9, tones[4])
      }
    }
    return chord;

  }

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
