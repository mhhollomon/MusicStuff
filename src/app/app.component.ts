import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HelpDialogComponent } from './help-dialog/help-dialog.component';
import { HelpTextEmitterService } from './help-text-emitter.service';


interface nav_link_data {
    label : string,
    link  : string,
    tooltip : string
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'music-stuff';

  current_help_text = 'None';
  current_help_page = 'Unknown';

  activeLinkIndex = -1; 

  navLinks : nav_link_data[] = [
        {
            label: 'IDEAS',
            link: './composition-idea',
            tooltip : 'Random compositional ideas',
        }, {
            label: 'CHORDS',
            link: './random-chords',
            tooltip : 'Generate random chords',
        },{
            label: 'BASS',
            link: './bass-scales',
            tooltip : 'Learn fingerings for scales on a bass guitar',
        }, {
            label: 'RESOURCES',
            link: './music-resources',
            tooltip : 'Links to resources about music',
        },
    ];

    constructor(
        private router: Router, 
        public dialog: MatDialog, 
        private help_text : HelpTextEmitterService) {
    }

    ngOnInit(): void {
        this.router.events.subscribe(() => {
            this.activeLinkIndex = this.navLinks.indexOf(
                // This code is wrong
                /* eslint-disable @typescript-eslint/no-explicit-any */
                (this.navLinks as any[]).find((tab) => tab.link === '.' + this.router.url));
        });

        this.help_text.emitter.subscribe( data => {
            this.current_help_text = data.help_text;
            this.current_help_page = data.page_name;
        })
    }

    openHelpDialog() {

        this.dialog.open(HelpDialogComponent, {
            height : '45vh',
            width  : '45vw',
            data: {
                help_text: this.current_help_text,
                page_name : this.current_help_page,
            },
        });
    }
}
