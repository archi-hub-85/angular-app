import { InMemoryDbService } from 'angular-in-memory-web-api';

import { Author, Book } from '../dto';

export class InMemoryBookService implements InMemoryDbService {

  createDb(): {} {
    const authors: Author[] = [
      {
        id: 1,
        name: 'Stephen King'
      },
      {
        id: 2,
        name: 'Isaac Asimov'
      },
      {
        id: 3,
        name: 'Arthur Conan Doyle'
      }
    ];

    const books: Book[] = [
      {
        id: 1,
        title: 'The Dark Tower: The Gunslinger',
        year: 1982,
        author_id: 1
      },
      {
        id: 2,
        title: 'The Dark Tower II: The Drawing of the Three',
        year: 1987,
        author_id: 1
      },
      {
        id: 3,
        title: 'The Dark Tower III: The Waste Lands',
        year: 1991,
        author_id: 1
      },
      {
        id: 4,
        title: 'The Dark Tower IV: Wizard and Glass',
        year: 1997,
        author_id: 1
      },
      {
        id: 5,
        title: 'The Dark Tower V: Wolves of the Calla',
        year: 2003,
        author_id: 1
      },
      {
        id: 6,
        title: 'The Dark Tower VI: Song of Susannah',
        year: 2004,
        author_id: 1
      },
      {
        id: 7,
        title: 'The Dark Tower VII: The Dark Tower',
        year: 2004,
        author_id: 1
      },
      {
        id: 8,
        title: 'Foundation',
        year: 1951,
        author_id: 2
      },
      {
        id: 9,
        title: 'Foundation and Empire',
        year: 1952,
        author_id: 2
      },
      {
        id: 10,
        title: 'Second Foundation',
        year: 1953,
        author_id: 2
      },
      {
        id: 11,
        title: 'Foundation\'s Edge',
        year: 1982,
        author_id: 2
      },
      {
        id: 12,
        title: 'Foundation and Earth',
        year: 1986,
        author_id: 2
      },
      {
        id: 13,
        title: 'Prelude to Foundation',
        year: 1988,
        author_id: 2
      },
      {
        id: 14,
        title: 'Forward the Foundation',
        year: 1993,
        author_id: 2
      },
      {
        id: 15,
        title: 'A Study in Scarlet',
        year: 1887,
        author_id: 3
      },
      {
        id: 16,
        title: 'The Sign of the Four',
        year: 1890,
        author_id: 3
      },
      {
        id: 17,
        title: 'The Hound of the Baskervilles',
        year: 1902,
        author_id: 3
      },
      {
        id: 18,
        title: 'The Valley of Fear',
        year: 1915,
        author_id: 3
      }
    ];

    return { authors, books };
  }

  genId(collection: {id: number}[]): number {
    return (collection.length > 0) ? Math.max(...collection.map(element => element.id)) + 1 : 1;
  }

}
