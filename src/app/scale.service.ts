import { Injectable } from '@angular/core';
import { Choice, Chooser, mkch } from './chooser';
import { Note, Scale, ScaleType, genericNotes } from './key'



/* number of semi-tones between notes */
const scaleStepData = {
  minor : [0, 2, 1, 2, 2, 1, 2],
  major : [0, 2, 2, 1, 2, 2, 2],
  phrygian : [0, 1, 2, 2, 1, 2, 2],
  augmented : [0, 2, 2, 2, 2, 1, 2],
} as const;

function mk_min_kc(root: string, weight? : number) {
  return mkch(new Scale(root, 'minor'), weight);
}

function mk_maj_kc(root: string, weight? : number) {
  return mkch(new Scale(root, 'major'), weight);
}

const sonorityChoices : Choice<ScaleType>[] = [
  mkch('major'), mkch('minor')
]

const majorKeyChoices : Choice<Scale>[] = [
  mk_maj_kc('C', 30), mk_maj_kc('F', 17), mk_maj_kc('G', 17),
  mk_maj_kc('D', 14), mk_maj_kc('Bb', 11), mk_maj_kc('A', 5),
  mk_maj_kc('Eb', 5)
]

const minorKeyChoices : Choice<Scale>[] = [
  mk_min_kc('A', 30), mk_min_kc('D', 17), mk_min_kc('E', 24), 
  mk_min_kc('C', 17), mk_min_kc('G', 17), mk_min_kc('B', 10)
]


@Injectable({
  providedIn: 'root'
})
export class ScaleService {

  private cache : { [index: string] : Note[] } = {};

  private sonorityChooser = new Chooser(sonorityChoices);
  private majorChooser = new Chooser(majorKeyChoices); 
  private minorChooser = new Chooser(minorKeyChoices);

  constructor() { }

  choose(sonority? : ScaleType ) : Scale {

    sonority = sonority ? sonority : this.sonorityChooser.choose();
    return ((sonority == 'minor') ? this.minorChooser : this.majorChooser).choose();
  }

  getScaleNotes(scale: Scale) : Note[] {

    if (scale.id() in this.cache) {
      return this.cache[scale.id()];
    } else {
      return this.generate_scale_notes(scale);
    }

  }

  private generate_scale_notes(scale : Scale) : Note[] {
    let notes :Note[] = [];

    let scaleSteps = scaleStepData[scale.scaleType];

    let current_generic_note = scale.rootNote.noteClass;
    let index = 0;
    while(genericNotes[index].name != current_generic_note) {
      index += 1;
    }

    notes.push(scale.rootNote);
    
    let scaleDegree = 1;
    while (scaleDegree < 7) {
      index += 1;
      let stepSize = genericNotes[index].prev;
      let neededStepSize = scaleSteps[scaleDegree];

      let newAlter = notes[notes.length-1].alter;

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

      notes.push(new Note(genericNotes[index].name, newAlter));
      scaleDegree += 1;
    }

    this.cache[scale.id()] = notes;

    return notes;

  }

  getMinorKeyList() : string[] {
    return minorKeyChoices.map(v => v.choice.root());
  }
  getMajorKeyList() : string[] {
    return majorKeyChoices.map(v => v.choice.root());
  }
}
