import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { BookEditorDialog } from './book-editor.component';

describe('BookEditorDialog', () => {
  let component: BookEditorDialog;
  let fixture: ComponentFixture<BookEditorDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookEditorDialog ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA,  useValue: { dialogTitle: '', authors: [], book: {} } },
        FormBuilder
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookEditorDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
