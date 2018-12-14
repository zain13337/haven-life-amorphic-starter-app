import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Note, Author } from '../models';
import { NoteService } from '../note.service';
import { AuthorService } from '../author.service';

@Component({
  selector: 'app-notes-new',
  templateUrl: './notes-new.component.html',
  styleUrls: ['./notes-new.component.css']
})
export class NotesNewComponent implements OnInit {
  @Input() note: Note;

  authors: Author[];

  constructor(
    private router: Router,
    private noteService: NoteService,
    private authorService: AuthorService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.note = new Note();
    this.getAuthors();
  }

  getAuthors(): void {
    this.authorService.getAuthors()
      .subscribe(authors => this.authors = authors);
  }

  save(): void {
    this.noteService.createNote(this.note)
      .subscribe(note => this.router.navigate([`notes/${note._id}`]));
  }

  goBack(): void {
    this.location.back();
  }
}
