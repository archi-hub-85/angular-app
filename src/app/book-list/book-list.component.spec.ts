import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';
import { MatSortHarness } from '@angular/material/sort/testing';
import { MatCellHarness, MatTableHarness } from '@angular/material/table/testing';
import { asapScheduler, of } from 'rxjs';
import { observeOn } from 'rxjs/operators';

import { AppMaterialModule } from '../app-material.module';
import { Author, Book } from '../dto';
import { BookService } from '../book-service/book.service';
import { BookListComponent } from './book-list.component';

@Component({ selector: 'block-ui', template: '' })
class BlockUiStubComponent {
  start(message: string) { }
  stop() { }
}

describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  let loader: HarnessLoader;
  let page: Page;

  let bookService: jasmine.SpyObj<BookService>;
  let getBooksSpy: jasmine.Spy<jasmine.Func>;
  let dialogOpenSpy: jasmine.Spy<jasmine.Func>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<any>>;
  let blockUiStartSpy: jasmine.Spy<jasmine.Func>;
  let blockUiStopSpy: jasmine.Spy<jasmine.Func>;

  const authors: Author[] = [
    { id: 1, name: 'Z author' },
    { id: 2, name: 'A author' }
  ];
  const books: Book[] = [
    { id: 1, title: 'A title', year: 2010, author_id: 1 },
    { id: 2, title: 'D title', year: 2020, author_id: 2 },
    { id: 3, title: 'B title', year: 2011, author_id: 1 },
    { id: 4, title: 'E title', year: 2021, author_id: 2 },
    { id: 5, title: 'C title', year: 2012, author_id: 1 },
    { id: 6, title: 'F title', year: 2022, author_id: 2 }
  ];

  beforeEach(async () => {
    bookService = jasmine.createSpyObj('BookService', ['getAuthors', 'getBooks', 'addBook', 'updateBook', 'deleteBook']);
    // delay returning of values to prevent NG0100: ExpressionChangedAfterItHasBeenCheckedError
    bookService.getAuthors.and.returnValue(of(authors).pipe(observeOn(asapScheduler)));
    getBooksSpy = bookService.getBooks.and.returnValue(of(books));

    dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']) as jasmine.SpyObj<MatDialogRef<any>>;
    const dialog = jasmine.createSpyObj('MatDialog', ['open']) as jasmine.SpyObj<MatDialog>;
    dialogOpenSpy = dialog.open.and.returnValue(dialogRef);

    await TestBed.configureTestingModule({
      declarations: [BookListComponent, BlockUiStubComponent],
      imports: [NoopAnimationsModule, AppMaterialModule],
      providers: [
        { provide: BookService, useValue: bookService },
        { provide: MatDialog, useValue: dialog }
      ]
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(BookListComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    page = new Page(fixture, loader);

    blockUiStartSpy = spyOn(component.blockUI, 'start').and.callThrough();
    blockUiStopSpy = spyOn(component.blockUI, 'stop').and.callThrough();

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain right title', () => {
    expect(page.componentTitle.textContent).toEqual('Books');
  });

  it('table should contain header row', async () => {
    const table = await page.table;
    const headerRows = await table.getHeaderRows();
    expect(headerRows.length).withContext('headerRows.length').toEqual(1);

    const headerRow = headerRows[0];
    const cells = await headerRow.getCells();
    const cellColumnNames = await parallel(() => cells.map(cell => cell.getColumnName()));
    expect(cellColumnNames)/*.withContext('columnNames')*/.toEqual(['id', 'title', 'year', 'author', 'action']);
    const cellTexts = await parallel(() => cells.map(cell => cell.getText()));
    expect(cellTexts)/*.withContext('cellTexts')*/.toEqual(['ID', 'Title', 'Year', 'Author', 'Action']);
  });

  it('should load books into table on start', async () => {
    const table = await page.table;
    const rows = await table.getRows();
    expect(rows.length).withContext('rows.length').toEqual(5); // pageSize

    for (const [index, row] of rows.entries()) {
      const book = books[index];
      const bookTexts: string[] = [
        '' + book.id,
        book.title,
        '' + book.year,
        component.getAuthorName(book.author_id)!
      ];

      const cells = await row.getCells({ columnName: /^(?!action$).+$/ });
      const cellTexts = await parallel(() => cells.map(cell => cell.getText()));
      expect(cellTexts)/*.withContext(`row[${index}].cellTexts`)*/.toEqual(bookTexts);
    }
  });

  it('should add book', async () => {
    const newBook: Book = { id: 0, title: 'Some title', year: 2021, author_id: 2 };
    dialogRef.afterClosed.and.returnValue(of(newBook));

    const createdBook: Book = Object.assign({}, newBook, { id: 7 });
    const addBookSpy = bookService.addBook.and.returnValue(of(createdBook));
    getBooksSpy.calls.reset();

    blockUiStartSpy.calls.reset();
    blockUiStopSpy.calls.reset();

    const addBtn = await page.addBtn;
    await addBtn.click();

    expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
    const dialogArgs = dialogOpenSpy.calls.argsFor(0);
    expect(dialogArgs.length).withContext('dialog.open.args.length').toEqual(2);
    expect(dialogArgs[1]?.data)/*.withContext('dialog.config.data')*/.toEqual({ dialogTitle: 'Add book', authors, book: {} });

    expect(addBookSpy).toHaveBeenCalledOnceWith(newBook);
    expect(getBooksSpy).toHaveBeenCalledTimes(1);

    expect(blockUiStartSpy).toHaveBeenCalledTimes(2);
    expect(blockUiStartSpy.calls.argsFor(0))/*.withContext('BlockUI.start(1)')*/.toEqual(['Adding book...']);
    expect(blockUiStartSpy.calls.argsFor(1))/*.withContext('BlockUI.start(2)')*/.toEqual(['Loading books...']);
    expect(blockUiStopSpy).toHaveBeenCalledTimes(2);
  });

  it('should edit book', async () => {
    const index = 0;
    const book = books[index];
    dialogRef.afterClosed.and.returnValue(of(book));

    const updateBookSpy = bookService.updateBook.and.returnValue(of(book));
    getBooksSpy.calls.reset();

    blockUiStartSpy.calls.reset();
    blockUiStopSpy.calls.reset();

    const actionCell = await getActionCell(index);
    const editBtn = await page.editBtn(actionCell);
    await editBtn.click();

    expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
    const dialogArgs = dialogOpenSpy.calls.argsFor(0);
    expect(dialogArgs.length).withContext('dialog.open.args.length').toEqual(2);
    expect(dialogArgs[1]?.data)/*.withContext('dialog.config.data')*/.toEqual({ dialogTitle: 'Edit book', authors, book });

    expect(updateBookSpy).toHaveBeenCalledOnceWith(book);
    expect(getBooksSpy).toHaveBeenCalledTimes(1);

    expect(blockUiStartSpy).toHaveBeenCalledTimes(2);
    expect(blockUiStartSpy.calls.argsFor(0))/*.withContext('BlockUI.start(1)')*/.toEqual(['Updating book...']);
    expect(blockUiStartSpy.calls.argsFor(1))/*.withContext('BlockUI.start(2)')*/.toEqual(['Loading books...']);
    expect(blockUiStopSpy).toHaveBeenCalledTimes(2);
  });

  it('should delete book', async () => {
    const index = 0;
    const book = books[index];
    const id = book.id;

    const confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
    const deleteBookSpy = bookService.deleteBook.and.returnValue(of(book));
    getBooksSpy.calls.reset();

    blockUiStartSpy.calls.reset();
    blockUiStopSpy.calls.reset();

    const actionCell = await getActionCell(index);
    const deleteBtn = await page.deleteBtn(actionCell);
    await deleteBtn.click();

    expect(confirmSpy).toHaveBeenCalledOnceWith(`Are you sure to delete book "${book.title}"?`);

    expect(deleteBookSpy).toHaveBeenCalledOnceWith(id);
    expect(getBooksSpy).toHaveBeenCalledTimes(1);

    expect(blockUiStartSpy).toHaveBeenCalledTimes(2);
    expect(blockUiStartSpy.calls.argsFor(0))/*.withContext('BlockUI.start(1)')*/.toEqual(['Deleting book...']);
    expect(blockUiStartSpy.calls.argsFor(1))/*.withContext('BlockUI.start(2)')*/.toEqual(['Loading books...']);
    expect(blockUiStopSpy).toHaveBeenCalledTimes(2);
  });

  const getActionCell = async function (rowIndex: number) {
    const table = await page.table;
    const rows = await table.getRows();
    expect(rows.length).withContext('rows.length').toBeGreaterThan(rowIndex);
    const cells = await rows[rowIndex].getCells({ columnName: 'action' });
    expect(cells.length).withContext('cells.length').toEqual(1);
    return cells[0];
  }

  it('should sort table', async () => {
    const table = await page.table;
    const sort = await page.sort;

    const headers = await sort.getSortHeaders();
    expect(headers.length).withContext('headers.length').toEqual(4);

    const bookFields = ['id', 'title', 'year', 'author'];
    for (const [index, header] of headers.entries()) {
      const field = bookFields[index];
      const bookTexts = books.map(book => '' + component.dataSource.sortingDataAccessor(book, field));
      bookTexts.sort();

      await header.click();
      expect(await header.getSortDirection()).withContext(`header[${index}]`).toEqual('asc');

      let cellTexts = await table.getCellTextByIndex();
      let columnTexts = cellTexts.map(rowTexts => rowTexts[index]);
      let sortedTexts = bookTexts.slice(0, 5); // pageSize
      expect(columnTexts)/*.withContext(`column[${index}] texts`)*/.toEqual(sortedTexts);

      await header.click();
      expect(await header.getSortDirection()).withContext(`header[${index}]`).toEqual('desc');

      cellTexts = await table.getCellTextByIndex();
      columnTexts = cellTexts.map(rowTexts => rowTexts[index]);
      sortedTexts = bookTexts.reverse().slice(0, 5); // pageSize
      expect(columnTexts)/*.withContext(`column[${index}] texts (desc)`)*/.toEqual(sortedTexts);
    }
  });

  it('should be able to navigate between pages', async () => {
    const paginator = await page.paginator;

    expect(await paginator.getPageSize()).withContext('pageSize').toEqual(5);
    expect(component.paginator.getNumberOfPages()).withContext('numberOfPages').toEqual(2);
    expect(component.paginator.pageIndex).withContext('pageIndex').toEqual(0);

    await paginator.goToNextPage();
    expect(component.paginator.pageIndex).withContext('pageIndex (after move to next page)').toEqual(1);

    await paginator.setPageSize(10);
    expect(await paginator.getPageSize()).withContext('pageSize (after change page size)').toEqual(10);
    expect(component.paginator.getNumberOfPages()).withContext('numberOfPages (after change page size)').toEqual(1);
    expect(component.paginator.pageIndex).withContext('pageIndex (after change page size)').toEqual(0);
  });
});

class Page {
  // getter properties wait to query the DOM until called.
  get componentTitle() {
    return this.fixture.nativeElement.querySelector('h2') as HTMLElement;
  }
  get addBtn() {
    return this.loader.getHarness(MatButtonHarness.with({ text: 'Add' }));
  }
  get table() {
    return this.loader.getHarness(MatTableHarness);
  }
  editBtn(actionCell: MatCellHarness) {
    return actionCell.getHarness(MatButtonHarness.with({ text: 'Edit' }));
  }
  deleteBtn(actionCell: MatCellHarness) {
    return actionCell.getHarness(MatButtonHarness.with({ text: 'Delete' }));
  }
  get sort() {
    return this.loader.getHarness(MatSortHarness);
  }
  get paginator() {
    return this.loader.getHarness(MatPaginatorHarness);
  }

  constructor(
    private fixture: ComponentFixture<BookListComponent>,
    private loader: HarnessLoader) {
  }
}
