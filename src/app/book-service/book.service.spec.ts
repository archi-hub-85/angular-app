import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Author, Book } from '../dto';
import { BookService } from './book.service';

describe('BookService', () => {
  let service: BookService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(BookService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAuthors() should return values', () => {
    const authors: Author[] = [
      { id: 1, name: 'author1' },
      { id: 2, name: 'author2' }
    ];

    service.getAuthors().subscribe(result => {
      // TODO withContext() overrides default fail message for arrays!
      expect(result)/*.withContext('result')*/.toEqual(authors);
    });

    const req = httpTestingController.expectOne('api/authors');
    expect(req.request.method).withContext('HTTP method').toEqual('GET');
    req.flush(authors);

    httpTestingController.verify();
  });

  it('getBooks() should return values', () => {
    const books: Book[] = [
      { id: 1, title: 'title1', year: 2020, author_id: 1 },
      { id: 2, title: 'title2', year: 2021, author_id: 2 }
    ];

    service.getBooks().subscribe(result => {
      // TODO withContext() overrides default fail message for arrays!
      expect(result)/*.withContext('result')*/.toEqual(books);
    });

    const req = httpTestingController.expectOne('api/books');
    expect(req.request.method).withContext('HTTP method').toEqual('GET');
    req.flush(books);

    httpTestingController.verify();
  });

  it('getBook() should return value', () => {
    const id = 1;
    const book: Book = { id: id, title: 'title1', year: 2020, author_id: 1 };

    service.getBook(id).subscribe(result => {
      expect(result).withContext('result').toEqual(book);
    });

    const req = httpTestingController.expectOne(`api/books/${id}`);
    expect(req.request.method).withContext('HTTP method').toEqual('GET');
    req.flush(book);

    httpTestingController.verify();
  });

  it('addBook() should work', () => {
    const newBook: Book = { title: 'title1', year: 2020, author_id: 1 } as Book;
    const createdBook = Object.assign({}, newBook, { id: 1 });

    service.addBook(newBook).subscribe(result => {
      // TODO withContext() overrides default fail message for objects!
      expect(result)/*.withContext('result')*/.toEqual(createdBook);
    });

    const req = httpTestingController.expectOne('api/books');
    expect(req.request.method).withContext('HTTP method').toEqual('POST');
    // TODO withContext() overrides default fail message for objects!
    expect(req.request.body)/*.withContext('HTTP body')*/.toEqual(newBook);
    req.flush(createdBook);

    httpTestingController.verify();
  });

  it('updateBook() should work', () => {
    const book: Book = { id: 1, title: 'title1', year: 2020, author_id: 1 };
    const requestResult = 'ok';

    service.updateBook(book).subscribe(result => {
      expect(result).withContext('result').toEqual(requestResult);
    });

    const req = httpTestingController.expectOne('api/books');
    expect(req.request.method).withContext('HTTP method').toEqual('PUT');
    // TODO withContext() overrides default fail message for objects!
    expect(req.request.body)/*.withContext('HTTP body')*/.toEqual(book);
    req.flush(requestResult);

    httpTestingController.verify();
  });

  it('deleteBook() should work', () => {
    const id = 1;
    const book: Book = { id, title: 'title1', year: 2020, author_id: 1 };

    service.deleteBook(id).subscribe(result => {
      // TODO withContext() overrides default fail message for objects!
      expect(result)/*.withContext('result')*/.toEqual(book);
    });

    const req = httpTestingController.expectOne(`api/books/${id}`);
    expect(req.request.method).withContext('HTTP method').toEqual('DELETE');
    req.flush(book);

    httpTestingController.verify();
  });
});
