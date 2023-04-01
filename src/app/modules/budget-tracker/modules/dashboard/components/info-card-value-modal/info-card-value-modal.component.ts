import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BudgetTrackerFacadeService } from '@budget-tracker/budget-tracker';
import { injectUnsubscriberService, provideUnsubscriberService } from '@budget-tracker/utils';
import { filter, Observable, takeUntil } from 'rxjs';
import { InfoCardMenuActionsType, InfoCardValueModalData, InfoCardValueToEdit } from '../../models';
import { ColorScheme } from '@budget-tracker/design-system';

@Component({
  selector: 'app-info-card-value-modal',
  templateUrl: './info-card-value-modal.component.html',
  styleUrls: ['./info-card-value-modal.component.scss'],
  providers: [provideUnsubscriberService()],
})
export class InfoCardValueModalComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.infoCardValueModal';
  private readonly destroy$ = injectUnsubscriberService();

  readonly colorScheme = ColorScheme;

  title: string;

  mainButtonText: string;

  initialValue: number;

  input: FormControl;

  loading$: Observable<boolean>;

  success$: Observable<boolean>;

  get shouldDisableButton(): boolean {
    return this.input?.invalid || parseInt(this.input?.value) === this.initialValue;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: InfoCardValueModalData,
    private dialogRef: MatDialogRef<InfoCardValueModalComponent>,
    private budgetTrackerFacade: BudgetTrackerFacadeService
  ) {}

  ngOnInit(): void {
    this.title = this.buildTranslationKey(`${this.data.valueToEdit}.title`);
    this.mainButtonText = this.buildTranslationKey(`${this.data.valueToEdit}.${this.data.actionType}`);
    this.initialValue = this.data.initialValue;

    this.input = new FormControl(this.initialValue, [Validators.required, Validators.min(1)]);

    this.loading$ = this.budgetTrackerFacade.getValueUpdatingInProgress();

    this.success$ = this.budgetTrackerFacade.getValueUpdatingSuccess();

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
    const inputValue = parseInt(this.input.value);

    switch (this.data.valueToEdit) {
      case InfoCardValueToEdit.Balance:
        switch (this.data.actionType) {
          case InfoCardMenuActionsType.Increase:
            this.budgetTrackerFacade.increaseBalance(inputValue);
            break;

          case InfoCardMenuActionsType.Decrease:
            this.budgetTrackerFacade.decreaseBalance(inputValue);
            break;

          case InfoCardMenuActionsType.Edit:
            this.budgetTrackerFacade.editBalance(inputValue);
            break;
        }
        break;

      case InfoCardValueToEdit.Savings:
        switch (this.data.actionType) {
          case InfoCardMenuActionsType.Increase:
            this.budgetTrackerFacade.increaseSavings(inputValue);
            break;

          case InfoCardMenuActionsType.Decrease:
            this.budgetTrackerFacade.decreaseSavings(inputValue);
            break;

          case InfoCardMenuActionsType.Edit:
            this.budgetTrackerFacade.editSavings(inputValue);
            break;
        }
        break;

      case InfoCardValueToEdit.FreeMoney:
        switch (this.data.actionType) {
          case InfoCardMenuActionsType.Increase:
            this.budgetTrackerFacade.increaseFreeMoney(inputValue);
            break;

          case InfoCardMenuActionsType.Decrease:
            this.budgetTrackerFacade.decreaseFreeMoney(inputValue);
            break;

          case InfoCardMenuActionsType.Edit:
            this.budgetTrackerFacade.editFreeMoney(inputValue);
            break;
        }
        break;
    }
  }
}
