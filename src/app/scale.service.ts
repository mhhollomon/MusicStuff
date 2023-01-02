import { Injectable } from '@angular/core';
import { Choice, Chooser, mkch } from './chooser';
import { Note, Scale, ScaleType, genericNotes } from './key'


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

    if (! (scale.id() in this.cache)) {
      this.cache[scale.id()] = scale.notesOfScale();
    }

    return this.cache[scale.id()];
  }


  getMinorKeyList() : string[] {
    return minorKeyChoices.map(v => v.choice.root());
  }
  getMajorKeyList() : string[] {
    return majorKeyChoices.map(v => v.choice.root());
  }
}
