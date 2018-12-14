import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { NotesComponent } from './notes/notes.component';
import { NotesNewComponent } from './notes-new/notes-new.component';
import { NotesShowComponent } from './notes-show/notes-show.component';
import { AuthorsNewComponent } from './authors-new/authors-new.component';
import { AuthorsShowComponent } from "./authors-show/authors-show.component";
import { AuthorsComponent } from './authors/authors.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'notes', component: NotesComponent, pathMatch: 'full' },
  { path: 'notes/new', component: NotesNewComponent, pathMatch: 'full' },
  { path: 'notes/:id', component: NotesShowComponent },
  { path: 'authors', component: AuthorsComponent, pathMatch: 'full' },
  { path: 'authors/new', component: AuthorsNewComponent, pathMatch: 'full' },
  { path: 'authors/:id', component: AuthorsShowComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
