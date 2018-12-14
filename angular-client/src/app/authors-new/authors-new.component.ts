import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Author } from '../models';
import { AuthorService } from '../author.service';

@Component({
  selector: 'app-authors-new',
  templateUrl: './authors-new.component.html',
  styleUrls: ['./authors-new.component.css']
})
export class AuthorsNewComponent implements OnInit {
  @Input()
  author: Author;

  constructor(
    private router: Router,
    private authorService: AuthorService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.author = new Author();
  }

  save(): void {
    this.authorService.createAuthor(this.author)
      .subscribe(author => this.router.navigate([`authors/${author._id}`]));
  }

  goBack(): void {
    this.location.back();
  }
}
