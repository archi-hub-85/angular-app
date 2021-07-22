import { Component, HostListener, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Author, Book } from '../dto';

@Component({
  selector: 'app-book-editor',
  templateUrl: './book-editor.component.html',
  styleUrls: ['./book-editor.component.css']
})
export class BookEditorDialog {

  dialogTitle: string;

  authors: Author[];
  book: Book;

  form: FormGroup;

  constructor(
      private dialogRef: MatDialogRef<BookEditorDialog>,
      @Inject(MAT_DIALOG_DATA) data: any,
      private fb: FormBuilder) {
    this.dialogTitle = data.dialogTitle;
    this.authors = data.authors;
    this.book = data.book;

    this.form = this.fb.group({
      title: [this.book.title, Validators.required],
      year: [this.book.year, Validators.required],
      author: [this.book.author_id, Validators.required]
    });

    dialogRef.disableClose = true;
  }

  formControl(formFieldName: string): FormControl {
    return this.form.get(formFieldName) as FormControl;
  }

  getErrorMessage(formFieldName: string) {
    return this.formControl(formFieldName).hasError('required') ? 'The field is required' : '';
  }

  onSave(): void {
    this.book.title = this.formControl('title').value;
    this.book.year = this.formControl('year').value;
    this.book.author_id = this.formControl('author').value;

    this.dialogRef.close(this.book);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.onCancel();
  }

}
