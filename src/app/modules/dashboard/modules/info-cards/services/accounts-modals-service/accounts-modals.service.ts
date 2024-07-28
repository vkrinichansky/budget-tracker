import { Injectable } from '@angular/core';
import { MoveMoneyBetweenAccountsModalComponent } from '../../components';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class AccountsModalsService {
  constructor(private dialog: MatDialog) {}

  openMoneyMovementModal() {
    this.dialog.open(MoveMoneyBetweenAccountsModalComponent);
  }
}
