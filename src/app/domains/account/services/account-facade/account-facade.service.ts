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

  addAccount(account: Account): Promise<void> {
    return this.accountService.addAccount(account);
  }

  removeAccount(accountId: string): Promise<void> {
    return this.accountService.removeAccount(accountId);
  }

  async bulkAccountChangeOrder(updatedAccountsOrder: Record<string, number>): Promise<void> {
    return this.accountService.bulkAccountChangeOrder(updatedAccountsOrder);
  }

  updateAccounts(updatedAccounts: Account[]): void {
    this.accountService.updateAccounts(updatedAccounts);
  }

  // ===== FLOW TRIGGERS =====
  async runMoveMoneyBetweenAccountsFlow(
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

  async runEditAccountValueFlow(accountId: string, value: number, note: string): Promise<void> {
    return this.accountService.editAccountValue(accountId, value, note);
  }

  // ===== UTILS =====
  getAccountDocRef(): DocumentReference {
    return this.accountApiService.getDocRef();
  }
}
