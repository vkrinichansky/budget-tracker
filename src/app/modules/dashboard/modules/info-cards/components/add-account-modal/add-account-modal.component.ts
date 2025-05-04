import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AccountsFacadeService } from '../../../../services';
import { Account, Currency, predefinedCurrenciesDictionary } from '@budget-tracker/models';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { ActionListenerService } from '@budget-tracker/utils';
import { AccountsActions } from '../../../../store';
import { SnackbarHandlerService } from '@budget-tracker/design-system';

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
  standalone: false,
})
export class AddAccountModalComponent implements OnInit {
  private accounts: Account[];

  readonly formFields = FormFields;
  readonly loading$ = new BehaviorSubject<boolean>(false);

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
    private readonly accountsFacade: AccountsFacadeService,
    private readonly destroyRef: DestroyRef,
    private readonly translateService: TranslateService,
    private readonly dialogRef: MatDialogRef<AddAccountModalComponent>,
    private readonly actionListener: ActionListenerService,
    private readonly snackbarHandler: SnackbarHandlerService
  ) {}

  ngOnInit(): void {
    this.initListeners();
  }

  async submitClick(): Promise<void> {
    this.loading$.next(true);

    try {
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

      await this.actionListener.waitForResult(
        AccountsActions.accountAdded,
        AccountsActions.addAccountFail
      );

      this.dialogRef.close();
      this.snackbarHandler.showAccountAddedSnackbar();
    } catch {
      this.snackbarHandler.showGeneralErrorSnackbar();
    } finally {
      this.loading$.next(false);
    }
  }

  private initListeners(): void {
    this.accountsFacade
      .getAllAccounts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((accounts) => (this.accounts = accounts));
  }
}
