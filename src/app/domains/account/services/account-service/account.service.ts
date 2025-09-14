import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Account, AccountEvents } from '../../models';
import { AccountActions, AccountSelectors } from '../../store';
import { Store } from '@ngrx/store';
import { MetadataService } from '@budget-tracker/metadata';
import { EventBusService } from '@budget-tracker/utils';
import { MoveMoneyBetweenAccountsEvent, EditAccountValueEvent } from '../../models/account.events';

@Injectable()
export class AccountService {
  constructor(
    private readonly store: Store,
    private readonly metadataService: MetadataService,
    private readonly eventBus: EventBusService
  ) {}

  // ===== SELECTORS =====
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

  // ===== ACTIONS =====
  async loadAccounts(): Promise<void> {
    const isLoaded = await firstValueFrom(this.accountsLoaded());

    if (!isLoaded) {
      this.store.dispatch(AccountActions.loadAccounts());
    }
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

    return this.eventBus.waitFor(AccountEvents.ADD_ACCOUNT);
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

    return this.eventBus.waitFor(AccountEvents.REMOVE_ACCOUNT, accountId);
  }

  async bulkAccountChangeOrder(updatedAccountsOrder: Record<string, number>): Promise<void> {
    this.store.dispatch(AccountActions.bulkAccountChangeOrder({ updatedAccountsOrder }));

    return this.eventBus.waitFor(AccountEvents.CHANGE_ACCOUNTS_ORDER);
  }

  updateAccounts(updatedAccounts: Account[]): void {
    this.store.dispatch(AccountActions.accountsUpdated({ updatedAccounts }));
  }

  // ===== FLOW TRIGGERS =====
  async runMoveMoneyBetweenAccountsFlow(
    fromAccountId: string,
    toAccountId: string,
    valueToMove: number,
    convertedValueToMove: number
  ): Promise<void> {
    this.eventBus.emit<MoveMoneyBetweenAccountsEvent>({
      type: AccountEvents.MOVE_MONEY_BETWEEN_ACCOUNTS_START,
      status: 'event',
      payload: {
        fromAccountId,
        toAccountId,
        valueToMove,
        convertedValueToMove,
      },
    });

    return this.eventBus.waitFor(AccountEvents.MOVE_MONEY_BETWEEN_ACCOUNTS_FINISH);
  }

  async editAccountValue(accountId: string, value: number, note: string): Promise<void> {
    this.eventBus.emit<EditAccountValueEvent>({
      type: AccountEvents.EDIT_ACCOUNT_VALUE_START,
      status: 'event',
      payload: {
        accountId,
        value,
        note,
      },
    });

    return this.eventBus.waitFor(AccountEvents.EDIT_ACCOUNT_VALUE_FINISH);
  }
}
