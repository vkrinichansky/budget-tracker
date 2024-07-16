import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, filter, take } from 'rxjs';
import { CategoryValueModalData } from '../../models';
import {
  Account,
  AccountsFacadeService,
  CategoriesFacadeService,
  Category,
} from '@budget-tracker/data';

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
    [FormFields.ValueToAdd]: new FormControl(null),
    [FormFields.Note]: new FormControl(null),
    [FormFields.AccountToUse]: new FormControl(null),
  });

  readonly idSelector = (account: Account) => account.id;
  readonly iconSelector = (account: Account) => account.icon;
  readonly displayValueSelector = (account: Account) =>
    `${account.name} (${account.value} ${account.currency.symbol})`;

  loading$: Observable<boolean>;
  success$: Observable<boolean>;
  category$: Observable<Category>;
  accounts$: Observable<Account[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: CategoryValueModalData,
    private dialogRef: MatDialogRef<CategoryValueModalComponent>,
    private categoriesFacade: CategoriesFacadeService,
    private accountsFacade: AccountsFacadeService
  ) {}

  ngOnInit(): void {
    this.initListeners();
  }

  cancelClick(): void {
    this.dialogRef.close();
  }

  submitClick(): void {
    this.categoriesFacade.changeCategoryValue(
      this.data.categoryId,
      this.form.controls[FormFields.AccountToUse].value.id,
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
