import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import {
  Account,
  Category,
  createMoveMoneyBetweenAccountsRecord,
  MoveMoneyBetweenAccountsRecord,
} from '@budget-tracker/models';
import { Store } from '@ngrx/store';
import { AccountsActions, AccountsSelectors, CategoriesSelectors } from '../../store';
import { MetadataService } from '@budget-tracker/metadata';

@Injectable()
export class AccountsFacadeService {
  constructor(
    private store: Store,
    private metadataService: MetadataService
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
        this.metadataService.currentCurrency,
        this.metadataService.currencyExchangeRate
      )
    );
  }

  getAccountsAmount(): Observable<number> {
    return this.getAllAccounts().pipe(map((accounts) => accounts.length));
  }

  getAccountsExist(): Observable<boolean> {
    return this.getAccountsAmount().pipe(map((amount) => !!amount));
  }

  getCategoryById(categoryId: string): Observable<Category> {
    return this.store.select(CategoriesSelectors.selectCategoryByIdSelector(categoryId));
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
    const activityLogRecord: MoveMoneyBetweenAccountsRecord = createMoveMoneyBetweenAccountsRecord(
      fromAccount,
      toAccount,
      valueToMove,
      convertedValueToMove
    );

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
}
