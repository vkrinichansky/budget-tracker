import { Component, Inject, OnInit, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter, firstValueFrom, map, Observable, take } from 'rxjs';
import { AccountValueEditModalData } from '../../models';
import { AccountsFacadeService } from '../../../../services';
import { Account } from '@budget-tracker/models';

enum FormFields {
  Value = 'value',
  Note = 'note',
}

@Component({
  selector: 'app-account-value-edit-modal',
  templateUrl: './account-value-edit-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AccountValueEditModalComponent implements OnInit, AfterViewInit {
  readonly formFields = FormFields;

  readonly form = new FormGroup({
    [FormFields.Value]: new FormControl(null),
    [FormFields.Note]: new FormControl(null),
  });

  initialValue: number;

  account$: Observable<Account>;
  loading$: Observable<boolean>;
  success$: Observable<boolean>;

  get accountId(): string {
    return this.data.accountId;
  }

  get isSubmitButtonDisabled(): boolean {
    return (
      this.form?.invalid ||
      this.initialValue === parseInt(this.form.controls[this.formFields.Value].value)
    );
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: AccountValueEditModalData,
    private dialogRef: MatDialogRef<AccountValueEditModalComponent>,
    private accountsFacade: AccountsFacadeService
  ) {}

  ngOnInit(): void {
    this.initListeners();
  }

  async ngAfterViewInit(): Promise<void> {
    this.initialValue = await firstValueFrom(this.account$.pipe(map((account) => account.value)));
    this.form.controls[FormFields.Value].setValue(this.initialValue, { emitEvent: false });
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
}
