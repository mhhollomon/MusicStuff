import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CompositionIdeaComponent } from './composition-idea/composition-idea.component';
import { MusicResourcesComponent } from './music-resources/music-resources.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BassScalesComponent } from './bass-scales/bass-scales.component';
import { ClefsComponent } from './clefs/clefs.component';
import { Big18Component } from './big18/big18.component';
import { NoteFreqComponent } from './note-freq/note-freq.component';

const routes: Routes = [
    { path : '',   redirectTo : 'home', pathMatch: 'full' },
    { path : 'home',             component : HomeComponent },
    { path : 'composition-idea', component : CompositionIdeaComponent },
    { path : 'music-resources',  component : MusicResourcesComponent },
    { path : 'bass-scales',      component : BassScalesComponent },
    { path : 'clefs',            component : ClefsComponent },
    { path : 'big18',            component : Big18Component },
    { path : 'freq',             component : NoteFreqComponent },

    // page not found
    {path : 'page-not-found',    component : PageNotFoundComponent },
    {path : '**',                component : PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
