import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, filter, take } from 'rxjs';
import { CategoryValueModalData } from '../../models';
import { Account, AccountsFacadeService, CategoriesFacadeService, Category } from '@budget-tracker/data';

enum FormFields {
  ValueToAdd = 'valueToAdd',
  Note = 'note',
  AccountToUse = 'accountToUse',
}

@Component({
  selector: 'app-category-value-modal',
  templateUrl: './category-value-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryValueModalComponent implements OnInit {
  readonly formFieldsEnum = FormFields;

  readonly form: FormGroup = new FormGroup({
    [FormFields.ValueToAdd]: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.pattern(new RegExp(/^[0-9]+$/)),
    ]),
    [FormFields.Note]: new FormControl(null, [Validators.maxLength(100)]),
    [FormFields.AccountToUse]: new FormControl('', [Validators.required]),
  });

  loading$: Observable<boolean>;
  success$: Observable<boolean>;
  category$: Observable<Category>;
  accounts$: Observable<Account[]>;

  get isFormValid(): boolean {
    return this.form.valid;
  }

  get hasRequiredError(): boolean {
    return this.form.controls[FormFields.ValueToAdd].hasError('required');
  }

  get hasMinValueError(): boolean {
    return this.form.controls[FormFields.ValueToAdd].hasError('min');
  }

  get hasNumberPatternError(): boolean {
    return this.form.controls[FormFields.ValueToAdd].hasError('pattern');
  }

  get hasMaxLengthError(): boolean {
    return this.form.controls[FormFields.Note].hasError('maxlength');
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: CategoryValueModalData,
    private dialogRef: MatDialogRef<CategoryValueModalComponent>,
    private categoriesFacade: CategoriesFacadeService,
    private accountsFacade: AccountsFacadeService
  ) {}

  ngOnInit(): void {
    this.initListeners();
  }

  buildTranslationKey(key: string): string {
    return `dashboard.categoryValueModal.${key}`;
  }

  cancelClick(): void {
    this.dialogRef.close();
  }

  submitClick(): void {
    this.categoriesFacade.changeCategoryValue(
      this.data.categoryId,
      this.form.controls[FormFields.AccountToUse].value,
      parseInt(this.form.controls[FormFields.ValueToAdd].value),
      this.form.controls[FormFields.Note].value
    );
  }

  private initListeners(): void {
    this.category$ = this.categoriesFacade.getCategoryById(this.data.categoryId);
    this.accounts$ = this.accountsFacade.getAllAccounts();
    this.loading$ = this.categoriesFacade.getCategoryValueChangeInProgress();
    this.success$ = this.categoriesFacade.getCategoryValueChangeSuccess();

    this.success$
      .pipe(
        filter((isSuccess) => !!isSuccess),
        take(1)
      )
      .subscribe(() => this.dialogRef.close());
  }
}
