import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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

  constructor(private accountsFacade: AccountsFacadeService) {}

  ngOnInit(): void {
    this.accounts$ = this.accountsFacade.getAllAccounts();
  }

  buildTranslationKey(key: string): string {
    return `dashboard.accountsListModal.${key}`;
  }
}
