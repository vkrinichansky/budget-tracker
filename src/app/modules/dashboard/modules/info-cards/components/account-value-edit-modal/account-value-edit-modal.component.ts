import { Component, Inject, OnInit, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';
import { AccountValueEditModalData } from '../../models';
import { AccountsFacadeService } from '../../../../services';
import { Account } from '@budget-tracker/models';
import { SnackbarHandlerService } from '@budget-tracker/design-system';
import { ActionListenerService } from '@budget-tracker/utils';
import { CategoriesActions } from '../../../../store';

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
  readonly loading$ = new BehaviorSubject<boolean>(false);

  readonly form = new FormGroup({
    [FormFields.Value]: new FormControl(null),
    [FormFields.Note]: new FormControl(null),
  });

  initialValue: number;

  account$: Observable<Account>;

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
    @Inject(MAT_DIALOG_DATA) private readonly data: AccountValueEditModalData,
    private readonly dialogRef: MatDialogRef<AccountValueEditModalComponent>,
    private readonly accountsFacade: AccountsFacadeService,
    private readonly actionListener: ActionListenerService,
    private readonly snackbarHandler: SnackbarHandlerService
  ) {}

  ngOnInit(): void {
    this.initListeners();
  }

  async ngAfterViewInit(): Promise<void> {
    this.initialValue = await firstValueFrom(this.account$.pipe(map((account) => account.value)));
    this.form.controls[FormFields.Value].setValue(this.initialValue, { emitEvent: false });
  }

  async submitAction(): Promise<void> {
    this.loading$.next(true);

    try {
      const inputValue = parseInt(this.form.controls[FormFields.Value].value);
      const note = this.form.controls[FormFields.Note]?.value;

      this.accountsFacade.editAccountValue(this.accountId, inputValue, note);

      await this.actionListener.waitForResult(
        CategoriesActions.categoryValueChanged,
        CategoriesActions.changeCategoryValueFail
      );

      this.dialogRef.close();
      this.snackbarHandler.showAccountValueEditedSnackbar();
    } catch {
      this.snackbarHandler.showGeneralErrorSnackbar();
    } finally {
      this.loading$.next(false);
    }
  }

  private initListeners(): void {
    this.account$ = this.accountsFacade.getAccountById(this.accountId);
  }
}
