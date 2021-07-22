import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Author, Book } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private baseUrl = 'api/';
  private authorsUrl = this.baseUrl + 'authors';
  private serviceUrl = this.baseUrl + 'books';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.authorsUrl)
      .pipe(
        tap(_ => this.log('fetched authors')),
        catchError(this.handleError<Author[]>('getAuthors', []))
      );
  }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.serviceUrl)
      .pipe(
        tap(_ => this.log('fetched books')),
        catchError(this.handleError<Book[]>('getBooks', []))
      );
  }

  getBook(id: number): Observable<Book> {
    const url = `${this.serviceUrl}/${id}`;
    return this.http.get<Book>(url)
      .pipe(
        tap(_ => this.log(`fetched book id=${id}`)),
        catchError(this.handleError<Book>(`getBook(${id})`))
      );
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.serviceUrl, book, this.httpOptions)
      .pipe(
        tap((newBook: Book) => this.log(`added book with id=${newBook.id}`)),
        catchError(this.handleError<Book>('addBook'))
      );
  }

  updateBook(book: Book): Observable<any> {
    return this.http.put(this.serviceUrl, book, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated book id=${book.id}`)),
        catchError(this.handleError<any>('updateBook'))
      );
  }

  deleteBook(id: number): Observable<Book> {
    const url = `${this.serviceUrl}/${id}`;
    return this.http.delete<Book>(url, this.httpOptions)
      .pipe(
        tap(_ => this.log(`deleted book id=${id}`)),
        catchError(this.handleError<Book>(`deleteBook(${id})`))
      );
  }

  private log(message: string): void {
    console.log(`BookService: ${message}`);
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

}
