import { Injectable } from '@angular/core';
import {
  AccountsListModalComponent,
  AddAccountModalComponent,
  MoveMoneyBetweenAccountsModalComponent,
  EditAccountValueModalComponent,
} from '../../components';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class AccountModalService {
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

  openEditAccountValueModal(accountId: string) {
    this.dialog.open(EditAccountValueModalComponent, { data: { accountId } });
  }
}
