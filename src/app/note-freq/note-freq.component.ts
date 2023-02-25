import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';


const middle_c_midi : number = 60;
const semitone_ratio = Math.pow(2, 1.0/12.0);
const cents_ratio = Math.pow(2, 1.0/1200.0);

const concert_a_midi : number = 69;
const concert_a_freq : number = 440;

function round3(value : number) {
  return Math.trunc(Math.round(value * 1000.0))/1000.0
}

function midi2freq(midi : number, tuning : number) : number {
  const diff = midi - concert_a_midi;
  const adiff = Math.abs(diff);
  let ratio = Math.pow(semitone_ratio, adiff);
  if (diff < 0) {
    ratio = 1/ratio;
  }

  return round3(tuning * ratio);
}

const note_offset : {[index : string ] : number }= {
  'C' : 0, 'C#' : 1, 'D' : 2, 'D#' : 3, "E" : 4, 'F' : 5, 'F#' : 6, 'G' : 7 , 'G#' : 8, 'A' : 9, 'A#' : 10, "B" : 11,
           'Db' : 1,          'Eb' : 3,                   'Gb' : 6,           'Ab' : 8,          'Bb' : 10,
}

const notes = ['C', 'C#', 'D', 'D#', "E", 'F', 'F#', 'G', 'G#', 'A', 'A#', "B"]


function freq2midi(freq : number) : number {
  return 69 + Math.round(12 * Math.log2(freq/concert_a_freq));
}


export function createNoteNameValidator(disabled : () => boolean): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {

      const value = control.value;

      if (disabled() || !value) {
          return null;
      }

      const matches = /^[A-Ga-g][#b]?\d+$/.test(value);


      return !matches ? {NoteName:true}: null;
  }
}

export function note2midi(note : string, lowest_octave : number ) : number {
  const match = note.match(/^([A-Ga-g][#b]?)(\d+)$/);
  if (!match) {
    throw "That sucks";
  }

  const octave = Number.parseInt(match[2]);

  let midi = (octave - lowest_octave) * 12;
  midi += note_offset[match[1]];

  return midi;
}

@Component({
  selector: 'app-note-freq',
  templateUrl: './note-freq.component.html',
  styleUrls: ['./note-freq.component.scss']
})
export class NoteFreqComponent implements OnInit {

  octaveNumbering  = 'DAW';
  inputType : string = 'FREQ';

  tuning : number = 440;

  midi_number = new FormControl('', [Validators.max(127), Validators.min(0)]);
  frequency   = new FormControl('', [Validators.max(12600), Validators.min(16.35)]);
  note_name   = new FormControl('', [createNoteNameValidator(() => this.inputType !== 'NAME')]);

  ngOnInit() {
    this.note_name.setValue('C3');
    this.name_change();


  }

  midi2note(midi : number) : string {
    const octave = Math.floor(midi / 12) + this.octave_offset;
    const note = notes[midi%12];
  
    return `${note}${octave}`
  }
  
  freq2note(freq : number, tuning : number) : string {
    // This is very inefficient
  
    // get a note we are close to.
    const midi = freq2midi(freq);
    const base_note = this.midi2note(midi);
    const base_freq = midi2freq(midi, tuning);
    const cents = Math.round(1200 * Math.log2(freq/base_freq));
  
    if (cents === 0) {
      return base_note;
    } else if (cents <  0) {
      return `${base_note} minus ${Math.abs(cents)} cents`;
  
    }
  
    return `${base_note} plus ${cents} cents`;
  
  }
  

  get octave_offset() : number {
    return this.octaveNumbering === 'DAW' ? -2 : -1;
  }

  midi_change() {
    if (this.midi_number.valid) {
      const midi = Number.parseInt(this.midi_number.value ? this.midi_number.value : '69');
      this.note_name.setValue(this.midi2note(midi));
      this.frequency.setValue(midi2freq(midi, this.tuning).toString());
    }

  }

  freq_change(){
    if (this.frequency.valid) {
      const freq = Number.parseFloat(this.frequency.value ? this.frequency.value : '440');
      const midi = freq2midi(freq);
      this.note_name.setValue(this.freq2note(freq, this.tuning));
      this.midi_number.setValue(midi.toString());
    }

  }

  name_change() {
    if (this.note_name.valid && this.note_name.value) {
      let note = this.note_name.value;
      console.log(`note = ${note}`)
      note = note.substring(0, 1).toUpperCase() + note.substring(1);
      console.log(`note2 = ${note}`)
      this.note_name.setValue(note);
      const midi = note2midi(note, this.octave_offset);

      this.midi_number.setValue(midi.toString());
      this.frequency.setValue(midi2freq(midi, this.tuning).toString());
    }
   
  }

  octave_change() {
    this.midi_change();
  }

}
