import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'music-stuff';

  // might need to dig deeper on this.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navLinks :any[];
  activeLinkIndex = -1; 
    constructor(private router: Router) {
        this.navLinks = [
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
    }

    ngOnInit(): void {
    this.router.events.subscribe(() => {
        this.activeLinkIndex = this.navLinks.indexOf(
            this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });
    }
}
