import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatButtonModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { NotesComponent } from './notes/notes.component';
import { NotesShowComponent } from './notes-show/notes-show.component';
import { MessagesComponent } from './messages/messages.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotesNewComponent } from './notes-new/notes-new.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthorsNewComponent } from './authors-new/authors-new.component';
import { AuthorsShowComponent } from './authors-show/authors-show.component';
import { AuthorsComponent } from './authors/authors.component';

@NgModule({
    declarations: [
        AppComponent,
        NotesComponent,
        NotesShowComponent,
        MessagesComponent,
        DashboardComponent,
        NotesNewComponent,
        NavbarComponent,
        AuthorsNewComponent,
        AuthorsShowComponent,
        AuthorsComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatGridListModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
