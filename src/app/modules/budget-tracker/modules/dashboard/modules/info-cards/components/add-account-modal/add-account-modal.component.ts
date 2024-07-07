import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Account, AccountsFacadeService } from '@budget-tracker/data';
import { combineLatest, map, filter, tap, Observable } from 'rxjs';

enum FormFields {
  AccountIcon = 'AccountIcon',
  AccountName = 'accountName',
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
  readonly formFields = FormFields;

  readonly form: FormGroup = new FormGroup({
    [FormFields.AccountIcon]: new FormControl(null, [Validators.required]),
    [FormFields.AccountName]: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    [FormFields.AccountBgColor]: new FormControl('', [Validators.required]),
    [FormFields.AccountTextColor]: new FormControl('', [Validators.required]),
    [FormFields.AccountCurrency]: new FormControl('', [Validators.required]),
  });

  accounts$: Observable<Account[]>;

  get hasAccountNameRequiredError(): boolean {
    return this.form.controls[FormFields.AccountName].hasError('required');
  }

  get hasMaxLengthError(): boolean {
    return this.form.controls[FormFields.AccountName].hasError('maxlength');
  }

  get hasAccountExistsError(): boolean {
    return this.form.controls[FormFields.AccountName].hasError('accountExists');
  }

  constructor(
    private accountsFacade: AccountsFacadeService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.accounts$ = this.accountsFacade.getAllAccounts();

    this.subscribeToCategoryNameChanges();
  }

  buildTranslationKey(key: string): string {
    return `dashboard.addAccountModal.${key}`;
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
