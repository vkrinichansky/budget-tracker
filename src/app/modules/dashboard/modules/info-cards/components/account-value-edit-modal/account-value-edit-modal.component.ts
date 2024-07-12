import {
  Component,
  Inject,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  DestroyRef,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter, firstValueFrom, map, Observable, take, tap } from 'rxjs';
import { AccountValueEditModalData } from '../../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Account, AccountsFacadeService } from '@budget-tracker/data';

enum FormFields {
  Value = 'value',
  Note = 'note',
}

@Component({
  selector: 'app-account-value-edit-modal',
  templateUrl: './account-value-edit-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountValueEditModalComponent implements OnInit, AfterViewInit {
  readonly formFields = FormFields;

  form: FormGroup;
  initialValue: number;

  account$: Observable<Account>;
  loading$: Observable<boolean>;
  success$: Observable<boolean>;

  get accountId(): string {
    return this.data.accountId;
  }

  get isFormValid(): boolean {
    return this.form?.valid;
  }

  get hasRequiredError(): boolean {
    return this.form.controls[FormFields.Value].hasError('required');
  }

  get hasMinValueError(): boolean {
    return this.form.controls[FormFields.Value].hasError('min');
  }

  get hasEditError(): boolean {
    return this.form.controls[FormFields.Value].hasError('editError');
  }

  get hasMaxLengthError(): boolean {
    return this.form.controls[FormFields.Note].hasError('maxlength');
  }

  get hasNumberPatternError(): boolean {
    return this.form.controls[FormFields.Value].hasError('pattern');
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: AccountValueEditModalData,
    private dialogRef: MatDialogRef<AccountValueEditModalComponent>,
    private cd: ChangeDetectorRef,
    private destroyRef: DestroyRef,
    private accountsFacade: AccountsFacadeService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initListeners();
  }

  async ngAfterViewInit(): Promise<void> {
    this.initialValue = await firstValueFrom(this.account$.pipe(map((account) => account.value)));

    this.form.controls[FormFields.Value].setValue(this.initialValue);
    this.cd.detectChanges();

    this.initFormListener();
  }

  buildTranslationKey(key: string): string {
    return `dashboard.accountValueEditModal.${key}`;
  }

  submitAction(): void {
    const inputValue = parseInt(this.form.controls[FormFields.Value].value);
    const note = this.form.controls[FormFields.Note]?.value;

    this.accountsFacade.editAccountValue(this.accountId, inputValue, note);
  }

  private initListeners(): void {
    this.account$ = this.accountsFacade.getAccountById(this.accountId);
    this.loading$ = this.accountsFacade.getEditAccountValueInProgress();
    this.success$ = this.accountsFacade.getEditAccountValueSucceed();

    this.success$
      .pipe(
        filter((isSuccess) => !!isSuccess),
        take(1)
      )
      .subscribe(() => this.dialogRef.close());
  }

  private initForm(): void {
    this.form = new FormGroup({
      [FormFields.Value]: new FormControl(null, [
        Validators.required,
        Validators.min(0),
        Validators.pattern(new RegExp(/^[0-9]+$/)),
      ]),
      [FormFields.Note]: new FormControl('', [Validators.maxLength(100)]),
    });
  }

  private initFormListener(): void {
    this.form.controls[FormFields.Value].valueChanges
      .pipe(
        filter((value) => parseInt(value) === this.initialValue),
        tap(() => {
          this.form.controls[FormFields.Value].setErrors({ editError: true });
          this.form.controls[FormFields.Value].markAsDirty();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
