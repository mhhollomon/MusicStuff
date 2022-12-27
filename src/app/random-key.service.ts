import { Injectable } from '@angular/core';
import { Choice, Chooser, mkch } from './chooser';

const sonorityChoices : Choice<string>[] = [
  mkch('Major'), mkch('Minor')
]

const minorKeyChoices : Choice<string>[] = [
  mkch('A', 30), mkch('D', 17), mkch('G', 17), mkch('C', 17), mkch('E', 24), mkch('B', 10)
]

const majorKeyChoices : Choice<string>[] = [
  mkch('C', 30), mkch('F', 17), mkch('G', 17),
  mkch('D', 14), mkch('B\u266D', 11), mkch('A', 5),
  mkch('E\u266D', 5)
]

export interface key {
  root : string;
  isMinor : boolean;
  sonority : string;
}

@Injectable({
  providedIn: 'root'
})
export class RandomKeyService {

  sonorityChooser = new Chooser(sonorityChoices);
  minorChooser = new Chooser(minorKeyChoices);
  majorChooser = new Chooser(majorKeyChoices); 

  constructor() { }

  pick() {
    let sonority = this.sonorityChooser.pick().choice;
    let is_minor = (sonority == 'Minor');
    let the_root = (is_minor ? this.minorChooser : this.majorChooser).pick().choice;
    return { 'root' : the_root, 'isMinor' : is_minor, 'sonority' : sonority };
  }
}
