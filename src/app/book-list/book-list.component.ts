import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

import { Author, Book } from '../dto';
import { BookService } from '../book-service/book.service';
import { BookEditorDialog } from '../book-editor/book-editor.component';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, AfterViewInit, OnDestroy {

  readonly displayedColumns: string[] = ['id', 'title', 'year', 'author', 'action'];
  private authors: Author[] = [];
  dataSource = new MatTableDataSource<Book>();
  private authorsSub: Subscription | undefined;
  private refreshSub: Subscription | undefined;
  private editSub: Subscription | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private bookService: BookService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.dataSource.sortingDataAccessor = (item: Book, property: string) => {
      switch(property) {
        case 'author': return this.getAuthorName(item.author_id);
        default: return item[property];
      }
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.refreshAll();
  }

  ngOnDestroy(): void {
    this.authorsSub?.unsubscribe();
    this.refreshSub?.unsubscribe();
    this.editSub?.unsubscribe();
  }

  private refreshAll(): void {
    if (this.authorsSub != null) {
      this.authorsSub.unsubscribe();
    }

    this.authorsSub = this.bookService.getAuthors().subscribe(authors => {
      this.authors = authors;

      this.refreshBooks();
    });
  }

  private refreshBooks(): void {
    if (this.refreshSub != null) {
      this.refreshSub.unsubscribe();
    }

    this.refreshSub = this.bookService.getBooks().subscribe(books => {
      this.dataSource.data = books;
    });
  }

  editBook(book: Book): void {
    const dialogRef = this.dialog.open(BookEditorDialog, {
      width: '250px',
      data: {
        authors: this.authors,
        book
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if (this.editSub != null) {
          this.editSub.unsubscribe();
        }

        this.editSub = this.bookService.updateBook(result).subscribe(() => {
          this.refreshBooks();
        });
      }
    });
  }

  getAuthorName(id: number): string | undefined {
    let author = this.authors.find(author => author.id == id);
    return author?.name;
  }

}
