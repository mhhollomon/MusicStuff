import { Component } from '@angular/core';
import {ScaleService } from '../scale.service';
import { RandomChordService, Chord } from '../random-chord.service';
import { Scale } from '../key';

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

  // Model elements
  chord_count: number = 4;
  duplicates : string = 'None';
  mode : string = 'Diatonic';
  

  constructor(private scaleService : ScaleService,
    private randomChordService : RandomChordService) {

  }

  generate() {

    console.log("--clicked---");

    let picked_key : Scale | null = null;

    if (this.mode === 'Diatonic') {
      this.key = this.scaleService.choose();
      picked_key = this.key;
      this.show_key = true;
    } else {
      this.show_key = false;
    }

    this.chords = this.randomChordService.gen_chords(picked_key, this.chord_count, this.duplicates);
    this.show_chords = true;

  }

  mode_change() {
    this.show_chords = false;
    this.chords = [];
    if (this.mode == "Diatonic" ) {
      this.show_key = true;
    } else {
      this.show_key = false;
    }
  }

}
