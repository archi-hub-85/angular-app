import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { BlockUI, NgBlockUI } from 'ng-block-ui';

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
  private booksSub: Subscription | undefined;
  private addSub: Subscription | undefined;
  private editSub: Subscription | undefined;
  private deleteSub: Subscription | undefined;

  @BlockUI() blockUI!: NgBlockUI;

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
    safeUnsubscribe(this.authorsSub);
    safeUnsubscribe(this.booksSub);
    safeUnsubscribe(this.editSub);
    safeUnsubscribe(this.addSub);
    safeUnsubscribe(this.deleteSub);
  }

  private processWithBlock<T>(observable: Observable<T>, message: string): Observable<T> {
    this.blockUI.start(message);
    return observable.pipe(
      finalize(() => this.blockUI.stop())
    );
  }

  private refreshAll(): void {
    safeUnsubscribe(this.authorsSub);

    this.authorsSub = this.processWithBlock(this.bookService.getAuthors(), 'Loading authors...').subscribe(authors => {
      this.authors = authors;

      this.refreshBooks();
    });
  }

  private refreshBooks(): void {
    safeUnsubscribe(this.booksSub);

    this.booksSub = this.processWithBlock(this.bookService.getBooks(), 'Loading books...').subscribe(books => {
      this.dataSource.data = books;
    });
  }

  addBook(): void {
    const dialogRef = this.dialog.open(BookEditorDialog, {
      width: '400px',
      data: {
        dialogTitle: 'Add book',
        authors: this.authors,
        book: {}
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        safeUnsubscribe(this.addSub);

        this.addSub = this.processWithBlock(this.bookService.addBook(result), 'Adding book...').subscribe(_ => {
          this.refreshBooks();
        });
      }
    });
  }

  editBook(book: Book): void {
    const dialogRef = this.dialog.open(BookEditorDialog, {
      width: '400px',
      data: {
        dialogTitle: 'Edit book',
        authors: this.authors,
        book
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        safeUnsubscribe(this.editSub);

        this.editSub = this.processWithBlock(this.bookService.updateBook(result), 'Updating book...').subscribe(_ => {
          this.refreshBooks();
        });
      }
    });
  }

  deleteBook(book: Book): void {
    if (confirm(`Are you sure to delete book "${book.title}"?`)) {
        safeUnsubscribe(this.deleteSub);

        this.deleteSub = this.processWithBlock(this.bookService.deleteBook(book.id), 'Deleting book...').subscribe(_ => {
          this.refreshBooks();
        });
    }
  }

  getAuthorName(id: number): string | undefined {
    let author = this.authors.find(author => author.id == id);
    return author?.name;
  }

}

const safeUnsubscribe = function(subscription: Subscription | undefined): void {
  if (subscription && !subscription.closed) {
    subscription.unsubscribe();
  }
};
