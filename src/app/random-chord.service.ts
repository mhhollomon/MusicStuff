import { Injectable } from '@angular/core';
import { Choice, Chooser, mkch } from './chooser';
import { Scale, Note, ScaleType } from './key';
import { ScaleService } from './scale.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rotateArray(arr : any[], k : number) : any[] {
  return arr.slice(k).concat(arr.slice(0, k));
}

const noteChoices : Choice<number>[] = [
  mkch(1, 3), mkch(2, 1),
  mkch(3, 2), mkch(4, 1),
  mkch(5, 2), mkch(6, 1), mkch(7, 1)
]


const qualityToScaleType : { [key : string] : ScaleType } = {
  'min' : 'minor',
  'maj' : 'major',
  'dim' : 'phrygian',
  'aug' : 'augmented'
}

const inversionOffset = [0, 2, 4, 6];

const invertChooser = new Chooser([mkch(0, 5), mkch(1, 3), mkch(2, 2)]);

/* This is for Chromatic generation - much simpler */

const chromaticNotes = ['A', 'Bb', 'C', 'C#', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'Ab'];
const chromaticQualityChooser = new Chooser([ mkch('min', 3), mkch('maj', 3), mkch('dim', 1), mkch('aug', 1) ]);

export class Chord {
  root : string;
  name : string;
  inversion : number;
  chordType : ChordType;
  chordTones : Note[] = [];

  constructor(root  = 'C', name  = 'Cmaj', chordType : ChordType = 'triad', inversion  = 0) {
    this.root = root;
    this.name = name;
    this.inversion = inversion;
    this.chordType = chordType;
  }

  isSame(other : Chord) {
    return this.root === other.root;
  }
}

export type ChordType = 'triad' | '7th';

const chordTypeWeights : Choice<ChordType>[] = [ mkch<ChordType>('triad', 5), mkch<ChordType>('7th', 2)];

const diatonicChordQuailty : { [ index : string ] : string[] } = {
  'minor-triad' : [ 'min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'],
  'major-triad' : ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim' ],
  'minor-7th' : [ 'min7', 'dim7', 'maj7', 'min7', 'min7', 'maj7', 'maj7'],
  'major-7th' : ['maj7', 'min7', 'min7', 'maj7', '7', 'min7', 'dim7' ],
}

export type DuplicateControl = 'any' | 'not-adjacent' | 'none';

export class ChordSequenceBuilder {

  private noteChooser = new Chooser(noteChoices);
  private chromaticChooser = new Chooser(chromaticNotes.map(v => mkch(v)));

  private scaleCache : { [index: string] : Note[]} = {};

  // The options 
  public key : Scale | null = null;
  public count  = 4;
  public duplicates : DuplicateControl = 'any';
  public chordTypes : ChordType[] = [];

  public chordList : Chord[] = [];

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
    return this;
  }

  addChordType(ct : ChordType) : ChordSequenceBuilder {
    if (! this.chordTypes.includes(ct)) {
      this.chordTypes.push(ct);
    }
    return this;
  }

  generate_chords() : Chord[] {

    this.chordList = [];

    if (this.count < 1) {
      throw Error("count must be at least 1");
    }

    if (this.chordTypes.length < 1) {
      throw Error("must give at least one allowed chord type");
    }

    const retval : Chord[] = [];

    for (let index = 0; index < this.count; ++index) {
      this.chordList.push(this.find_a_chord());
    }

    return retval;
  }

  /* This tries to find a chord that meets the duplicates criteria */
  find_a_chord() : Chord {

    let try_again = true;
    let newChord = new Chord();
    let attempts = 300;
    while (try_again) {
      newChord = this.gen_one_chord(this.key, this.chordTypes);
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

  private gen_diatonic_chord(key : Scale, chordTypes : ChordType[]) {
    const scale = this.scaleService.getScaleNotes(key);
    const root = this.noteChooser.choose();
    const note = scale[root-1];

    const filtered = chordTypeWeights.filter(x => chordTypes.includes(x.choice));

    const chordType = (new Chooser(filtered)).choose();

    const qualKey = key.scaleType + '-' +  chordType;

    const chQual =  diatonicChordQuailty[qualKey];
    let name = note.noteDisplay() + chQual[root-1];

    const inversion = invertChooser.choose();

    if (inversion > 0) {
      const invOffset = inversionOffset[inversion];
      const bassDegree = ((root-1) + invOffset) % 7;
      const bassNote = scale[bassDegree];

      name = name + '/' + bassNote.noteDisplay();
    }

    return this.mkchord(key, note, name, inversion, chordType, root);

  }

  private gen_chromatic_chord(chordTypes : ChordType[]) : Chord {

    const note = new Note(this.chromaticChooser.choose());
    const chQual = chromaticQualityChooser.choose();
    let name = note.noteDisplay() + chQual;

    const filtered = chordTypeWeights.filter(x => chordTypes.includes(x.choice));

    const chordType = (new Chooser(filtered)).choose();

    name += (chordType ==='7th' ? '7' : '');
   
    const sn = new Scale(note, qualityToScaleType[chQual]);

    const scale = this.scaleService.getScaleNotes(sn);

    const inversion = invertChooser.choose();

    if (inversion > 0) {
      const invOffset = inversionOffset[inversion];
      const bassDegree = invOffset % 7;
      const bassNote = scale[bassDegree];

      name = name + '/' + bassNote.noteDisplay();      
  
    }

    return this.mkchord(sn, note, name, inversion, chordType);
  }

  gen_one_chord(key: Scale | null, chordTypes : ChordType[]) : Chord {

    if (key) {
      return this.gen_diatonic_chord(key, chordTypes);
    } else {
      return this.gen_chromatic_chord(chordTypes);
    }

  }

  private mkchord(key: Scale, note : Note, name : string, inv : number, 
          chordType : ChordType = 'triad', 
          rootDegree  = 1) : Chord {

    const scale = this.scaleService.getScaleNotes(key);
    let tones = inversionOffset.slice(0, chordType === 'triad' ? 3 : 4).map(i => scale[(i+(rootDegree-1))%7]);

    if (inv > 0) {
      //tones = tones.slice(inv).concat(tones.slice(0, inv));
      tones = rotateArray(tones, inv);
    }

    const chord = new Chord(note.note(), name, chordType, inv);
    chord.chordTones = tones;

    return chord;

  }


}

@Injectable({
  providedIn: 'root'
})
export class RandomChordService {

  constructor(private scaleService : ScaleService) { }

  builder() : ChordSequenceBuilder {
    return new ChordSequenceBuilder(this.scaleService);
  }

}
