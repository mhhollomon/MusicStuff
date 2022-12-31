import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
import  * as Midiwriter  from 'midi-writer-js'
import {ScaleService } from '../scale.service';
import { RandomChordService, Chord, ChordType } from '../random-chord.service';
import { Note, Scale, ScaleType } from '../key';
import { AudioService } from '../audio.service';

const octavePlacement : any = {
  'C' : 0, 'D' : 1, 'E' : 2, 'F' : 3, 'G' : 4, 'A' : 5, 'B' : 6 
}

@Component({
  selector: 'app-random-chords',
  templateUrl: './random-chords.component.html',
  styleUrls: ['./random-chords.component.less']
})
export class RandomChordsComponent {

  key : Scale = new Scale('C', 'major');

  chords : Chord[] = [];

  show_chords = false;
  show_key = true;
  show_scale = false;
  show_chord_tones = true;
  scale_disabled = false;
  scale_notes : Note[] = [];

  // Model elements
  chord_count: number = 4;
  duplicates : string = 'None';
  mode : string = 'Diatonic';
  scale_source : string = "Random";

  allow_triads = true;
  allow_sevenths = false;


  selected_sonority : string = 'major';
  selected_key : string = 'Random';

  minorkeys = this.scaleService.getMinorKeyList();
  majorkeys = this.scaleService.getMajorKeyList();
  

  constructor(private scaleService : ScaleService,
    private randomChordService : RandomChordService,
    private audioService : AudioService) {

  }

  generate() {

    console.log("--clicked---");

    let picked_key : Scale | null = null;

    let chordTypes : ChordType[] = [];
    if (this.allow_triads) { chordTypes.push('triad'); }
    if (this.allow_sevenths) { chordTypes.push('7th'); }

    if (this.mode === 'Diatonic') {

      if (this.scale_source === "Selected") {
        if (this.selected_key === 'Random') {
          this.key = this.scaleService.choose(this.selected_sonority as ScaleType);
        } else {
          this.key = new Scale(this.selected_key, this.selected_sonority as ScaleType);
        }
        } else {
          this.key = this.scaleService.choose();
        }
      this.scale_notes = this.scaleService.getScaleNotes(this.key);
      picked_key = this.key;
      this.show_key = true;

    } else {

      // -- Chromatic Mode
      this.show_key = false;
      this.scale_notes = [];
      
    }

    this.chords = this.randomChordService.gen_chords(picked_key, this.chord_count, this.duplicates, chordTypes);
    this.show_chords = true;

  }

  async play_chord(chord : Chord) {

    let tones : string[] = [];
    let octave = 3;
    let last : number = -1;
    let isBassNote = true;

    for (let c of chord.chordTones) {
      if (octavePlacement[c.noteClass] < last) {
        octave += 1;
      }
      tones.push(c.note() + octave);
      if (isBassNote) {
        octave += 1;
        isBassNote = false;
      } else {
        last = octavePlacement[c.noteClass];
      }

    }
  
    this.audioService.play_chord(tones);

  }

  generate_midi(evnt : Event) {

    evnt.stopPropagation();

    const track = new Midiwriter.Track();

    for (let c of this.chords) {

      // Want to place the bass note "down an octave"
      let octave = 3;
      let last : number = -1;
      let isBassNote = true;
  
      let options : Midiwriter.Options = {sequential: false, duration : '1', pitch : []}

      for (let n of c.chordTones) {
        if (octavePlacement[n.noteClass] < last) {
          octave += 1;
        }
        (options.pitch as unknown as string[]).push(n.note() + octave );
        if (isBassNote) {
          octave += 1;
          isBassNote = false;
        } else {
          last = octavePlacement[n.noteClass];
        }
  
      }

      track.addEvent(new Midiwriter.NoteEvent(options))
    }

    let octave = ['G', 'A', 'B'].includes(this.scale_notes[0].noteClass) ? 3 : 4;
    let last : number = -1;
    let scale_options : Midiwriter.Options = {sequential: true, duration : '4', pitch : []}
    for (let n of this.scale_notes) {

      if (octavePlacement[n.noteClass] < last) {
        octave += 1;
      }
      (scale_options.pitch as unknown as string[]).push(n.note() + octave );
      last = octavePlacement[n.noteClass];
    }

    track.addEvent(new Midiwriter.NoteEvent(scale_options))


    let midi_writer = new Midiwriter.Writer(track);

    let  blob = new Blob([midi_writer.buildFile()], {type: "audio/midi"});
    saveAs(blob, "random-chords.mid");

  }

  mode_change() {
    this.show_chords = false;
    this.chords = [];
    if (this.mode == "Diatonic" ) {
      this.show_key = true;
      this.scale_disabled = false;
    } else {
      this.show_key = false;
      this.scale_disabled = true;
    }
  }

}
