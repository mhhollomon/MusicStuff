import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CompositionIdeaComponent } from './composition-idea/composition-idea.component';
import { RandomChordsComponent } from './random-chords/random-chords.component';
import { MusicResourcesComponent } from './music-resources/music-resources.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    CompositionIdeaComponent,
    RandomChordsComponent,
    MusicResourcesComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule,
    MatTabsModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatGridListModule,
    MatExpansionModule,
    
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
