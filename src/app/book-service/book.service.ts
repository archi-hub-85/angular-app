import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Book } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(
    private http: HttpClient
  ) { }

  getBooks() {
    return this.http.get<Book[]>('/assets/books.json');
  }

}
