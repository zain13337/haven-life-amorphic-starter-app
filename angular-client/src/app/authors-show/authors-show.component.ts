import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { AuthorService } from '../author.service';
import { Author } from '../models';
import { Loadable } from '../interfaces';

@Component({
  selector: 'app-authors-show',
  templateUrl: './authors-show.component.html',
  styleUrls: ['./authors-show.component.css']
})
export class AuthorsShowComponent implements OnInit, Loadable {
  @Input() author: Author;
  isLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authorService: AuthorService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getAuthor();
  }

  getAuthor(): void {
    this.isLoaded = false;
    const id = this.route.snapshot.paramMap.get('id');
    this.authorService.getAuthor(id)
      .subscribe(author => {
        this.author = author;
        this.isLoaded = true;
      });
  }

  save(): void {
    this.authorService.updateAuthor(this.author).subscribe();
  }

  delete(): void {
    this.authorService.deleteAuthor(this.author)
      .subscribe(() => this.router.navigate(['authors']));
  }

  goBack(): void {
    this.location.back();
  }
}
