import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InfoCardValueModalComponent } from '../../components';
import { InfoCardMenuActionsType, InfoCardValueModalData, InfoCardValueToEdit } from '../../models';

@Injectable()
export class InfoCardValueModalService {
  constructor(private dialog: MatDialog) {}

  openIncreaseBalanceModal(initialValue: number) {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Increase,
      valueToEdit: InfoCardValueToEdit.Balance,
      initialValue,
    };

    this.dialog.open(InfoCardValueModalComponent, { data });
  }

  openDecreaseBalanceModal(initialValue: number) {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Decrease,
      valueToEdit: InfoCardValueToEdit.Balance,
      initialValue,
    };

    this.dialog.open(InfoCardValueModalComponent, { data });
  }

  openEditBalanceModal(initialValue: number) {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Edit,
      valueToEdit: InfoCardValueToEdit.Balance,
      initialValue,
      shouldDisplayInitialValue: true,
    };

    this.dialog.open(InfoCardValueModalComponent, { data });
  }

  openIncreaseSavingsModal(initialValue: number) {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Increase,
      valueToEdit: InfoCardValueToEdit.Savings,
      initialValue,
    };

    this.dialog.open(InfoCardValueModalComponent, { data });
  }

  openDecreaseSavingsModal(initialValue: number) {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Decrease,
      valueToEdit: InfoCardValueToEdit.Savings,
      initialValue,
    };

    this.dialog.open(InfoCardValueModalComponent, { data });
  }

  openEditSavingsModal(initialValue: number) {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Edit,
      valueToEdit: InfoCardValueToEdit.Savings,
      initialValue,
      shouldDisplayInitialValue: true,
    };

    this.dialog.open(InfoCardValueModalComponent, { data });
  }

  openIncreaseFreeMoneyModal(initialValue: number) {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Increase,
      valueToEdit: InfoCardValueToEdit.FreeMoney,
      initialValue,
    };

    this.dialog.open(InfoCardValueModalComponent, { data });
  }

  openDecreaseFreeMoneyModal(initialValue: number) {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Decrease,
      valueToEdit: InfoCardValueToEdit.FreeMoney,
      initialValue,
    };

    this.dialog.open(InfoCardValueModalComponent, { data });
  }

  openEditFreeMoneyModal(initialValue: number) {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Edit,
      valueToEdit: InfoCardValueToEdit.FreeMoney,
      initialValue,
      shouldDisplayInitialValue: true,
    };

    this.dialog.open(InfoCardValueModalComponent, { data });
  }
}
