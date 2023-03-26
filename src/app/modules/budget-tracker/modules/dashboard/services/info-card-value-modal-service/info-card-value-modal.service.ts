import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InfoCardValueModalComponent } from '../../components';
import { InfoCardMenuActionsType, InfoCardValueModalData, InfoCardValueToEdit } from '../../models';
@Injectable({
  providedIn: 'root',
})
export class InfoCardValueModalService {
  constructor(private dialog: MatDialog) {}

  openIncreaseBalanceModal() {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Increase,
      valueToEdit: InfoCardValueToEdit.Balance,
      initialValue: 0,
    };

    this.dialog.open(InfoCardValueModalComponent, { data, disableClose: true });
  }

  openDecreaseBalanceModal() {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Decrease,
      valueToEdit: InfoCardValueToEdit.Balance,
      initialValue: 0,
    };

    this.dialog.open(InfoCardValueModalComponent, { data, disableClose: true });
  }

  openEditBalanceModal(balanceValue: number) {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Edit,
      valueToEdit: InfoCardValueToEdit.Balance,
      initialValue: balanceValue,
    };

    this.dialog.open(InfoCardValueModalComponent, { data, disableClose: true });
  }

  openIncreaseSavingsModal() {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Increase,
      valueToEdit: InfoCardValueToEdit.Savings,
      initialValue: 0,
    };

    this.dialog.open(InfoCardValueModalComponent, { data, disableClose: true });
  }

  openDecreaseSavingsModal() {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Decrease,
      valueToEdit: InfoCardValueToEdit.Savings,
      initialValue: 0,
    };

    this.dialog.open(InfoCardValueModalComponent, { data, disableClose: true });
  }

  openEditSavingsModal(savingsValue: number) {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Edit,
      valueToEdit: InfoCardValueToEdit.Savings,
      initialValue: savingsValue,
    };

    this.dialog.open(InfoCardValueModalComponent, { data, disableClose: true });
  }

  openIncreaseFreeMoneyModal() {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Increase,
      valueToEdit: InfoCardValueToEdit.FreeMoney,
      initialValue: 0,
    };

    this.dialog.open(InfoCardValueModalComponent, { data, disableClose: true });
  }

  openDecreaseFreeMoneyModal() {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Decrease,
      valueToEdit: InfoCardValueToEdit.FreeMoney,
      initialValue: 0,
    };

    this.dialog.open(InfoCardValueModalComponent, { data, disableClose: true });
  }

  openEditFreeMoneyModal(freeMoneyValue: number) {
    const data: InfoCardValueModalData = {
      actionType: InfoCardMenuActionsType.Edit,
      valueToEdit: InfoCardValueToEdit.FreeMoney,
      initialValue: freeMoneyValue,
    };

    this.dialog.open(InfoCardValueModalComponent, { data, disableClose: true });
  }
}
