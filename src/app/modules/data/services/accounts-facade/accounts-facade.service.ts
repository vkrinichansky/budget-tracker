import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import {
  Account,
  AccountValueEditRecord,
  ActivityLogRecordType,
  MoveMoneyBetweenAccountsRecord,
} from '../../models';
import { Store } from '@ngrx/store';
import { AccountsActions, AccountsSelectors } from '../../store';
import { v4 as uuid } from 'uuid';
import { CurrencyService } from '../currency-service/currency.service';
import { CurrencyExchangeService } from '../currency-exchange-service/currency-exchange.service';

@Injectable()
export class AccountsFacadeService {
  constructor(
    private store: Store,
    private currencyService: CurrencyService,
    private currencyExchangeService: CurrencyExchangeService
  ) {}

  getAllAccounts(): Observable<Account[]> {
    return this.store.select(AccountsSelectors.allAccountsSelector);
  }

  getAccountById(accountId: string): Observable<Account> {
    return this.store.select(AccountsSelectors.accountByIdSelector(accountId));
  }

  getFullBallance(): Observable<number> {
    return this.store.select(
      AccountsSelectors.fullBalanceSelector(
        this.currencyService.getCurrentCurrency(),
        this.currencyExchangeService.getCurrentExchangeRate()
      )
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
      account,
      date: new Date().getTime(),
      icon: account.icon,
      oldValue: account.value,
      newValue,
      note,
      recordType: ActivityLogRecordType.AccountValueEdit,
    };

    this.store.dispatch(
      AccountsActions.editAccountValue({
        accountId,
        newValue,
        activityLogRecord,
      })
    );
  }

  async moveMoneyBetweenAccount(
    fromAccountId: string,
    toAccountId: string,
    valueToMove: number,
    convertedValueToMove: number
  ): Promise<void> {
    const fromAccount = await firstValueFrom(this.getAccountById(fromAccountId));
    const toAccount = await firstValueFrom(this.getAccountById(toAccountId));

    const fromAccountNewValue = fromAccount.value - valueToMove;
    const toAccountNewValue = toAccount.value + convertedValueToMove;

    const activityLogRecord: MoveMoneyBetweenAccountsRecord = {
      id: uuid(),
      fromAccount,
      toAccount,
      fromAccountValue: valueToMove,
      toAccountValue: convertedValueToMove,
      recordType: ActivityLogRecordType.MoveMoneyBetweenAccounts,
      date: new Date().getTime(),
      icon: 'money-change',
    };

    this.store.dispatch(
      AccountsActions.moveMoneyBetweenAccounts({
        fromAccountId,
        toAccountId,
        fromAccountNewValue,
        toAccountNewValue,
        activityLogRecord,
      })
    );
  }

  getEditAccountValueInProgress(): Observable<boolean> {
    return this.store.select(AccountsSelectors.editAccountValueInProgressSelector);
  }

  getEditAccountValueSucceed(): Observable<boolean> {
    return this.store.select(AccountsSelectors.editAccountValueSucceedSelector);
  }

  async addAccount(account: Account): Promise<void> {
    const updatedAccountsOrder: Record<string, number> = await firstValueFrom(
      this.getAllAccounts().pipe(
        map((accounts) =>
          accounts.reduce(
            (result, account) => ({
              ...result,
              [account.id]: account.order + 1,
            }),
            {} as Record<string, number>
          )
        )
      )
    );

    this.store.dispatch(
      AccountsActions.addAccount({
        account,
        updatedAccountsOrder,
      })
    );
  }

  async removeAccount(accountId: string): Promise<void> {
    const account: Account = await firstValueFrom(this.getAccountById(accountId));

    const updatedAccountsOrder = await firstValueFrom(
      this.getAllAccounts().pipe(
        map((accounts) =>
          accounts.slice(account.order + 1).reduce(
            (result, account) => ({
              ...result,
              [account.id]: account.order - 1,
            }),
            {} as Record<string, number>
          )
        )
      )
    );

    this.store.dispatch(
      AccountsActions.removeAccount({
        accountId,
        updatedAccountsOrder,
      })
    );
  }

  bulkAccountChangeOrder(updatedAccountsOrder: Record<string, number>): void {
    this.store.dispatch(AccountsActions.bulkAccountChangeOrder({ updatedAccountsOrder }));
  }

  isAccountRemoving(categoryId: string): Observable<boolean> {
    return this.store.select(AccountsSelectors.isAccountRemovingSelector(categoryId));
  }

  getAccountManagementInProgress(): Observable<boolean> {
    return this.store.select(AccountsSelectors.accountManagementInProgressSelector);
  }

  getAccountManagementSuccess(): Observable<boolean> {
    return this.store.select(AccountsSelectors.accountManagementSuccessSelector);
  }

  getOrderChangingInProgress(): Observable<boolean> {
    return this.store.select(AccountsSelectors.orderChangingInProgressSelector);
  }

  getMovingMoneyBetweenAccountsInProgress(): Observable<boolean> {
    return this.store.select(AccountsSelectors.movingMoneyBetweenAccountsInProgressSelector);
  }

  getMovingMoneyBetweenAccountsSuccess(): Observable<boolean> {
    return this.store.select(AccountsSelectors.movingMoneyBetweenAccountsSuccessSelector);
  }
}
