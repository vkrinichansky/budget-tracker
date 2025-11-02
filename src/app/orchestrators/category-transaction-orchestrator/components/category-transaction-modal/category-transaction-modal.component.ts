import { ChangeDetectionStrategy, Component, DestroyRef, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  first,
  map,
  Observable,
  startWith,
  tap,
  withLatestFrom,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BudgetType } from '@budget-tracker/shared-models';
import { MetadataFacadeService, predefinedCurrenciesDictionary } from '@budget-tracker/metadata';
import { SnackbarHandlerService } from '@budget-tracker/design-system';
import { AccountFacadeService, Account, AccountModalService } from '@budget-tracker/account';
import { CategoryFacadeService } from '@budget-tracker/category';
import { Category } from '@budget-tracker/category';
import { getErrorMessage } from '@budget-tracker/shared-utils';

enum FormFields {
  VALUE_TO_ADD = 'valueToAdd',
  CONVERTED_VALUE_TO_ADD = 'convertedValueToAdd',
  NOTE = 'note',
  ACCOUNT_TO_USE = 'accountToUse',
}

@Component({
  selector: 'app-category-transaction-modal',
  templateUrl: './category-transaction-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CategoryTransactionModalComponent implements OnInit {
  readonly formFieldsEnum = FormFields;
  readonly loading$ = new BehaviorSubject<boolean>(false);

  readonly form: FormGroup = new FormGroup({
    [FormFields.ACCOUNT_TO_USE]: new FormControl(null),
    [FormFields.VALUE_TO_ADD]: new FormControl(null),
    [FormFields.CONVERTED_VALUE_TO_ADD]: new FormControl(null),
    [FormFields.NOTE]: new FormControl(null),
  });

  readonly idSelector = (account: Account) => account.id;
  readonly iconSelector = (account: Account) => account.icon;
  readonly displayValueSelector = (account: Account) =>
    `${account.name} (${account.value} ${predefinedCurrenciesDictionary[account.currency].symbol})`;

  success$: Observable<boolean>;
  accounts$: Observable<Account[]>;
  category$: Observable<Category>;
  maxValue$: Observable<number | undefined>;

  get accoundChoosed(): boolean {
    return this.form?.controls?.[FormFields.ACCOUNT_TO_USE]?.value;
  }

  get doesChoosedAccountHaveForeignCurrency(): boolean {
    return this.accoundChoosed
      ? (this.form.controls[FormFields.ACCOUNT_TO_USE].value as Account).currency !==
          this.metadataFacade.currentCurrency
      : false;
  }

  get currencySymbolForValueField(): string {
    if (!this.accoundChoosed) {
      return null;
    }

    return this.doesChoosedAccountHaveForeignCurrency
      ? predefinedCurrenciesDictionary[
          (this.form?.controls?.[FormFields.ACCOUNT_TO_USE]?.value as Account)?.currency
        ]?.symbol
      : this.metadataFacade.getCurrencySymbol();
  }

  get currencySymbolForConvertedValueField(): string {
    return this.accoundChoosed ? this.metadataFacade.getCurrencySymbol() : null;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly data: {
      categoryId: string;
      transactionCallback: (
        categoryId: string,
        accountId: string,
        valueToAdd: number,
        convertedValueToAdd: number,
        note: string
      ) => Promise<void>;
    },
    private readonly dialogRef: MatDialogRef<CategoryTransactionModalComponent>,
    private readonly categoryFacade: CategoryFacadeService,
    private readonly accountFacade: AccountFacadeService,
    private readonly metadataFacade: MetadataFacadeService,
    private readonly destroyRef: DestroyRef,
    private readonly snackbarHandler: SnackbarHandlerService,
    private readonly accountModalService: AccountModalService
  ) {}

  ngOnInit(): void {
    this.initListeners();
  }

  openAddAccountModal(): void {
    this.dialogRef.close();
    this.accountModalService.openAddAccountsModal();
  }

  cancelClick(): void {
    this.dialogRef.close();
  }

  async submitClick(): Promise<void> {
    this.loading$.next(true);

    try {
      await this.data.transactionCallback(
        this.data.categoryId,
        this.form.controls[FormFields.ACCOUNT_TO_USE].value.id,
        parseInt(this.form.controls[FormFields.VALUE_TO_ADD].value),
        parseInt(this.form.controls[FormFields.CONVERTED_VALUE_TO_ADD].value),
        this.form.controls[FormFields.NOTE].value
      );

      this.dialogRef.close();
      this.snackbarHandler.showMessageSnackbar('messages.category.categoryValueChanged');
    } catch (error) {
      this.snackbarHandler.showErrorSnackbar(getErrorMessage(error));
    } finally {
      this.loading$.next(false);
    }
  }

  private initListeners(): void {
    this.accounts$ = this.accountFacade.getAllAccounts().pipe(first());
    this.category$ = this.categoryFacade.getCategoryById(this.data.categoryId).pipe(first());
    this.maxValue$ = combineLatest([
      this.category$,
      this.form.controls[FormFields.ACCOUNT_TO_USE].valueChanges.pipe(startWith(null)),
    ]).pipe(
      map(([category, account]) => {
        switch (category.budgetType) {
          case BudgetType.INCOME:
            return undefined;

          case BudgetType.EXPENSE:
            return parseInt(account?.value);
        }
      })
    );

    this.form.controls[FormFields.ACCOUNT_TO_USE].valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.form.controls[FormFields.VALUE_TO_ADD].reset(null);
          this.form.controls?.[FormFields.CONVERTED_VALUE_TO_ADD].reset(null);
        })
      )
      .subscribe();

    this.form.controls[FormFields.VALUE_TO_ADD].valueChanges
      .pipe(
        withLatestFrom(this.form.controls[FormFields.ACCOUNT_TO_USE].valueChanges),
        tap(([value, account]) => {
          const convertedValue = this.metadataFacade.getBasicToForeignConvertedValue(
            value,
            account.currency
          );

          this.form.controls[FormFields.CONVERTED_VALUE_TO_ADD].setValue(
            value ? convertedValue : null
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
