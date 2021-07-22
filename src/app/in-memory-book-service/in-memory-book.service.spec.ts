import { TestBed } from '@angular/core/testing';

import { InMemoryBookService } from './in-memory-book.service';

describe('InMemoryBookService', () => {
  let service: InMemoryBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InMemoryBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
