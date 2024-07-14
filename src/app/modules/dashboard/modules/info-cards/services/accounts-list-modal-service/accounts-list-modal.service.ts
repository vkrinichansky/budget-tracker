import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountsListModalComponent } from '../../components';
import { isMobileWidth } from '@budget-tracker/utils';

@Injectable()
export class AccountsListModalService {
  constructor(private dialog: MatDialog) {}

  openAccountsListModal() {
    this.dialog.open(AccountsListModalComponent, {
      maxWidth: isMobileWidth() ? '100%' : '400px',
      maxHeight: isMobileWidth() ? '100%' : '90vh',
      position: isMobileWidth() ? { top: '0' } : { top: '30px' },
      panelClass: 'accounts-list-modal',
    });
  }
}
