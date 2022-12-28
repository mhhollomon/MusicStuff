import { Injectable } from '@angular/core';
import { Choice, Chooser, mkch } from './chooser';
import { Key } from './key'

function mk_min_kc(root: string, weight? : number) {
  return mkch(new Key(root, 'minor'), weight);
}

function mk_maj_kc(root: string, weight? : number) {
  return mkch(new Key(root, 'major'), weight);
}

const sonorityChoices : Choice<string>[] = [
  mkch('major'), mkch('minor')
]

const majorKeyChoices : Choice<Key>[] = [
  mk_maj_kc('C', 30), mk_maj_kc('F', 17), mk_maj_kc('G', 17),
  mk_maj_kc('D', 14), mk_maj_kc('Bb', 11), mk_maj_kc('A', 5),
  mk_maj_kc('Eb', 5)
]

const minorKeyChoices : Choice<Key>[] = [
  mk_min_kc('A', 30), mk_min_kc('D', 17), mk_min_kc('E', 24), 
  mk_min_kc('C', 17), mk_min_kc('G', 17), mk_min_kc('B', 10)
]


@Injectable({
  providedIn: 'root'
})
export class RandomKeyService {

  private sonorityChooser = new Chooser(sonorityChoices);
  private majorChooser = new Chooser(majorKeyChoices); 
  private minorChooser = new Chooser(minorKeyChoices);

  constructor() { }

  pick() : Key {
    let sonority = this.sonorityChooser.pick().choice;
    return ((sonority == 'minor') ? this.minorChooser : this.majorChooser).pick().choice;
  }
}
