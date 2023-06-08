import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { injectUnsubscriberService, provideUnsubscriberService } from '@budget-tracker/utils';
import { filter, Observable, takeUntil } from 'rxjs';
import { InfoCardMenuActionsType, InfoCardValueModalData, InfoCardValueToEdit } from '../../models';
import { RootValuesFacadeService } from '../../services';

@Component({
  selector: 'app-info-card-value-modal',
  templateUrl: './info-card-value-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideUnsubscriberService()],
})
export class InfoCardValueModalComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.infoCardValueModal';
  private readonly destroy$ = injectUnsubscriberService();

  title: string;

  mainButtonText: string;

  initialValue: number;

  shouldDisplayInitialValue: boolean;

  valueInput: FormControl;

  noteInput: FormControl;

  loading$: Observable<boolean>;

  success$: Observable<boolean>;

  get shouldDisableButton(): boolean {
    return (
      this.valueInput?.invalid ||
      this.noteInput?.invalid ||
      (this.data.actionType === InfoCardMenuActionsType.Edit &&
        parseInt(this.valueInput?.value) === this.initialValue) ||
      (this.data.actionType === InfoCardMenuActionsType.Decrease &&
        parseInt(this.valueInput?.value) > this.initialValue)
    );
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: InfoCardValueModalData,
    private dialogRef: MatDialogRef<InfoCardValueModalComponent>,
    private rootValuesFacade: RootValuesFacadeService
  ) {}

  ngOnInit(): void {
    this.title = this.buildTranslationKey(`${this.data.valueToEdit}.title`);
    this.mainButtonText = this.buildTranslationKey(`${this.data.valueToEdit}.${this.data.actionType}`);
    this.initialValue = this.data.initialValue;
    this.shouldDisplayInitialValue = !!this.data.shouldDisplayInitialValue;

    this.valueInput = new FormControl(this.shouldDisplayInitialValue ? this.initialValue : 0, [
      Validators.required,
      Validators.min(this.shouldDisplayInitialValue ? 0 : 1),
    ]);

    this.noteInput = new FormControl('', [Validators.maxLength(100)]);

    this.loading$ = this.rootValuesFacade.getValueUpdatingInProgress();

    this.success$ = this.rootValuesFacade.getValueUpdatingSuccess();

    this.success$
      .pipe(
        takeUntil(this.destroy$),
        filter((isSuccess) => !!isSuccess)
      )
      .subscribe(() => this.dialogRef.close());
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  cancelClick(): void {
    this.dialogRef.close();
  }

  resolveSubmitAction(): void {
    const inputValue = parseInt(this.valueInput.value);
    const note = this.noteInput?.value;

    switch (this.data.valueToEdit) {
      case InfoCardValueToEdit.Balance:
        switch (this.data.actionType) {
          case InfoCardMenuActionsType.Increase:
            this.rootValuesFacade.increaseBalance(inputValue, note);
            break;

          case InfoCardMenuActionsType.Decrease:
            this.rootValuesFacade.decreaseBalance(inputValue, note);
            break;

          case InfoCardMenuActionsType.Edit:
            this.rootValuesFacade.editBalance(inputValue, note);
            break;
        }
        break;

      case InfoCardValueToEdit.Savings:
        switch (this.data.actionType) {
          case InfoCardMenuActionsType.Increase:
            this.rootValuesFacade.increaseSavings(inputValue, note);
            break;

          case InfoCardMenuActionsType.Decrease:
            this.rootValuesFacade.decreaseSavings(inputValue, note);
            break;

          case InfoCardMenuActionsType.Edit:
            this.rootValuesFacade.editSavings(inputValue, note);
            break;
        }
        break;

      case InfoCardValueToEdit.FreeMoney:
        switch (this.data.actionType) {
          case InfoCardMenuActionsType.Increase:
            this.rootValuesFacade.increaseFreeMoney(inputValue, note);
            break;

          case InfoCardMenuActionsType.Decrease:
            this.rootValuesFacade.decreaseFreeMoney(inputValue, note);
            break;

          case InfoCardMenuActionsType.Edit:
            this.rootValuesFacade.editFreeMoney(inputValue, note);
            break;
        }
        break;
    }
  }
}
