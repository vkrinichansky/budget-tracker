import { ChangeDetectionStrategy, Component, DestroyRef, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, tap, withLatestFrom } from 'rxjs';
import { CategoryValueModalData } from '../../models';
import { AccountsFacadeService, CategoriesFacadeService } from '../../../../services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Account, Category, BudgetType } from '@budget-tracker/models';
import { CurrencyFacadeService } from '@budget-tracker/metadata';
import { ActionListenerService } from '@budget-tracker/utils';
import { CategoriesActions } from '../../../../store';
import { SnackbarHandlerService } from '@budget-tracker/design-system';

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
  standalone: false,
})
export class CategoryValueModalComponent implements OnInit {
  readonly formFieldsEnum = FormFields;
  readonly loading$ = new BehaviorSubject<boolean>(false);

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

  success$: Observable<boolean>;
  accounts$: Observable<Account[]>;

  category: Category;

  get accoundChoosed(): boolean {
    return this.form?.controls?.[FormFields.AccountToUse]?.value;
  }

  get doesChoosedAccountHaveForeignCurrency(): boolean {
    return this.accoundChoosed
      ? (this.form.controls[FormFields.AccountToUse].value as Account).currency.id !==
          this.currencyFacade.getCurrentCurrency()
      : false;
  }

  get currencySymbolForValueField(): string {
    if (!this.accoundChoosed) {
      return null;
    }

    return this.doesChoosedAccountHaveForeignCurrency
      ? (this.form?.controls?.[FormFields.AccountToUse]?.value as Account)?.currency?.symbol
      : this.currencyFacade.getCurrencySymbol();
  }

  get currencySymbolForConvertedValueField(): string {
    return this.accoundChoosed ? this.currencyFacade.getCurrencySymbol() : null;
  }

  get maxValue(): number {
    switch (this.category.budgetType) {
      case BudgetType.Income:
        return undefined;

      case BudgetType.Expense:
        return parseInt(this.form?.controls?.[FormFields.AccountToUse]?.value?.value);
    }
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: CategoryValueModalData,
    private readonly dialogRef: MatDialogRef<CategoryValueModalComponent>,
    private readonly categoriesFacade: CategoriesFacadeService,
    private readonly accountsFacade: AccountsFacadeService,
    private readonly currencyFacade: CurrencyFacadeService,
    private readonly destroyRef: DestroyRef,
    private readonly actionListener: ActionListenerService,
    private readonly snackbarHandler: SnackbarHandlerService
  ) {}

  ngOnInit(): void {
    this.initListeners();
  }

  cancelClick(): void {
    this.dialogRef.close();
  }

  async submitClick(): Promise<void> {
    this.loading$.next(true);

    try {
      this.categoriesFacade.changeCategoryValue(
        this.data.categoryId,
        this.form.controls[FormFields.AccountToUse].value.id,
        parseInt(this.form.controls[FormFields.ValueToAdd].value),
        parseInt(this.form.controls[FormFields.ConvertedValueToAdd].value),
        this.form.controls[FormFields.Note].value
      );

      await this.actionListener.waitForResult(
        CategoriesActions.categoryValueChanged,
        CategoriesActions.changeCategoryValueFail
      );

      this.dialogRef.close();
      this.snackbarHandler.showCategoryValueChangedSnackbar();
    } catch {
      this.snackbarHandler.showGeneralErrorSnackbar();
    } finally {
      this.loading$.next(false);
    }
  }

  private initListeners(): void {
    this.accounts$ = this.accountsFacade.getAllAccounts();

    this.categoriesFacade
      .getCategoryById(this.data.categoryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((category) => (this.category = category));

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
          const convertedValue = this.currencyFacade.getBasicToForeignConvertedValue(
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
