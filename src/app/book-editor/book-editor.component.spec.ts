import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

import { AppMaterialModule } from '../app-material.module';
import { Author, Book } from '../dto';
import { BookEditorDialog } from './book-editor.component';

describe('BookEditorDialog', () => {
  let component: BookEditorDialog;
  let fixture: ComponentFixture<BookEditorDialog>;
  let loader: HarnessLoader;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<BookEditorDialog>>;
  let disableCloseSpy: jasmine.Spy<jasmine.Func>;
  let page: Page;

  const dialogTitle = 'some title';
  const authors: Author[] = [
    { id: 1, name: 'author1' },
    { id: 2, name: 'author2' }
  ];
  const book: Book = { id: 1, title: 'title1', year: 2021, author_id: 1 };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close'], ['disableClose']);
    disableCloseSpy = (Object.getOwnPropertyDescriptor(dialogRefSpy, 'disableClose')?.set as jasmine.Spy<(v: any) => void>).and.callThrough();

    await TestBed.configureTestingModule({
      declarations: [BookEditorDialog],
      imports: [NoopAnimationsModule, ReactiveFormsModule, AppMaterialModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { dialogTitle, authors, book } },
        FormBuilder
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookEditorDialog);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    page = new Page(fixture, loader);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set dialog data', () => {
    expect(disableCloseSpy).withContext('dialogRef.disableClose').toHaveBeenCalledOnceWith(true);
    expect(page.dialogTitle.textContent).withContext('dialogTitle').toEqual(dialogTitle);
  });

  it('should contain author list', async () => {
    const select = await page.authorSelect;
    await select.open();
    const options = await select.getOptions();

    expect(options.length).withContext('authors.length').toEqual(authors.length);

    for (const [index, author] of authors.entries()) {
      const option = options[index];
      // TODO MatOptionHarness doesn't have a getter for option's value!
      //expect(await option.getValue() as any).withContext(`authors[${index}].id`).toEqual(author.id);
      expect(await option.getText()).withContext(`authors[${index}].name`).toEqual(author.name);
    }
  });

  it('should display data after loaded', async () => {
    expect(await (await page.titleInput).getValue()).withContext('title').toEqual(book.title);
    expect(await (await page.yearInput).getValue()).withContext('year').toEqual('' + book.year);
    // TODO MatSelectHarness doesn't have a getter for internal value!
    expect(await (await page.authorSelect).getValueText()).withContext('author').toEqual('author1');

    expect(await (await page.titleFormField).hasErrors()).withContext('has title errors').toBeFalse();
    expect(await (await page.yearFormField).hasErrors()).withContext('has year errors').toBeFalse();
    expect(await (await page.authorFormField).hasErrors()).withContext('has author errors').toBeFalse();
  });

  it('should display error when title is invalid', async () => {
    await (await page.titleInput).setValue('');
    await (await page.titleInput).blur();

    expect(await (await page.titleFormField).getTextErrors()).toEqual(['The field is required']);
  });

  it('should display error when year is invalid', async () => {
    await (await page.yearInput).setValue('');
    await (await page.yearInput).blur();

    expect(await (await page.yearFormField).getTextErrors()).toEqual(['The field is required']);
  });

  /*it('should display error when author is invalid', async () => {
    // TODO How to not select any option?
    await (await page.authorSelect).clickOptions({ text: 'dummy' });

    expect(await (await page.authorFormField).getTextErrors()).toEqual(['The field is required']);
  });*/

  it('should update \'Save\' button\'s state', async () => {
    expect(await (await page.saveBtn).isDisabled()).withContext('saveBtn.disabled at start').toBeTrue();

    await (await page.titleInput).setValue('newTitle');
    expect(await (await page.saveBtn).isDisabled()).withContext('saveBtn.disabled after edit').toBeFalse();

    await (await page.titleInput).setValue('');
    expect(await (await page.saveBtn).isDisabled()).withContext('saveBtn.disabled if invalid').toBeTrue();
  });

  it('should close with data after \'Save\' button click', async () => {
    const updatedBook = Object.assign({}, component.book, { title: 'newTitle', year: 2020, author_id: 2 });

    await (await page.titleInput).setValue(updatedBook.title);
    await (await page.yearInput).setValue('' + updatedBook.year);
    await (await page.authorSelect).clickOptions({ text: 'author2' });

    expect(await (await page.saveBtn).isDisabled()).withContext('saveBtn.disabled').toBeFalse();

    const closeSpy = dialogRefSpy.close.and.callThrough();
    await (await page.saveBtn).click();
    expect(closeSpy).withContext('dialogRef.close').toHaveBeenCalledOnceWith(updatedBook);
  });

  it('should close without data after \'Cancel\' button click', async () => {
    const closeSpy = dialogRefSpy.close.and.callThrough();
    await (await page.cancelBtn).click();
    expect(closeSpy).withContext('dialogRef.close').toHaveBeenCalledOnceWith();
  });

  it('should close without data after \'Esc\' key click', () => {
    const closeSpy = dialogRefSpy.close.and.callThrough();
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
    expect(closeSpy).withContext('dialogRef.close').toHaveBeenCalledOnceWith();
  });
});

class Page {
  // getter properties wait to query the DOM until called.
  get dialogTitle() {
    return this.fixture.nativeElement.querySelector('h1') as HTMLElement;
  }
  get saveBtn() {
    return this.loader.getHarness(MatButtonHarness.with({ text: 'Save' }));
  }
  get cancelBtn() {
    return this.loader.getHarness(MatButtonHarness.with({ text: 'Cancel' }));
  }
  get titleInput() {
    return this.loader.getHarness(MatInputHarness.with({ selector: '[formControlName=title]' }));
  }
  get yearInput() {
    return this.loader.getHarness(MatInputHarness.with({ selector: '[formControlName=year]' }));
  }
  get authorSelect() {
    return this.loader.getHarness(MatSelectHarness.with({ selector: '[formControlName=author]' }));
  }
  get titleFormField() {
    return this.loader.getHarness(MatFormFieldHarness.with({ selector: '#titleFormField' }));
  }
  get yearFormField() {
    return this.loader.getHarness(MatFormFieldHarness.with({ selector: '#yearFormField' }));
  }
  get authorFormField() {
    return this.loader.getHarness(MatFormFieldHarness.with({ selector: '#authorFormField' }));
  }

  constructor(
    private fixture: ComponentFixture<BookEditorDialog>,
    private loader: HarnessLoader) {
  }
}
