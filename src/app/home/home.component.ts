import { Component, OnInit } from '@angular/core';
import { HelpTextEmitterService } from '../help-text-emitter.service';

const HELP_TEXT = "This is the home page.";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private help_text : HelpTextEmitterService) {}

  ngOnInit() {
    this.help_text.setHelp({ help_text : HELP_TEXT, page_name : "Home" });
  }

}
