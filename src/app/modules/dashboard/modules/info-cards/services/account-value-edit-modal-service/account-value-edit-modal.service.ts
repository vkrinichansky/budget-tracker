import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountValueEditModalComponent } from '../../components';
import { AccountValueEditModalData } from '../../models';

@Injectable()
export class AccountsValueEditModalService {
  constructor(private dialog: MatDialog) {}

  openEditAccountValueModal(accountId: string) {
    const data: AccountValueEditModalData = {
      accountId,
    };

    this.dialog.open(AccountValueEditModalComponent, { data });
  }
}
