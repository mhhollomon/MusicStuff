import { Injectable } from '@angular/core';
import { Choice, Chooser, mkch } from './utils/chooser';
import { Note, Scale, ScaleType } from './utils/music-theory/music-theory'


function mk_min_kc(root: string, weight? : number) {
  return mkch(new Scale(root, 'minor'), weight);
}

function mk_maj_kc(root: string, weight? : number) {
  return mkch(new Scale(root, 'major'), weight);
}

const sonorityChoices : Choice<ScaleType>[] = [
  mkch('major'), mkch('minor')
]

const majorKeyChoices : Choice<string>[] = [
  mkch('C', 30), mkch('F', 17), mkch('G', 17),
  mkch('D', 14), mkch('Bb', 11), mkch('A', 5),
  mkch('Eb', 5)
]

const minorKeyChoices : Choice<string>[] = [
  mkch('A', 30), mkch('D', 17), mkch('E', 24), 
  mkch('C', 17), mkch('G', 17), mkch('B', 10)
]


@Injectable({
  providedIn: 'root'
})
export class ScaleService {

  private cache : { [index: string] : Note[] } = {};

  private sonorityChooser = new Chooser(sonorityChoices);
  private majorChooser = new Chooser(majorKeyChoices); 
  private minorChooser = new Chooser(minorKeyChoices);

  choose(sonority? : ScaleType ) : Scale {

    sonority = sonority ? sonority : this.sonorityChooser.choose();
    const keycenter = ((sonority == 'minor') ? this.minorChooser : this.majorChooser).choose();
    return new Scale(keycenter, sonority);
  }

  getScaleNotes(scale: Scale) : Note[] {

    if (! (scale.id() in this.cache)) {
      this.cache[scale.id()] = scale.notesOfScale();
    }

    return this.cache[scale.id()];
  }


  getMinorKeyList() : string[] {
    return minorKeyChoices.map(v => v.choice);
  }
  getMajorKeyList() : string[] {
    return majorKeyChoices.map(v => v.choice);
  }
}
