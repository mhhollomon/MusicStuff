import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompositionIdeaComponent } from './composition-idea/composition-idea.component';
import { RandomChordsComponent } from './random-chords/random-chords.component';
import { MusicResourcesComponent } from './music-resources/music-resources.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
    { path : '', redirectTo: '/composition-idea', pathMatch: 'full' },
    { path : 'composition-idea', component : CompositionIdeaComponent },
    { path : 'random-chords', component : RandomChordsComponent },
    { path : 'music-resources', component : MusicResourcesComponent },

    // page not found
    {path : 'page-not-found', component : PageNotFoundComponent },
    {path : '**', component : PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
