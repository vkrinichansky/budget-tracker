import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Account, AccountEvents } from '../../models';
import { AccountActions, AccountSelectors } from '../../store';
import { Store } from '@ngrx/store';
import { MetadataService } from '@budget-tracker/metadata';
import { EventBusService } from '@budget-tracker/utils';

@Injectable()
export class AccountService {
  constructor(
    private readonly store: Store,
    private readonly metadataService: MetadataService,
    private readonly eventBus: EventBusService
  ) {}

  async loadAccounts(): Promise<void> {
    const isLoaded = await firstValueFrom(this.accountsLoaded());

    if (!isLoaded) {
      this.store.dispatch(AccountActions.loadAccounts());
    }
  }

  accountsLoaded(): Observable<boolean> {
    return this.store.select(AccountSelectors.accountsLoadedSelector);
  }

  getAllAccounts(): Observable<Account[]> {
    return this.store.select(AccountSelectors.allAccountsSelector);
  }

  getAccountById(accountId: string): Observable<Account> {
    return this.store.select(AccountSelectors.accountByIdSelector(accountId));
  }

  getFullBallance(): Observable<number> {
    return this.store.select(
      AccountSelectors.fullBalanceSelector(
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

    this.store.dispatch(
      AccountActions.moveMoneyBetweenAccounts({
        fromAccountId,
        toAccountId,
        fromAccountNewValue,
        toAccountNewValue,
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
      AccountActions.addAccount({
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
      AccountActions.removeAccount({
        accountId,
        updatedAccountsOrder,
      })
    );
  }

  bulkAccountChangeOrder(updatedAccountsOrder: Record<string, number>): void {
    this.store.dispatch(AccountActions.bulkAccountChangeOrder({ updatedAccountsOrder }));
  }
}
