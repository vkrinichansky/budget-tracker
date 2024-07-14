import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddAccountModalComponent } from '../../components';

@Injectable()
export class AddAccountModalService {
  constructor(private dialog: MatDialog) {}

  openAccountsListModal() {
    this.dialog.open(AddAccountModalComponent);
  }
}
