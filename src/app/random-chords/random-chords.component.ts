import { Component } from '@angular/core';
import { RandomKeyService } from '../random-key.service';
import { RandomChordService, Chord } from '../random-chord.service';
import { Key } from '../key';

@Component({
  selector: 'app-random-chords',
  templateUrl: './random-chords.component.html',
  styleUrls: ['./random-chords.component.less']
})
export class RandomChordsComponent {

  key : Key = new Key('C', 'major');

  chords : Chord[] = [];

  show_chords = false;

  chord_count: number = 4;
  

  constructor(private randomKeyService : RandomKeyService,
    private randomChordService : RandomChordService) {

  }

  generate() {

    this.key = this.randomKeyService.pick();
    this.chords = this.randomChordService.gen_chords(this.key, this.chord_count);
    this.show_chords = true;

  }

  count_change(event : Event) {
    console.log(event)
  }

}
