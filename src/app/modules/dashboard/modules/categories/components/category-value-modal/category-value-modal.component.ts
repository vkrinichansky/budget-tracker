import { ChangeDetectionStrategy, Component, DestroyRef, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, filter, take, tap, withLatestFrom } from 'rxjs';
import { CategoryValueModalData } from '../../models';
import {
  Account,
  AccountsFacadeService,
  CategoriesFacadeService,
  Category,
  CurrencyService,
} from '@budget-tracker/data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

enum FormFields {
  ValueToAdd = 'valueToAdd',
  ConvertedValueToAdd = 'convertedValueToAdd',
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
    [FormFields.AccountToUse]: new FormControl(null),
    [FormFields.ValueToAdd]: new FormControl(null),
    [FormFields.ConvertedValueToAdd]: new FormControl(null),
    [FormFields.Note]: new FormControl(null),
  });

  readonly idSelector = (account: Account) => account.id;
  readonly iconSelector = (account: Account) => account.icon;
  readonly displayValueSelector = (account: Account) =>
    `${account.name} (${account.value} ${account.currency.symbol})`;

  loading$: Observable<boolean>;
  success$: Observable<boolean>;
  category$: Observable<Category>;
  accounts$: Observable<Account[]>;

  get accoundChoosed(): boolean {
    return this.form?.controls?.[FormFields.AccountToUse]?.value;
  }

  get doesChoosedAccountHaveForeignCurrency(): boolean {
    return this.accoundChoosed
      ? (this.form.controls[FormFields.AccountToUse].value as Account).currency.id !==
          this.currencyService.getCurrentCurrency()
      : false;
  }

  get currencySymbolForValueField(): string {
    if (!this.accoundChoosed) {
      return null;
    }

    return this.doesChoosedAccountHaveForeignCurrency
      ? (this.form?.controls?.[FormFields.AccountToUse]?.value as Account)?.currency?.symbol
      : this.currencyService.getCurrencySymbol();
  }

  get currencySymbolForConvertedValueField(): string {
    return this.accoundChoosed ? this.currencyService.getCurrencySymbol() : null;
  }

  get maxValue(): number {
    return parseInt(this.form?.controls?.[FormFields.AccountToUse]?.value?.value);
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: CategoryValueModalData,
    private dialogRef: MatDialogRef<CategoryValueModalComponent>,
    private categoriesFacade: CategoriesFacadeService,
    private accountsFacade: AccountsFacadeService,
    private currencyService: CurrencyService,
    private destroyRef: DestroyRef
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
      parseInt(this.form.controls[FormFields.ConvertedValueToAdd].value),
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

    this.form.controls[FormFields.AccountToUse].valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.form.controls[FormFields.ValueToAdd].reset(null);
          this.form.controls?.[FormFields.ConvertedValueToAdd].reset(null);
        })
      )
      .subscribe();

    this.form.controls[FormFields.ValueToAdd].valueChanges
      .pipe(
        withLatestFrom(this.form.controls[FormFields.AccountToUse].valueChanges),
        tap(([value, account]) => {
          const convertedValue = this.currencyService.getBasicToForeignConvertedValue(
            value,
            account.currency.id
          );

          this.form.controls[FormFields.ConvertedValueToAdd].setValue(
            value ? convertedValue : null
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
