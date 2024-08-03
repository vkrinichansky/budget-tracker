import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl } from '@angular/forms';
import { Account, AccountsFacadeService, CurrencyService } from '@budget-tracker/data';
import { combineLatest, filter, map, Observable, take, tap, withLatestFrom } from 'rxjs';

enum FormFields {
  FromAccount = 'fromAccount',
  ToAccount = 'toAccount',
  ValueToMove = 'valueToMove',
  ConvertedValueToMove = 'convertedValueToMove',
}

@Component({
  selector: 'app-move-money-between-accounts-modal',
  templateUrl: './move-money-between-accounts-modal.component.html',
  styleUrl: './move-money-between-accounts-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveMoneyBetweenAccountsModalComponent implements OnInit {
  readonly formFieldsEnum = FormFields;

  readonly form: FormGroup = new FormGroup({
    [FormFields.FromAccount]: new FormControl(null),
    [FormFields.ToAccount]: new FormControl(null),
    [FormFields.ValueToMove]: new FormControl(null),
    [FormFields.ConvertedValueToMove]: new FormControl(null),
  });

  readonly idSelector = (account: Account) => account.id;
  readonly iconSelector = (account: Account) => account.icon;
  readonly displayValueSelector = (account: Account) =>
    `${account.name} (${account.value} ${account.currency.symbol})`;

  accounts$: Observable<Account[]>;
  filteredAccounts$: Observable<Account[]>;

  loading$: Observable<boolean>;
  success$: Observable<boolean>;

  get accountsHaveDifferentCurrencies(): boolean {
    const fromAccount = this.form.controls[FormFields.FromAccount].value as Account;
    const toAccount = this.form.controls[FormFields.ToAccount].value as Account;

    return fromAccount && toAccount ? fromAccount.currency.id !== toAccount.currency.id : false;
  }

  get isAnyAccountFieldEmpty(): boolean {
    return (
      !this.form?.controls?.[FormFields.FromAccount]?.value ||
      !this.form?.controls?.[FormFields.ToAccount]?.value
    );
  }

  get currencySymbolForValueField(): string {
    return (this.form?.controls?.[FormFields.FromAccount]?.value as Account)?.currency?.symbol;
  }

  get currencySymbolForConvertedValueField(): string {
    return (this.form?.controls?.[FormFields.ToAccount]?.value as Account)?.currency?.symbol;
  }

  get maxValue(): number {
    return parseInt(this.form?.controls?.[FormFields.FromAccount]?.value?.value);
  }

  constructor(
    private accountsFacade: AccountsFacadeService,
    private destroyRef: DestroyRef,
    private currencyService: CurrencyService,
    private dialogRef: DialogRef
  ) {}

  ngOnInit(): void {
    this.initListeners();
  }

  submitAction(): void {
    this.accountsFacade.moveMoneyBetweenAccount(
      this.form.controls[FormFields.FromAccount].value.id,
      this.form.controls[FormFields.ToAccount].value.id,
      parseInt(this.form.controls[FormFields.ValueToMove].value),
      parseInt(this.form.controls[FormFields.ConvertedValueToMove].value)
    );
  }

  private initListeners(): void {
    this.accounts$ = this.accountsFacade.getAllAccounts();

    this.filteredAccounts$ = this.form.controls[FormFields.FromAccount].valueChanges.pipe(
      withLatestFrom(this.accounts$),
      tap(() => {
        this.form.controls[FormFields.ToAccount].setValue(null);
        this.form.controls[FormFields.ValueToMove].setValue(null);
        this.form.controls[FormFields.ConvertedValueToMove].setValue(null);
      }),
      map(([choosedAccount, accounts]) =>
        accounts.filter((account) => account.id !== (choosedAccount as Account).id)
      )
    );

    combineLatest([
      this.form.controls[FormFields.ValueToMove].valueChanges,
      this.form.controls[FormFields.FromAccount].valueChanges.pipe(filter((account) => !!account)),
      this.form.controls[FormFields.ToAccount].valueChanges.pipe(filter((account) => !!account)),
    ])
      .pipe(
        tap(([value, fromAccount, toAccount]) => {
          const convertedValue = this.currencyService.convertCurrency(
            parseInt(value),
            (fromAccount as Account).currency.id,
            (toAccount as Account).currency.id
          );

          this.form.controls[FormFields.ConvertedValueToMove].setValue(
            value ? convertedValue : null
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.loading$ = this.accountsFacade.getMovingMoneyBetweenAccountsInProgress();
    this.success$ = this.accountsFacade.getMovingMoneyBetweenAccountsSuccess();

    this.success$
      .pipe(
        filter((isSuccess) => !!isSuccess),
        take(1)
      )
      .subscribe(() => this.dialogRef.close());
  }
}
