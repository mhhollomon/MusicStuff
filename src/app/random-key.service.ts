import { Injectable } from '@angular/core';
import { Choice, Chooser, mkch } from './chooser';
import { Key } from './key'

const sonorityChoices : Choice<string>[] = [
  mkch('major'), mkch('minor')
]

const minorKeyChoices : Choice<string>[] = [
  mkch('A', 30), mkch('D', 17), mkch('G', 17), 
  mkch('C', 17), mkch('E', 24), mkch('B', 10)
]

const majorKeyChoices : Choice<string>[] = [
  mkch('C', 30), mkch('F', 17), mkch('G', 17),
  mkch('D', 14), mkch('Bb', 11), mkch('A', 5),
  mkch('Eb', 5)
]

@Injectable({
  providedIn: 'root'
})
export class RandomKeyService {

  sonorityChooser = new Chooser(sonorityChoices);
  minorChooser = new Chooser(minorKeyChoices);
  majorChooser = new Chooser(majorKeyChoices); 

  constructor() { }

  pick() : Key {
    let sonority = this.sonorityChooser.pick().choice;
    let is_minor = (sonority == 'minor');
    let the_root = (is_minor ? this.minorChooser : this.majorChooser).pick().choice;
    return new Key(the_root, sonority);
  }
}
