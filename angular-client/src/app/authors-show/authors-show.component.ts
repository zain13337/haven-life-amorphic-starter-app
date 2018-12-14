import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { AuthorService } from '../author.service';
import { Author } from '../models';

@Component({
  selector: 'app-authors-show',
  templateUrl: './authors-show.component.html',
  styleUrls: ['./authors-show.component.css']
})
export class AuthorsShowComponent implements OnInit {
  @Input() author: Author;

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
    const id = this.route.snapshot.paramMap.get('id');
    this.authorService.getAuthor(id)
      .subscribe(author => this.author = author);
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
