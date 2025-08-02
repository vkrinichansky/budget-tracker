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
import { CategoryValueModalData } from '../../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BudgetType } from '@budget-tracker/models';
import { MetadataFacadeService, predefinedCurrenciesDictionary } from '@budget-tracker/metadata';
import { SnackbarHandlerService } from '@budget-tracker/design-system';
import { AccountFacadeService, Account } from '@budget-tracker/account';
import { CategoryFacadeService } from '../../services';
import { Category } from '../../models';

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
    `${account.name} (${account.value} ${predefinedCurrenciesDictionary[account.currency].symbol})`;

  success$: Observable<boolean>;
  accounts$: Observable<Account[]>;
  category$: Observable<Category>;
  maxValue$: Observable<number | undefined>;

  get accoundChoosed(): boolean {
    return this.form?.controls?.[FormFields.AccountToUse]?.value;
  }

  get doesChoosedAccountHaveForeignCurrency(): boolean {
    return this.accoundChoosed
      ? (this.form.controls[FormFields.AccountToUse].value as Account).currency !==
          this.metadataFacade.currentCurrency
      : false;
  }

  get currencySymbolForValueField(): string {
    if (!this.accoundChoosed) {
      return null;
    }

    return this.doesChoosedAccountHaveForeignCurrency
      ? predefinedCurrenciesDictionary[
          (this.form?.controls?.[FormFields.AccountToUse]?.value as Account)?.currency
        ]?.symbol
      : this.metadataFacade.getCurrencySymbol();
  }

  get currencySymbolForConvertedValueField(): string {
    return this.accoundChoosed ? this.metadataFacade.getCurrencySymbol() : null;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: CategoryValueModalData,
    private readonly dialogRef: MatDialogRef<CategoryValueModalComponent>,
    private readonly categoryFacade: CategoryFacadeService,
    private readonly accountFacade: AccountFacadeService,
    private readonly metadataFacade: MetadataFacadeService,
    private readonly destroyRef: DestroyRef,
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
      await this.categoryFacade.runChangeCategoryValueFlow(
        this.data.categoryId,
        this.form.controls[FormFields.AccountToUse].value.id,
        parseInt(this.form.controls[FormFields.ValueToAdd].value),
        parseInt(this.form.controls[FormFields.ConvertedValueToAdd].value),
        this.form.controls[FormFields.Note].value
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
    this.accounts$ = this.accountFacade.getAllAccounts().pipe(first());
    this.category$ = this.categoryFacade.getCategoryById(this.data.categoryId).pipe(first());
    this.maxValue$ = combineLatest([
      this.category$,
      this.form.controls[FormFields.AccountToUse].valueChanges.pipe(startWith(null)),
    ]).pipe(
      map(([category, account]) => {
        switch (category.budgetType) {
          case BudgetType.Income:
            return undefined;

          case BudgetType.Expense:
            return parseInt(account?.value);
        }
      })
    );

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
          const convertedValue = this.metadataFacade.getBasicToForeignConvertedValue(
            value,
            account.currency
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
