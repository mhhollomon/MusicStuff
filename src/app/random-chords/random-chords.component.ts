import { Component, OnInit } from '@angular/core';

import { HelpTextEmitterService } from '../help-text-emitter.service';

const HELP_TEXT = `
<h2>Go check out <a href="https://mhhollomon.github.io/RachGen/">RachGen</a> instead
`;
const HELP_PAGE_NAME = "Random Chords";

@Component({
  selector: 'app-random-chords',
  templateUrl: './random-chords.component.html',
  styleUrls: ['./random-chords.component.scss']
})
export class RandomChordsComponent implements OnInit {

  constructor(
    private help_text : HelpTextEmitterService,
    ) {

  }

  ngOnInit(): void {
    this.help_text.setHelp({ help_text : HELP_TEXT, page_name : HELP_PAGE_NAME });
  }

}
