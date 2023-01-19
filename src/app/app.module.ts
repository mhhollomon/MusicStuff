import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CompositionIdeaComponent } from './composition-idea/composition-idea.component';
import { MusicResourcesComponent } from './music-resources/music-resources.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BassScalesComponent } from './bass-scales/bass-scales.component';
import { HomeComponent } from './home/home.component';
import { HelpDialogComponent } from './help-dialog/help-dialog.component';

import { HelpTextEmitterService } from './help-text-emitter.service';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component'
import { ThemeService } from './services/theme.service';
@NgModule({
  declarations: [
    AppComponent,
    CompositionIdeaComponent,
    MusicResourcesComponent,
    PageNotFoundComponent,
    BassScalesComponent,
    HomeComponent,
    HelpDialogComponent,
    ErrorDialogComponent
  ],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule,
    MaterialModule,

    AppRoutingModule,
  ],
  providers: [
    HelpTextEmitterService,
    { provide: AudioContext, useClass: AudioContext },
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
