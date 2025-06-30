import { Injectable } from '@angular/core';
import {
  AccountsListModalComponent,
  AddAccountModalComponent,
  MoveMoneyBetweenAccountsModalComponent,
} from '../../components';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class AccountsModalsService {
  constructor(private readonly dialog: MatDialog) {}

  openAccountsListModal() {
    this.dialog.open(AccountsListModalComponent);
  }

  openAddAccountsModal() {
    this.dialog.open(AddAccountModalComponent);
  }

  openMoneyMovementModal() {
    this.dialog.open(MoveMoneyBetweenAccountsModalComponent);
  }
}
