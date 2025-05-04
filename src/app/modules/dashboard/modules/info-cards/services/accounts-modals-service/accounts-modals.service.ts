import { Injectable } from '@angular/core';
import {
  AccountsListModalComponent,
  AccountValueEditModalComponent,
  AddAccountModalComponent,
  MoveMoneyBetweenAccountsModalComponent,
} from '../../components';
import { MatDialog } from '@angular/material/dialog';
import { AccountValueEditModalData } from '../../models';

@Injectable()
export class AccountsModalsService {
  constructor(private readonly dialog: MatDialog) {}

  openEditAccountValueModal(accountId: string) {
    const data: AccountValueEditModalData = {
      accountId,
    };

    this.dialog.open(AccountValueEditModalComponent, { data });
  }

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
