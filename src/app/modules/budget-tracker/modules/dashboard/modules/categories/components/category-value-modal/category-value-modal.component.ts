import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, takeUntil, filter } from 'rxjs';
import { injectUnsubscriberService, provideUnsubscriberService } from '@budget-tracker/utils';
import { CategoryValueModalData } from '../../models';
import { CategoriesFacadeService } from '@budget-tracker/data';

enum FormFields {
  ValueToAdd = 'valueToAdd',
  Note = 'note',
}

@Component({
  selector: 'app-category-value-modal',
  templateUrl: './category-value-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideUnsubscriberService()],
})
export class CategoryValueModalComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.categoryValueModal';
  private readonly destroy$ = injectUnsubscriberService();

  readonly formFieldsEnum = FormFields;

  readonly form: FormGroup = new FormGroup({
    [FormFields.ValueToAdd]: new FormControl(null, [Validators.required, Validators.min(1)]),
    [FormFields.Note]: new FormControl(null, [Validators.maxLength(100)]),
  });

  loading$: Observable<boolean>;
  success$: Observable<boolean>;

  get isFormValid(): boolean {
    return this.form.valid;
  }

  get hasRequiredError(): boolean {
    return this.form.controls[FormFields.ValueToAdd].hasError('required');
  }

  get hasMinValueError(): boolean {
    return this.form.controls[FormFields.ValueToAdd].hasError('min');
  }

  get hasMaxLengthError(): boolean {
    return this.form.controls[FormFields.Note].hasError('maxlength');
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: CategoryValueModalData,
    private dialogRef: MatDialogRef<CategoryValueModalComponent>,
    private categoriesFacade: CategoriesFacadeService
  ) {}

  ngOnInit(): void {
    this.loading$ = this.categoriesFacade.getCategoryValueChangeInProgress();
    this.success$ = this.categoriesFacade.getCategoryValueChangeSuccess();

    this.success$
      .pipe(
        takeUntil(this.destroy$),
        filter((isSuccess) => !!isSuccess)
      )
      .subscribe(() => this.dialogRef.close());
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  cancelClick(): void {
    this.dialogRef.close();
  }

  submitClick(): void {
    this.categoriesFacade.changeCategoryValue(
      this.data.categoryId,
      parseInt(this.form.controls[FormFields.ValueToAdd].value),
      this.form.controls[FormFields.Note].value
    );
  }
}
