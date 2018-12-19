import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Author } from './models';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  private authorsUrl = 'api/v1/authors'; // URL to web api

  /** Log a AuthorService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`AuthorService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** POST: create the author on the server */
  createAuthor(author: Author): Observable<Author> {
    const url = this.authorsUrl;
    return this.http.post<Author>(url, author, httpOptions).pipe(
      tap(_ => this.log(`created author`)),
      catchError(this.handleError<any>('createAuthor'))
    );
  }

  /** GET authors from the server */
  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.authorsUrl).pipe(
      tap(_ => this.log('fetched authors')),
      catchError(this.handleError('getAuthors', []))
    );
  }

  /** GET author by id. Will 404 if id not found */
  getAuthor(id: string): Observable<Author> {
    const url = `${this.authorsUrl}/${id}`;
    return this.http.get<Author>(url).pipe(
      tap(_ => this.log(`fetched author id=${id}`)),
      catchError(this.handleError<Author>(`getAuthor id=${id}`))
    );
  }

  /** PUT: update the author on the server */
  updateAuthor(author: Author): Observable<any> {
    const url = `${this.authorsUrl}/${author._id}`;
    return this.http.put(url, author, httpOptions).pipe(
      tap(_ => this.log(`updated author id=${author._id}`)),
      catchError(this.handleError<any>('updateAuthor'))
    );
  }

  /** DELETE: destroy the author on the server */
  deleteAuthor(author: Author): Observable<Author> {
    const url = `${this.authorsUrl}/${author._id}`;
    return this.http.delete<Author>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted author id=${author._id}`)),
      catchError(this.handleError<any>('deleteAuthor'))
    );
  }
}
