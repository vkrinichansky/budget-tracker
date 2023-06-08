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

    this.dialog.open(InfoCardValueModalComponent, { data, disableClose: true });
  }

  openDecreaseBalanceModal(initialValue: number) {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Decrease,
      valueToEdit: InfoCardValueToEdit.Balance,
      initialValue,
    };

    this.dialog.open(InfoCardValueModalComponent, { data, disableClose: true });
  }

  openEditBalanceModal(initialValue: number) {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Edit,
      valueToEdit: InfoCardValueToEdit.Balance,
      initialValue,
      shouldDisplayInitialValue: true,
    };

    this.dialog.open(InfoCardValueModalComponent, { data, disableClose: true });
  }

  openIncreaseSavingsModal(initialValue: number) {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Increase,
      valueToEdit: InfoCardValueToEdit.Savings,
      initialValue,
    };

    this.dialog.open(InfoCardValueModalComponent, { data, disableClose: true });
  }

  openDecreaseSavingsModal(initialValue: number) {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Decrease,
      valueToEdit: InfoCardValueToEdit.Savings,
      initialValue,
    };

    this.dialog.open(InfoCardValueModalComponent, { data, disableClose: true });
  }

  openEditSavingsModal(initialValue: number) {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Edit,
      valueToEdit: InfoCardValueToEdit.Savings,
      initialValue,
      shouldDisplayInitialValue: true,
    };

    this.dialog.open(InfoCardValueModalComponent, { data, disableClose: true });
  }

  openIncreaseFreeMoneyModal(initialValue: number) {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Increase,
      valueToEdit: InfoCardValueToEdit.FreeMoney,
      initialValue,
    };

    this.dialog.open(InfoCardValueModalComponent, { data, disableClose: true });
  }

  openDecreaseFreeMoneyModal(initialValue: number) {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Decrease,
      valueToEdit: InfoCardValueToEdit.FreeMoney,
      initialValue,
    };

    this.dialog.open(InfoCardValueModalComponent, { data, disableClose: true });
  }

  openEditFreeMoneyModal(initialValue: number) {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Edit,
      valueToEdit: InfoCardValueToEdit.FreeMoney,
      initialValue,
      shouldDisplayInitialValue: true,
    };

    this.dialog.open(InfoCardValueModalComponent, { data, disableClose: true });
  }
}
