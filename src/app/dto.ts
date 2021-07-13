interface Indexable {
  [key: string]: any;
}

export interface Author extends Indexable {
    id: number;
    name: string;
}

export interface Book extends Indexable {
    id: number;
    title: string;
    year: number;
    author: Author;
}
