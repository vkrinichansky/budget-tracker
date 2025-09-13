import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../../models';
import { AccountService } from '../account-service/account.service';
import { DocumentReference } from '@angular/fire/firestore';
import { AccountApiService } from '../account-api-service/account-api.service';

@Injectable()
export class AccountFacadeService {
  constructor(
    private accountService: AccountService,
    private accountApiService: AccountApiService
  ) {}

  // ===== SELECTORS =====
  accountsLoaded(): Observable<boolean> {
    return this.accountService.accountsLoaded();
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

  // ===== ACTIONS =====
  loadAccounts(): void {
    this.accountService.loadAccounts();
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

  async bulkAccountChangeOrder(updatedAccountsOrder: Record<string, number>): Promise<void> {
    return this.accountService.bulkAccountChangeOrder(updatedAccountsOrder);
  }

  changeAccountValue(updatedAccount: Account): void {
    this.accountService.changeAccountValue(updatedAccount);
  }

  // ===== FLOW TRIGGERS =====
  runMoveMoneyBetweenAccountsFlow(
    fromAccountId: string,
    toAccountId: string,
    valueToMove: number,
    convertedValueToMove: number
  ): Promise<void> {
    return this.accountService.runMoveMoneyBetweenAccountsFlow(
      fromAccountId,
      toAccountId,
      valueToMove,
      convertedValueToMove
    );
  }

  // ===== UTILS =====
  getAccountDocRef(): DocumentReference {
    return this.accountApiService.getDocRef();
  }
}
