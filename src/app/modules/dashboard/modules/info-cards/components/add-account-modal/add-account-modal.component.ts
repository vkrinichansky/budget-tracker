import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AccountsFacadeService } from '@budget-tracker/data';
import { Account, Currency, predefinedCurrenciesDictionary } from '@budget-tracker/models';
import { TranslateService } from '@ngx-translate/core';
import { filter, Observable, take } from 'rxjs';
import { v4 as uuid } from 'uuid';

enum FormFields {
  AccountName = 'accountName',
  AccountValue = 'accountValue',
  AccountIcon = 'AccountIcon',
  AccountBgColor = 'accountBgColor',
  AccountTextColor = 'accountTextColor',
  AccountCurrency = 'accountCurrency',
}

@Component({
  selector: 'app-add-account-modal',
  templateUrl: './add-account-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAccountModalComponent implements OnInit {
  private accounts: Account[];

  readonly formFields = FormFields;

  readonly form: FormGroup = new FormGroup({
    [FormFields.AccountName]: new FormControl(null),
    [FormFields.AccountValue]: new FormControl(null),
    [FormFields.AccountIcon]: new FormControl(null),
    [FormFields.AccountBgColor]: new FormControl(null),
    [FormFields.AccountTextColor]: new FormControl(null),
    [FormFields.AccountCurrency]: new FormControl(null),
  });

  readonly options: Currency[] = Object.values(predefinedCurrenciesDictionary);

  readonly currencyIdSelector = (currency: Currency) => currency.id;
  readonly currencyIconSelector = (currency: Currency) => currency.icon;

  readonly currencyDisplayValueSelector = (currency: Currency) =>
    `${this.translateService.instant(`currencies.${currency.id}`)} `;

  readonly accountExistsValidator = (value: string) =>
    this.accounts
      .map((account) => account.name.toLowerCase().trim())
      .includes(value.toLowerCase().trim());

  loading$: Observable<boolean>;
  success$: Observable<boolean>;

  get selectedCurrencySymbol(): string {
    if (this.form.controls[FormFields.AccountCurrency]?.value?.symbol) {
      return this.form.controls[FormFields.AccountCurrency]?.value?.symbol;
    }

    return '';
  }

  get isFormValid(): boolean {
    return this.form.valid;
  }

  constructor(
    private accountsFacade: AccountsFacadeService,
    private destroyRef: DestroyRef,
    private translateService: TranslateService,
    private dialogRef: MatDialogRef<AddAccountModalComponent>
  ) {}

  ngOnInit(): void {
    this.initListeners();
  }

  submitClick(): void {
    const account: Account = {
      id: uuid(),
      value: parseInt(this.form.controls[FormFields.AccountValue].value),
      icon: this.form.controls[FormFields.AccountIcon].value,
      name: this.form.controls[FormFields.AccountName].value,
      bgColor: this.form.controls[FormFields.AccountBgColor].value,
      textColor: this.form.controls[FormFields.AccountTextColor].value,
      currency: this.form.controls[FormFields.AccountCurrency].value,
      order: 0,
    };

    this.accountsFacade.addAccount(account);
  }

  private initListeners(): void {
    this.loading$ = this.accountsFacade.getAccountManagementInProgress();
    this.success$ = this.accountsFacade.getAccountManagementSuccess();

    this.success$
      .pipe(
        filter((isSuccess) => !!isSuccess),
        take(1)
      )
      .subscribe(() => this.dialogRef.close());

    this.accountsFacade
      .getAllAccounts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((accounts) => (this.accounts = accounts));
  }
}
