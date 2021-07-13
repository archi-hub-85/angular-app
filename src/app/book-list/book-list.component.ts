import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Book } from '../dto';
import { BookService } from '../book-service/book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'title', 'year', 'author'];
  dataSource = new MatTableDataSource<Book>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private bookService: BookService
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
    this.bookService.getBooks().subscribe(books => {
        this.dataSource.data = books;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

}