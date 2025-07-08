import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../../models';
import { AccountServiceService } from '../account-service/account-service.service';

@Injectable()
export class AccountsFacadeService {
  constructor(private accountService: AccountServiceService) {}

  loadAccounts(): Promise<void> {
    return this.accountService.loadAccounts();
  }

  getAllAccounts(): Observable<Account[]> {
    return this.accountService.getAllAccounts();
  }

  getAccountById(accountId: string): Observable<Account> {
    return this.accountService.getAccountById(accountId);
  }

  getFullBallance(): Observable<number> {
    return this.accountService.getFullBallance();
  }

  getAccountsAmount(): Observable<number> {
    return this.accountService.getAccountsAmount();
  }

  getAccountsExist(): Observable<boolean> {
    return this.accountService.getAccountsExist();
  }

  moveMoneyBetweenAccount(
    fromAccountId: string,
    toAccountId: string,
    valueToMove: number,
    convertedValueToMove: number
  ): Promise<void> {
    return this.accountService.moveMoneyBetweenAccount(
      fromAccountId,
      toAccountId,
      valueToMove,
      convertedValueToMove
    );
  }

  addAccount(account: Account): Promise<void> {
    return this.accountService.addAccount(account);
  }

  removeAccount(accountId: string): Promise<void> {
    return this.accountService.removeAccount(accountId);
  }

  bulkAccountChangeOrder(updatedAccountsOrder: Record<string, number>): void {
    this.accountService.bulkAccountChangeOrder(updatedAccountsOrder);
  }
}
