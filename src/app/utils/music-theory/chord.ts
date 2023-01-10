import { Note } from "./note";

export type ChordType = 'triad' | '7th';

export type ExtensionType = '9th' | '11th';

export interface ExtensionFlags {
  '9th' : boolean;
  '11th' : boolean;
}

type ChordToneList = { [key : string] : Note };

export class Chord {
    root : Note;
    inversion : number;
    chordType : ChordType;
    chordTones : ChordToneList = {};
    extensions : ExtensionFlags = {'9th' : false, '11th' : false};
  
    constructor(root  = new Note('C'),  chordType : ChordType = 'triad', inversion  = 0) {
      this.root = root;
      this.inversion = inversion;
      this.chordType = chordType;

      if (inversion > 2 || inversion < 0) {
        throw Error(`Invalid inversion number ${inversion}`);
      }
    }

    addChordTone(chordalPosition : number, note : Note) : Chord {
      this.chordTones[chordalPosition] = note;

      return this;
    }
  
    isSame(other : Chord) {
      return this.root === other.root;
    }

    inversionAbbrev() {
      if (this.inversion === 0) {
        return '(R)'
      } else {
        return `(${this.inversion})`
      }
    }

    name() : string {

      // Just for convenience 
      const ct = this.chordTones;

      if (! (1 in ct)) {
        throw Error("No root tone in the chordTones")
      }

      if (! ( 3 in ct)) {
        throw Error("No mediant tone in the chordTones")
      }
      if (! ( 5 in ct)) {
        throw Error("No dominant tone in the chordTones")
      }

      const chordalOne = ct[1];

      let name : string = chordalOne.note();
      let quality = '';
      let seventh  = '';
      let ninth = '';
      let eleventh = '';

      const int1to3 = chordalOne.interval(ct[3]);
      const int3to5 = ct[3].interval(ct[5]);

      if (int1to3 === 3) {
        if (int3to5 === 3) {
          quality = 'dim';
        } else if (int3to5 === 4) {
          quality = 'min';
        } else {
          throw Error("Invalid lower chord structure (min first)");
        }
      } else if (int1to3 === 4) {
        if (int3to5 === 3) {
          quality = 'maj';
        } else if (int3to5 === 4) {
          quality = 'aug';
        } else {
          throw Error("Invalid lower chord structure (maj first)");
        }
      } else {
        throw Error("invalid first interval in chord.");
      }

      if (name && ( 7 in ct)) {
        // has a 7th
        const int5to7 = ct[5].interval(ct[7]);
        if (int5to7 === 3) {
          seventh = '7';
          if (quality === 'maj') {
            quality = '';
          }
        } else if (int5to7 === 4) {
          seventh = '7';
          if (quality === 'min') {
            seventh = 'maj7'
          } else if (quality === 'dim') {
            quality = 'min';
            seventh = '7b5'
          }

        } else if (this.chordType === '7th') {
          throw Error("Invalid interval to 7th");
        }

      }

      if (this.extensions["9th"]) {
        // Has a nine

        const int1to9 = ct[1].interval(ct[9]);

        if (int1to9 == 1 ) {
            ninth = '(addb9)';
        } else if (int1to9 === 2) { // this assumes not phrygian or locrian
          ninth = '9';
          if (quality === '' || seventh === '7') {
            seventh = '';
          } else if (seventh !== '7') {
            ninth = '(add9)';
          }
        } else if (int1to9 === 3) {
          if (! ct[9].same(ct[3])) {
            ninth = '(add#9)';
          } else {
            // not actually a  ninth chord, 
            // the chordal 3 is simply repeated.
          }
        } else {
          throw Error("Invalid interval to 9th");
        }

      }

      if (this.extensions["11th"]) {

        const int1to11 = ct[1].interval(ct[11]);

        if (int1to11 === 5 ) {
          eleventh = '11';
          if (quality === '' || ninth === '9') {
            eleventh = '';
          } else if (ninth !== '9') {
            eleventh = '(add11)';
          }
        }


      }


      if (quality == 'maj' && seventh === '' && ninth === '' && eleventh === '') {
        quality = '';
      }

      if (name) {
        name += quality;
        name += seventh;
        name += ninth;
        name += eleventh;
      }

      if (this.inversion != 0) {
        if (this.inversion > 2 || this.inversion < 0) {
          throw Error(`Invalid inversion number ${this.inversion}`);
        }
  
        name += '/' + ct[['1', '3', '5'][this.inversion]].note();
      }

      return name;

    }

    computeNameDisplay() {
      let n = this.name();

      n = n?.replaceAll('bb', '\uD834\uDD2B' );
      n = n?.replaceAll('#', '\u266F' );
      n = n?.replaceAll('b', '\u266D' );
      n = n?.replaceAll('x', '\uD834\uDD2A' );

      return n;
    }

    invertedChordTones() : Note[] {
      if (this.inversion > 2 || this.inversion < 0) {
        throw Error(`Invalid inversion number ${this.inversion}`);
      }

      let retval : Note[] = [];
      for (const t in this.chordTones) {
        retval.push(this.chordTones[t]);
      }

      if (this.inversion > 0) {

        // want to "pull out" the nominated root and
        // stick it on the bottom.
        const newRoot = retval[this.inversion];
        const top = retval.slice(this.inversion+1);
        retval = [newRoot].concat(retval.slice(0, this.inversion)).concat(top);
  
      }

      return retval;

    }
  }
  
  