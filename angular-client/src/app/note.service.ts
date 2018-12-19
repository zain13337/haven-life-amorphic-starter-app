import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Note } from './models';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  private notesUrl = 'api/v1/notes'; // URL to web api

  /** Log a NoteService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`NoteService: ${message}`);
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

  /** POST: create the note on the server */
  createNote(note: Note): Observable<Note> {
    const url = this.notesUrl;
    return this.http.post<Note>(url, note, httpOptions).pipe(
      tap(_ => this.log(`created note`)),
      catchError(this.handleError<any>('createNote'))
    );
  }

  /** GET notes from the server */
  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.notesUrl).pipe(
      tap(_ => this.log('fetched notes')),
      catchError(this.handleError('getNotes', []))
    );
  }

  /** GET note by id. Will 404 if id not found */
  getNote(id: string): Observable<Note> {
    const url = `${this.notesUrl}/${id}`;
    return this.http.get<Note>(url).pipe(
      tap(_ => this.log(`fetched note id=${id}`)),
      catchError(this.handleError<Note>(`getNote id=${id}`))
    );
  }

  /** PUT: update the note on the server */
  updateNote(note: Note): Observable<any> {
    const url = `${this.notesUrl}/${note._id}`;
    return this.http.put(url, note, httpOptions).pipe(
      tap(_ => this.log(`updated note id=${note._id}`)),
      catchError(this.handleError<any>('updateNote'))
    );
  }

  /** DELETE: destroy the note on the server */
  deleteNote(note: Note): Observable<Note> {
    const url = `${this.notesUrl}/${note._id}`;
    return this.http.delete<Note>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted note id=${note._id}`)),
      catchError(this.handleError<any>('deleteNote'))
    );
  }
}
