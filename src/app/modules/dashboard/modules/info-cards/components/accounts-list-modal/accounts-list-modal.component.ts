import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Account, AccountsFacadeService } from '@budget-tracker/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-accounts-list-modal',
  templateUrl: './accounts-list-modal.component.html',
  styleUrl: './accounts-list-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsListModalComponent implements OnInit {
  accounts$: Observable<Account[]>;

  constructor(
    private accountsFacade: AccountsFacadeService,
    private dialogRef: MatDialogRef<AccountsListModalComponent>
  ) {}

  ngOnInit(): void {
    this.accounts$ = this.accountsFacade.getAllAccounts();
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
