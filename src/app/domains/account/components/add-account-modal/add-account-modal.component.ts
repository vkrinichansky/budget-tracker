import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { SnackbarHandlerService } from '@budget-tracker/design-system';
import { predefinedCurrenciesDictionary, Currency, CurrenciesEnum } from '@budget-tracker/metadata';
import { AccountFacadeService } from '../../services';
import { Account } from '../../models';
import { getErrorMessage } from '@budget-tracker/shared-utils';

enum FormFields {
  ACCOUNT_NAME = 'accountName',
  ACCOUNT_VALUE = 'accountValue',
  ACCOUNT_ICON = 'AccountIcon',
  ACCOUNT_BG_COLOR = 'accountBgColor',
  ACCOUNT_TEXT_COLOR = 'accountTextColor',
  ACCOUNT_CURRENCY = 'accountCurrency',
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
    [FormFields.ACCOUNT_NAME]: new FormControl(null),
    [FormFields.ACCOUNT_VALUE]: new FormControl(null),
    [FormFields.ACCOUNT_ICON]: new FormControl(null),
    [FormFields.ACCOUNT_BG_COLOR]: new FormControl(null),
    [FormFields.ACCOUNT_TEXT_COLOR]: new FormControl(null),
    [FormFields.ACCOUNT_CURRENCY]: new FormControl(null),
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
    if (this.form.controls[FormFields.ACCOUNT_CURRENCY]?.value?.symbol) {
      return this.form.controls[FormFields.ACCOUNT_CURRENCY]?.value?.symbol;
    }

    return '';
  }

  get isFormValid(): boolean {
    return this.form.valid;
  }

  constructor(
    private readonly accountFacade: AccountFacadeService,
    private readonly destroyRef: DestroyRef,
    private readonly translateService: TranslateService,
    private readonly dialogRef: MatDialogRef<AddAccountModalComponent>,
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
        value: parseInt(this.form.controls[FormFields.ACCOUNT_VALUE].value),
        icon: this.form.controls[FormFields.ACCOUNT_ICON].value,
        name: this.form.controls[FormFields.ACCOUNT_NAME].value,
        bgColor: this.form.controls[FormFields.ACCOUNT_BG_COLOR].value,
        textColor: this.form.controls[FormFields.ACCOUNT_TEXT_COLOR].value,
        currency: this.form.controls[FormFields.ACCOUNT_CURRENCY].value.id as CurrenciesEnum,
        order: 0,
      };

      await this.accountFacade.addAccount(account);

      this.dialogRef.close();
      this.snackbarHandler.showMessageSnackbar('messages.account.accountAdded');
    } catch (error) {
      this.snackbarHandler.showErrorSnackbar(getErrorMessage(error));
    } finally {
      this.loading$.next(false);
    }
  }

  private initListeners(): void {
    this.accountFacade
      .getAllAccounts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((accounts) => (this.accounts = accounts));
  }
}
