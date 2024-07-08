import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountsListModalComponent } from '../../components';

@Injectable()
export class AccountsListModalService {
  constructor(private dialog: MatDialog) {}

  openAccountsListModal() {
    this.dialog.open(AccountsListModalComponent);
  }
}
