import { Component } from '@angular/core';
import {ScaleService } from '../scale.service';
import { RandomChordService, Chord, ChordType } from '../random-chord.service';
import { Note, Scale, ScaleType } from '../key';

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
    private randomChordService : RandomChordService) {

  }

  generate() {

    console.log("--clicked---");

    let picked_key : Scale | null = null;

    let chordTypes : ChordType[] = [];

    if (this.mode === 'Diatonic') {

      if (this.allow_triads) { chordTypes.push('triad'); }
      if (this.allow_sevenths) { chordTypes.push('7th'); }

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
      chordTypes.push('triad'); 
    }

    this.chords = this.randomChordService.gen_chords(picked_key, this.chord_count, this.duplicates, chordTypes);
    this.show_chords = true;

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
