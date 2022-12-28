import { Injectable } from '@angular/core';
import { Choice, Chooser, mkch } from './chooser';
import { Key, Note } from './key';

interface GenericNoteData {
  name : string,
  next : number,
  prev : number
}

function gnd(name: string, prev : number, next : number) : GenericNoteData {
  return {'name' : name, 'next' : next, 'prev' : prev };
}

const noteChoices : Choice<number>[] = [
  mkch(1, 3), mkch(2, 1),
  mkch(3, 2), mkch(4, 1),
  mkch(5, 2), mkch(6, 1), mkch(7, 1)
]

/* Do two full octaves so we wont have to worry about wrap-around */
const allNotes : GenericNoteData[] = [
  gnd('A', 2, 2), gnd('B', 2, 1), gnd('C', 1, 2), gnd('D', 2, 2), gnd('E', 2, 1), gnd('F', 1, 2), gnd('G', 2, 2),
  gnd('A', 2, 2), gnd('B', 2, 1), gnd('C', 1, 2), gnd('D', 2, 2), gnd('E', 2, 1), gnd('F', 1, 2), gnd('G', 2, 2),
]

/* number of semi-tones between notes */
const minorScale = [0, 2, 1, 2, 2, 1, 2];
const minorQuality = [ 'min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'];
const majorScale = [0, 2, 2, 1, 2, 2, 2];
const majorQuality = ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim' ];

const inversionOffset = [0, 2, 4];

export interface Chord {
  root : string;
  name : string;
}


@Injectable({
  providedIn: 'root'
})
export class RandomChordService {
  private noteChooser = new Chooser(noteChoices);
  private invertChoose = new Chooser(inversionOffset.map(v => mkch(v)));

  private scaleCache : { [index: string] : Note[]} = {};

  constructor() { }

  gen_chords(key : Key, count : number ) : Chord[] {
    count = Math.floor(count);
    if (count < 1) {
      throw Error("count must be at least 1");
    }

    let scale = this.getScale(key);

    let retval : Chord[] = [];

    if (count > 1) {
      retval = this.gen_chords(key, count -1 );
    }

    let root = this.noteChooser.pick().choice;
    let note = scale[root-1];

    let chQual = key.isMinor() ? minorQuality : majorQuality;
    let name = note.note() + chQual[root-1];

    let invOffset = this.invertChoose.pick().choice;
    if (invOffset > 0) {
      let bassDegree = ((root-1) + invOffset) % 7;
      let bassNote = scale[bassDegree];

      name = name + '/' + bassNote.note();
    }


    retval.push({ 'root' : note.note(), 'name' : name})

    return retval;
  }

  private getScale(key : Key) : Note[] {

    let keyName = key.fullName();

    if (keyName in this.scaleCache) {
      return this.scaleCache[keyName];
    } else {
      return this.generateScale(key);
    }

  }

  private generateScale(key:Key) : Note[] {
    let scale :Note[] = [];

    let scaleSteps = (key.isMinor() ? minorScale : majorScale);

    let current_generic_note = key.rootNote.noteClass;
    let index = 0;
    while(allNotes[index].name != current_generic_note) {
      index += 1;
    }

    scale.push(key.rootNote);
    
    let scaleDegree = 1;
    while (scaleDegree < 7) {
      index += 1;
      let stepSize = allNotes[index].prev;
      let neededStepSize = scaleSteps[scaleDegree];

      let newAlter = scale[scale.length-1].alter;

      if (stepSize == neededStepSize) {
        // We want this note, but it needs to be altered the same
        // way that our current note is altered (to preserve the step size)

        // So, do nothing.
      } else if (stepSize < neededStepSize) {
        // Need to alter this new note up one from the last;
        newAlter += 1;
      } else { // stepSize > neededStepSize
        // Need to alter this new note down one from the last;
        newAlter -= 1;
      }

      scale.push(new Note(allNotes[index].name, newAlter));
      scaleDegree += 1;
    }

    this.scaleCache[key.fullName()] = scale;

    return scale;
  }
}
