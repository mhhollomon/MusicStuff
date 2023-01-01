import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'music-stuff';
  navLinks :any[];
  activeLinkIndex = -1; 
    constructor(private router: Router) {
        this.navLinks = [
            {
                label: 'Composition Idea',
                link: './composition-idea',
                index: 0
            }, {
                label: 'Random Chords',
                link: './random-chords',
                index: 1
            }, {
                label: 'Resources',
                link: './music-resources',
                index: 2
            }, 
        ];
    }

    ngOnInit(): void {
    this.router.events.subscribe((res) => {
        this.activeLinkIndex = this.navLinks.indexOf(
            this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });
    }
}
