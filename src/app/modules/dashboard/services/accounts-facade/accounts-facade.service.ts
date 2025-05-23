import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import {
  Account,
  Category,
  CategoryValueChangeRecord,
  createCategoryValueChangeRecord,
  createMoveMoneyBetweenAccountsRecord,
  expenseAdjustmentCategory,
  incomeAdjustmentCategory,
  MoveMoneyBetweenAccountsRecord,
} from '@budget-tracker/models';
import { Store } from '@ngrx/store';
import {
  AccountsActions,
  AccountsSelectors,
  CategoriesActions,
  CategoriesSelectors,
} from '../../store';
import { CurrencyFacadeService } from '@budget-tracker/metadata';

@Injectable()
export class AccountsFacadeService {
  constructor(
    private store: Store,
    private currencyFacade: CurrencyFacadeService
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
        this.currencyFacade.getCurrentCurrency(),
        this.currencyFacade.getCurrentExchangeRate()
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

  async editAccountValue(accountId: string, newValue: number, note: string): Promise<void> {
    const account = await firstValueFrom(this.getAccountById(accountId));
    const difference = newValue - account.value;
    const absDifference = Math.abs(difference);
    const category: Category =
      difference > 0 ? incomeAdjustmentCategory : expenseAdjustmentCategory;

    let convertedValue: number;

    if (account.currency.id === this.currencyFacade.getCurrentCurrency()) {
      convertedValue = absDifference;
    } else {
      convertedValue = this.currencyFacade.getBasicToForeignConvertedValue(
        absDifference,
        account.currency.id
      );
    }

    const updatedCategoryValue = await firstValueFrom(
      this.getCategoryById(category.id).pipe(map((category) => category.value + convertedValue))
    );

    const addCategoryValueRecord: CategoryValueChangeRecord = createCategoryValueChangeRecord(
      category,
      account,
      absDifference,
      convertedValue,
      this.currencyFacade.getCurrentCurrency(),
      note
    );

    this.store.dispatch(
      CategoriesActions.changeCategoryValue({
        updatedCategoryId: category.id,
        updatedCategoryValue,
        updatedAccountId: accountId,
        updatedAccountValue: newValue,
        activityLogRecord: addCategoryValueRecord,
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
