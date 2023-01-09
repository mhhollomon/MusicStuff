import { Injectable } from '@angular/core';
import { Choice, Chooser, equalWeightedChooser, mkch } from './utils/chooser';
import { Scale, Note, Chord, ScaleType, ChordType } from './utils/music-theory/music-theory';
import { ScaleService } from './scale.service';
import { rotateArray, range } from './utils/util-library';


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


const diatonicChordQuailty : { [ index : string ] : string[] } = {
  'minor-triad' : [ 'min', 'dim', '', 'min', 'min', '', 'maj'],
  'major-triad' : ['', 'min', 'min', '', '', 'min', 'dim' ],
  'minor-7th' : [ 'min7', 'dim7', 'maj7', 'min7', 'min7', 'maj7', 'maj7'],
  'major-7th' : ['maj7', 'min7', 'min7', 'maj7', '7', 'min7', 'dim7' ],
  'minor-9th' : [ 'min9', 'dim9', 'maj9', 'min9', 'min9', 'maj9', 'maj9'],
  'major-9th' : ['maj9', 'min9', 'min9', 'maj9', '9', 'min9', 'dim9' ],
}

export type DuplicateControl = 'any' | 'not-adjacent' | 'none';

export class ChordSequenceBuilder {


  // The options 
  public key : Scale | null = null;
  public count  = 1;
  public duplicates : DuplicateControl = 'any';
  public chordTypes : ChordType[] = [];

  public chordList : Chord[] = [];


  private noteChooser = equalWeightedChooser(range(0,8));
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

    const qualKey = this.key.scaleType + '-' +  chordType;

    const chQual =  diatonicChordQuailty[qualKey];
    let name = note.noteDisplay() + chQual[root-1];

    const inversion = invertChooser.choose();

    if (inversion > 0) {
      const invOffset = inversionOffset[inversion];
      const bassDegree = ((root-1) + invOffset) % 7;
      const bassNote = scale[bassDegree];

      name = name + '/' + bassNote.noteDisplay();
    }

    return this.mkchord(this.key, note, name, inversion, chordType, root);

  }

  private gen_chromatic_chord() : Chord {

    const note = new Note(this.chromaticChooser.choose());
    const chQual = chromaticQualityChooser.choose();
    let name = note.noteDisplay() + chQual;

    const chordType = this.chordTypeChooser.choose();


    name += (chordType ==='7th' ? '7' : (chordType == '9th' ? '9' : ''));
   
    const sn = new Scale(note, qualityToScaleType[chQual]);

    const scale = this.scaleService.getScaleNotes(sn);

    const inversion = invertChooser.choose();

    if (inversion > 0) {
      const invOffset = inversionOffset[inversion];
      const bassDegree = invOffset % 7;
      const bassNote = scale[bassDegree];

      name = name + '/' + bassNote.noteDisplay();      
  
    }

    return this.mkchord(sn, note, name, inversion, chordType, 1);
  }

  gen_one_chord() : Chord {

    if (this.key) {
      return this.gen_diatonic_chord();
    } else {
      return this.gen_chromatic_chord();
    }

  }

  private mkchord(key: Scale, note : Note, name : string, 
          inv : number, 
          chordType : ChordType, 
          rootDegree : number) : Chord {

    const scale = this.scaleService.getScaleNotes(key);
    const toneCount = chordType === 'triad' ? 3 : (chordType === '7th' ? 4 : 5);
    let tones = inversionOffset.slice(0, toneCount).map(i => scale[(i+(rootDegree-1))%7]);

    if (inv > 0) {
      if (chordType != '9th') {
        tones = rotateArray(tones, inv);
      } else {
        if (equalWeightedChooser([true, false]).choose()) {
          // true = "add9", false = "9"
          // get rid of the 7th
          tones = tones.splice(0, 3).concat(tones.splice(-1));
          // rewrite the name - this is ugly, should move this up further
          const slash = name.lastIndexOf('/');
          let suffix = '';
          if (slash !== -1) {
            suffix = name.substring(slash);
            name = name.substring(0, slash);
          }

          // the last character of name is now 9 - remove it
          // and replace with (add9)
          name = name.substring(0, name.length-1) + "(add9)" + suffix;
        }

        // For ninths, we want that ninth to stay on top
        const topnote = tones[tones.length-1];
        let others = tones.slice(0, -1);

        others = rotateArray(others, inv);
        others.push(topnote);

        tones = others;
      }
    }

    const chord = new Chord(note.note(), name, chordType, inv);
    chord.chordTones = tones;

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
