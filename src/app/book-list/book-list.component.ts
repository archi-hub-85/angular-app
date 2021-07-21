import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

import { Book } from '../dto';
import { BookService } from '../book-service/book.service';
import { BookEditorDialog } from '../book-editor/book-editor.component';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, AfterViewInit, OnDestroy {

  readonly displayedColumns: string[] = ['id', 'title', 'year', 'author', 'action'];
  dataSource = new MatTableDataSource<Book>();
  private subscription: Subscription | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private bookService: BookService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'author': return item.author.name;
        default: return item[property];
      }
    }
  }

  ngAfterViewInit(): void {
    this.subscription = this.bookService.getBooks().subscribe(books => {
        this.dataSource.data = books;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  editBook(book: Book): void {
    const dialogRef = this.dialog.open(BookEditorDialog, {
      width: '250px',
      data: book
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        // TODO replace with the update request to bookService

        const book = this.dataSource.data.find(value => {
          return (value.id == result.id);
        });

        if (book != null) {
          book.title = result.title;
          book.year = result.year;
          book.author.name = result.author.name;
        }
      }
    });
    ;
  }

}
