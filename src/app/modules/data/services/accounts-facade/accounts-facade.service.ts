import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import {
  Account,
  AccountManagementRecord,
  AccountValueEditRecord,
  ActivityLogRecordType,
  EntityManagementActionType,
} from '../../models';
import { Store } from '@ngrx/store';
import { AccountsActions, AccountsSelectors } from '../../store';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AccountsFacadeService {
  constructor(private store: Store) {}

  getAllAccounts(): Observable<Account[]> {
    return this.store.select(AccountsSelectors.allAccountsSelector);
  }

  getAccountById(accountId: string): Observable<Account> {
    return this.store.select(AccountsSelectors.accountByIdSelector(accountId));
  }

  getFullBallance(): Observable<number> {
    return this.getAllAccounts().pipe(
      map((accounts) => accounts.reduce((fullBalance, account) => fullBalance + account.value, 0))
    );
  }

  getAccountsAmount(): Observable<number> {
    return this.getAllAccounts().pipe(map((accounts) => accounts.length));
  }

  getAccountsExist(): Observable<boolean> {
    return this.getAccountsAmount().pipe(map((amount) => !!amount));
  }

  async editAccountValue(accountId: string, newValue: number, note: string): Promise<void> {
    const account = await firstValueFrom(this.getAccountById(accountId));

    const activityLogRecord: AccountValueEditRecord = {
      id: uuid(),
      accountId,
      accountName: account.name,
      date: new Date().getTime(),
      icon: account.icon,
      oldValue: account.value,
      newValue,
      note,
      recordType: ActivityLogRecordType.AccountValueEdit,
    };

    this.store.dispatch(AccountsActions.editAccountValue({ accountId, newValue, activityLogRecord }));
  }

  getEditAccountValueInProgress(): Observable<boolean> {
    return this.store.select(AccountsSelectors.editAccountValueInProgressSelector);
  }

  getEditAccountValueSucceed(): Observable<boolean> {
    return this.store.select(AccountsSelectors.editAccountValueSucceedSelector);
  }

  addAccount(account: Account): void {
    const addAccountRecord: AccountManagementRecord = {
      id: uuid(),
      actionType: EntityManagementActionType.Add,
      accountName: account.name,
      date: new Date().getTime(),
      icon: account.icon,
      recordType: ActivityLogRecordType.AccountManagement,
    };

    this.store.dispatch(AccountsActions.addAccount({ account, activityLogRecord: addAccountRecord }));
  }

  getAccountManagementInProgress(): Observable<boolean> {
    return this.store.select(AccountsSelectors.accountManagementInProgressSelector);
  }

  getAccountManagementSuccess(): Observable<boolean> {
    return this.store.select(AccountsSelectors.accountManagementSuccessSelector);
  }
}
