import { Component, OnInit } from '@angular/core';
import { HelpTextEmitterService } from '../help-text-emitter.service';

const HELP_TEXT = "This page contains a list of resources that might be of some interest.";
const HELP_PAGE_NAME = "Resources";

@Component({
  selector: 'app-music-resources',
  templateUrl: './music-resources.component.html',
  styleUrls: ['./music-resources.component.scss']
})
export class MusicResourcesComponent implements OnInit {
  constructor(private help_text : HelpTextEmitterService) { }

  ngOnInit(): void {
    this.help_text.setHelp({ help_text : HELP_TEXT, page_name : HELP_PAGE_NAME });
  }

}
