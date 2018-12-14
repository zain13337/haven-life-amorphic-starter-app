import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Note } from '../models';
import { NoteService } from '../note.service';

@Component({
  selector: 'app-notes-show',
  templateUrl: './notes-show.component.html',
  styleUrls: ['./notes-show.component.css']
})
export class NotesShowComponent implements OnInit {
  @Input() note: Note;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noteService: NoteService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getNote();
  }

  getNote(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.noteService.getNote(id)
      .subscribe(note => this.note = note);
  }

  save(): void {
    this.noteService.updateNote(this.note).subscribe();
  }

  delete(): void {
    this.noteService.deleteNote(this.note)
      .subscribe(() => this.router.navigate(['notes']));
  }

  goBack(): void {
    this.location.back();
  }
}
