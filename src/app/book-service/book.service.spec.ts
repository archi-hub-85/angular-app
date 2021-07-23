import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
//import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BookService } from './book.service';

describe('BookService', () => {
  let service: BookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ]
    });
    service = TestBed.inject(BookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
