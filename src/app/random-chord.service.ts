import { Injectable } from '@angular/core';
import { Choice, Chooser, mkch } from './chooser';
import { Scale, Note, ScaleTypeEnum, ScaleType } from './key';
import { ScaleService } from './scale.service';

function rotateArray(arr : any[], k : number) : any[] {
  return arr.slice(k).concat(arr.slice(0, k));
}

const noteChoices : Choice<number>[] = [
  mkch(1, 3), mkch(2, 1),
  mkch(3, 2), mkch(4, 1),
  mkch(5, 2), mkch(6, 1), mkch(7, 1)
]

/* number of semi-tones between notes */
const minorQuality = [ 'min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'];
const majorQuality = ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim' ];

const qualityToScaleType : { [key : string] : ScaleType } = {
  'min' : 'minor',
  'maj' : 'major',
  'dim' : 'phrygian',
  'aug' : 'augmented'
}

const inversionOffset = [0, 2, 4];

const invertChooser = new Chooser([mkch(0, 5), mkch(1, 3), mkch(2, 2)]);

/* This is for Chromatic generation - much simpler */

const chromaticNotes = ['A', 'Bb', 'C', 'C#', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'Ab'];
const chromaticQualityChooser = new Chooser([ mkch('min', 3), mkch('maj', 3), mkch('dim', 1), mkch('aug', 1) ]);

export class Chord {
  root : string;
  name : string;
  inversion : number;
  chordTones : Note[] = [];

  constructor(root : string = 'C', name : string = 'Cmaj', inversion : number = 0) {
    this.root = root;
    this.name = name;
    this.inversion = inversion;
  }

  isSame(other : Chord) {
    return this.root === other.root;
  }
}


@Injectable({
  providedIn: 'root'
})
export class RandomChordService {
  private noteChooser = new Chooser(noteChoices);
  private chromaticChooser = new Chooser(chromaticNotes.map(v => mkch(v)));

  private scaleCache : { [index: string] : Note[]} = {};

  constructor(private scaleService : ScaleService) { }

  gen_chords(key : Scale | null, count : number, duplicates : string = 'any' ) : Chord[] {
    count = Math.floor(count);
    if (count < 1) {
      throw Error("count must be at least 1");
    }

    duplicates = duplicates.toLowerCase();

    let retval : Chord[] = [];

    if (count > 1) {
      retval = this.gen_chords(key, count -1, duplicates );
    }

    let try_again = true;
    let newChord = new Chord();
    while (try_again) {
      newChord = this.gen_one_chord(key);
      try_again = false;
      if (count > 1) {
        if (duplicates === 'not adjacent') {
          if (retval[retval.length-1].isSame(newChord)) {
            try_again = true;
          }
        } else if (duplicates === 'none') {
          for (let c of retval) {
            if (c.isSame(newChord)) {
              try_again = true;
            }
          }
        }
      }
    }

    retval.push(newChord)

    return retval;
  }

  private gen_diatonic_chord(key : Scale) {
    let scale = this.scaleService.getScaleNotes(key);
    let root = this.noteChooser.choose();
    let note = scale[root-1];

    let chQual = key.isMinor() ? minorQuality : majorQuality;
    let name = note.noteDisplay() + chQual[root-1];

    const inversion = invertChooser.choose();

    if (inversion > 0) {
      const invOffset = inversionOffset[inversion];
      const bassDegree = ((root-1) + invOffset) % 7;
      const bassNote = scale[bassDegree];

      name = name + '/' + bassNote.noteDisplay();
    }

    return this.mkchord(key, note, name, inversion, root);

  }

  private gen_chromatic_chord() : Chord {

    let note = new Note(this.chromaticChooser.choose());
    let chQual = chromaticQualityChooser.choose();
    let name = note.noteDisplay() + chQual;

    if (chQual in qualityToScaleType) {
      const sn = new Scale(note, qualityToScaleType[chQual])
      let scale = this.scaleService.getScaleNotes(sn);

      const inversion = invertChooser.choose();

      if (inversion > 0) {
        const invOffset = inversionOffset[inversion];
        let bassDegree = invOffset % 7;
        let bassNote = scale[bassDegree];
  
        name = name + '/' + bassNote.noteDisplay();

      }
      
      return this.mkchord(sn, note, name, inversion)
  
    }

    return new Chord(note.note(), name);
  }

  private gen_one_chord(key: Scale | null) : Chord {

    if (key) {
      return this.gen_diatonic_chord(key);
    } else {
      return this.gen_chromatic_chord();
    }

  }

  private mkchord(key: Scale, note : Note, name : string, inv : number, rootDegree :  number = 1) : Chord {

    const scale = this.scaleService.getScaleNotes(key);
    let tones = inversionOffset.map(i => scale[(i+(rootDegree-1))%7]);

    if (inv > 0) {
      //tones = tones.slice(inv).concat(tones.slice(0, inv));
      tones = rotateArray(tones, inv);
    }

    let chord = new Chord(note.note(), name, inv);
    chord.chordTones = tones;

    return chord;

  }

}
