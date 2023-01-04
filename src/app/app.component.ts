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
                index: 0
            }, {
                label: 'CHORDS',
                link: './random-chords',
                index: 1
            }, {
                label: 'RESOURCES',
                link: './music-resources',
                index: 2
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
