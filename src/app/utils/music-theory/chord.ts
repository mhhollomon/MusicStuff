import { Note } from "./note";

export type ChordType = 'triad' | '7th' | '9th';

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
  
  