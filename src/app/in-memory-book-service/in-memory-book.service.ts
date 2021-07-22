import { InMemoryDbService } from 'angular-in-memory-web-api';

import { Book } from '../dto';

export class InMemoryBookService implements InMemoryDbService {

  createDb(): {} {
    const books: Book[] = [
      {
        id: 1,
        title: 'The Dark Tower: The Gunslinger',
        year: 1982,
        author: {
          id: 1,
          name: 'Stephen King'
        }
      },
      {
        id: 2,
        title: 'The Dark Tower II: The Drawing of the Three',
        year: 1987,
        author: {
          id: 1,
          name: 'Stephen King'
        }
      },
      {
        id: 3,
        title: 'The Dark Tower III: The Waste Lands',
        year: 1991,
        author: {
          id: 1,
          name: 'Stephen King'
        }
      },
      {
        id: 4,
        title: 'The Dark Tower IV: Wizard and Glass',
        year: 1997,
        author: {
          id: 1,
          name: 'Stephen King'
        }
      },
      {
        id: 5,
        title: 'The Dark Tower V: Wolves of the Calla',
        year: 2003,
        author: {
          id: 1,
          name: 'Stephen King'
        }
      },
      {
        id: 6,
        title: 'The Dark Tower VI: Song of Susannah',
        year: 2004,
        author: {
          id: 1,
          name: 'Stephen King'
        }
      },
      {
        id: 7,
        title: 'The Dark Tower VII: The Dark Tower',
        year: 2004,
        author: {
          id: 1,
          name: 'Stephen King'
        }
      },
      {
        id: 8,
        title: 'Foundation',
        year: 1951,
        author: {
          id: 2,
          name: 'Isaac Asimov'
        }
      },
      {
        id: 9,
        title: 'Foundation and Empire',
        year: 1952,
        author: {
          id: 2,
          name: 'Isaac Asimov'
        }
      },
      {
        id: 10,
        title: 'Second Foundation',
        year: 1953,
        author: {
          id: 2,
          name: 'Isaac Asimov'
        }
      },
      {
        id: 11,
        title: 'Foundation\'s Edge',
        year: 1982,
        author: {
          id: 2,
          name: 'Isaac Asimov'
        }
      },
      {
        id: 12,
        title: 'Foundation and Earth',
        year: 1986,
        author: {
          id: 2,
          name: 'Isaac Asimov'
        }
      },
      {
        id: 13,
        title: 'Prelude to Foundation',
        year: 1988,
        author: {
          id: 2,
          name: 'Isaac Asimov'
        }
      },
      {
        id: 14,
        title: 'Forward the Foundation',
        year: 1993,
        author: {
          id: 2,
          name: 'Isaac Asimov'
        }
      },
      {
        id: 15,
        title: 'A Study in Scarlet',
        year: 1887,
        author: {
          id: 3,
          name: 'Arthur Conan Doyle'
        }
      },
      {
        id: 16,
        title: 'The Sign of the Four',
        year: 1890,
        author: {
          id: 3,
          name: 'Arthur Conan Doyle'
        }
      },
      {
        id: 17,
        title: 'The Hound of the Baskervilles',
        year: 1902,
        author: {
          id: 3,
          name: 'Arthur Conan Doyle'
        }
      },
      {
        id: 18,
        title: 'The Valley of Fear',
        year: 1915,
        author: {
          id: 3,
          name: 'Arthur Conan Doyle'
        }
      }
    ];

    return { books };
  }

}