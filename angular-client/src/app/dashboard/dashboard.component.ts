import { Component, OnInit } from '@angular/core';
import { Note } from '../models';
import { NoteService } from '../note.service';
import { Loadable } from '../interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit, Loadable {
  notes: Note[] = [];
  isLoaded = false;

  constructor(private noteService: NoteService) { }

  ngOnInit() {
    this.getNotes();
  }

  getNotes(): void {
    this.isLoaded = false;
    this.noteService.getNotes()
      .subscribe(notes => {
        this.notes = notes.slice(0, 4);
        this.isLoaded = true;
      });
  }
}
