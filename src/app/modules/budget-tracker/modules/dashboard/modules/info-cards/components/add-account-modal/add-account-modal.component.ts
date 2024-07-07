import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Account, AccountsFacadeService } from '@budget-tracker/data';
import { Currency, predefinedCurrenciesDictionary } from '@budget-tracker/utils';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, map, filter, tap, Observable, take } from 'rxjs';
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
  styleUrl: './add-account-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAccountModalComponent implements OnInit {
  private accounts$: Observable<Account[]>;

  readonly formFields = FormFields;

  readonly form: FormGroup = new FormGroup({
    [FormFields.AccountName]: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    [FormFields.AccountValue]: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.pattern(new RegExp(/^[0-9]+$/)),
    ]),
    [FormFields.AccountIcon]: new FormControl(null, [Validators.required]),
    [FormFields.AccountBgColor]: new FormControl('', [Validators.required]),
    [FormFields.AccountTextColor]: new FormControl('', [Validators.required]),
    [FormFields.AccountCurrency]: new FormControl('', [Validators.required]),
  });

  readonly options: Currency[] = Object.values(predefinedCurrenciesDictionary);

  readonly idSelector = (currency: Currency) => currency.id;
  readonly iconSelector = (currency: Currency) => currency.icon;

  readonly displayValueSelector = (currency: Currency) =>
    `${this.translateService.instant(`currencies.${currency.id}`)} `;

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

  get hasAccountNameRequiredError(): boolean {
    return this.form.controls[FormFields.AccountName].hasError('required');
  }

  get hasMaxLengthError(): boolean {
    return this.form.controls[FormFields.AccountName].hasError('maxlength');
  }

  get hasAccountExistsError(): boolean {
    return this.form.controls[FormFields.AccountName].hasError('accountExists');
  }

  get hasRequiredError(): boolean {
    return this.form.controls[FormFields.AccountValue].hasError('required');
  }

  get hasMinValueError(): boolean {
    return this.form.controls[FormFields.AccountValue].hasError('min');
  }

  get hasNumberPatternError(): boolean {
    return this.form.controls[FormFields.AccountValue].hasError('pattern');
  }

  constructor(
    private accountsFacade: AccountsFacadeService,
    private destroyRef: DestroyRef,
    private translateService: TranslateService,
    private dialogRef: MatDialogRef<AddAccountModalComponent>
  ) {}

  ngOnInit(): void {
    this.accounts$ = this.accountsFacade.getAllAccounts();

    this.subscribeToCategoryNameChanges();
    this.initListeners();
  }

  buildTranslationKey(key: string): string {
    return `dashboard.addAccountModal.${key}`;
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
  }

  private subscribeToCategoryNameChanges(): void {
    combineLatest([this.accounts$, this.form.controls[FormFields.AccountName].valueChanges])
      .pipe(
        map(([accounts, accountName]) =>
          accounts.map((account) => account.name.toLowerCase()).includes(accountName.toLowerCase().trim())
        ),
        filter((shouldDisable) => !!shouldDisable),
        tap(() => this.form.controls[FormFields.AccountName].setErrors({ accountExists: true })),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
