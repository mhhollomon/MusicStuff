import { Injectable, Inject, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';


export type ThemeType = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private theme : ThemeType = 'light';
  public themeChange = new EventEmitter();

  constructor(@Inject(DOCUMENT) private document: Document) { }

  setTheme(newTheme : ThemeType) {
    const darkModeClass = 'darkMode';

    if (newTheme !== this.theme) {
      if (newTheme === 'dark') {
        this.document.body.classList.add(darkModeClass);
      } else {
        this.document.body.classList.remove(darkModeClass);
      }

      this.theme = newTheme;
      this.themeChange.emit(newTheme);
    }

  }

  isDarkMode() { return this.theme === 'dark'; }
}
