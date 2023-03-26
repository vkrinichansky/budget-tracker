import { Injectable } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { Store } from '@ngrx/store';
import { firstValueFrom, Observable } from 'rxjs';
import { BudgetTrackerActions, BudgetTrackerSelectors } from '../../../store';

@Injectable()
export class BudgetTrackerFacadeService {
  constructor(private store: Store, private authFacade: AuthFacadeService) {}

  initData(): void {
    this.authFacade.initAuthState();
    this.store.dispatch(BudgetTrackerActions.init());
  }

  getIncomeValue(): Observable<number> {
    return this.store.select(BudgetTrackerSelectors.incomeValueSelector);
  }

  getExpenseValue(): Observable<number> {
    return this.store.select(BudgetTrackerSelectors.expenseValueSelector);
  }

  getFullBalanceValue(): Observable<number> {
    return this.store.select(BudgetTrackerSelectors.fullBalanceSelector);
  }

  getCurrentBalanceValue(): Observable<number> {
    return this.store.select(BudgetTrackerSelectors.currentBalanceSelector);
  }

  getSavingsValue(): Observable<number> {
    return this.store.select(BudgetTrackerSelectors.savingsSelector);
  }

  getFreeMoneyValue(): Observable<number> {
    return this.store.select(BudgetTrackerSelectors.freeMoneySelector);
  }

  // BALANCE
  async increaseBalance(value: number): Promise<void> {
    const balance = await firstValueFrom(this.getFullBalanceValue());
    const newBalanceValue = balance + value;

    this.store.dispatch(BudgetTrackerActions.updateBalance({ newBalanceValue }));
  }

  async decreaseBalance(value: number): Promise<void> {
    const balance = await firstValueFrom(this.getFullBalanceValue());
    const newBalanceValue = balance - value;

    this.store.dispatch(BudgetTrackerActions.updateBalance({ newBalanceValue }));
  }

  editBalance(newBalanceValue: number): void {
    this.store.dispatch(BudgetTrackerActions.updateBalance({ newBalanceValue }));
  }

  // SAVINGS
  async increaseSavings(value: number): Promise<void> {
    const savings = await firstValueFrom(this.getSavingsValue());
    const newSavingsValue = savings + value;

    this.store.dispatch(BudgetTrackerActions.updateSavings({ newSavingsValue }));
  }

  async decreaseSavings(value: number): Promise<void> {
    const savings = await firstValueFrom(this.getSavingsValue());
    const newSavingsValue = savings - value;

    this.store.dispatch(BudgetTrackerActions.updateSavings({ newSavingsValue }));
  }

  editSavings(newSavingsValue: number): void {
    this.store.dispatch(BudgetTrackerActions.updateSavings({ newSavingsValue }));
  }

  // FREE MONEY
  async increaseFreeMoney(value: number): Promise<void> {
    const freeMoney = await firstValueFrom(this.getFreeMoneyValue());
    const newFreeMoneyValue = freeMoney + value;

    this.store.dispatch(BudgetTrackerActions.updateFreeMoney({ newFreeMoneyValue }));
  }

  async decreaseFreeMoney(value: number): Promise<void> {
    const freeMoney = await firstValueFrom(this.getFreeMoneyValue());
    const newFreeMoneyValue = freeMoney - value;

    this.store.dispatch(BudgetTrackerActions.updateFreeMoney({ newFreeMoneyValue }));
  }

  editFreeMoney(newFreeMoneyValue: number): void {
    this.store.dispatch(BudgetTrackerActions.updateFreeMoney({ newFreeMoneyValue }));
  }

  // VALUE UPDATING STATES
  getValueUpdatingInProgress(): Observable<boolean> {
    return this.store.select(BudgetTrackerSelectors.valueUpdatingInProgressSelector);
  }

  getValueUpdatingSuccess(): Observable<boolean> {
    return this.store.select(BudgetTrackerSelectors.valueUpdatingSuccessSelector);
  }

  getValueUpdatingError(): Observable<boolean> {
    return this.store.select(BudgetTrackerSelectors.valueUpdatingErrorSelector);
  }
}
