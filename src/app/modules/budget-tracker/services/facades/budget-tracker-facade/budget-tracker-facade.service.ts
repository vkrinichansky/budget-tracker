import { Injectable } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { Store } from '@ngrx/store';
import { firstValueFrom, map, Observable } from 'rxjs';
import { BudgetTrackerActions, BudgetTrackerSelectors } from '../../../store';
import {
  ActivityLog,
  ActivityLogGroupedByDays,
  ActivityLogGroupedByDaysInObject,
  ActivityLogRecordType,
  RootValueActionType,
  RootValueChangeRecord,
  RootValueType,
} from '@budget-tracker/shared';
import { v4 as uuid } from 'uuid';

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
  async increaseBalance(value: number, note: string): Promise<void> {
    const balance = await firstValueFrom(this.getFullBalanceValue());
    const newBalanceValue = balance + value;

    const balanceIncreaseRecord: RootValueChangeRecord = {
      recordType: ActivityLogRecordType.RootValueChange,
      valueType: RootValueType.Balance,
      actionType: RootValueActionType.Increase,
      value,
      date: new Date().getTime(),
      icon: 'equal-sign',
      id: uuid(),
      note,
    };

    this.store.dispatch(
      BudgetTrackerActions.updateBalance({ newBalanceValue, activityLogRecord: balanceIncreaseRecord })
    );
  }

  async decreaseBalance(value: number, note: string): Promise<void> {
    const balance = await firstValueFrom(this.getFullBalanceValue());
    const newBalanceValue = balance - value;

    const balanceDecreaseRecord: RootValueChangeRecord = {
      recordType: ActivityLogRecordType.RootValueChange,
      valueType: RootValueType.Balance,
      actionType: RootValueActionType.Decrease,
      value,
      date: new Date().getTime(),
      icon: 'equal-sign',
      id: uuid(),
      note,
    };

    this.store.dispatch(
      BudgetTrackerActions.updateBalance({ newBalanceValue, activityLogRecord: balanceDecreaseRecord })
    );
  }

  async editBalance(newBalanceValue: number, note: string): Promise<void> {
    const balance = await firstValueFrom(this.getFullBalanceValue());

    const balanceEditRecord: RootValueChangeRecord = {
      recordType: ActivityLogRecordType.RootValueChange,
      valueType: RootValueType.Balance,
      actionType: RootValueActionType.Edit,
      oldValue: balance,
      newValue: newBalanceValue,
      date: new Date().getTime(),
      icon: 'equal-sign',
      id: uuid(),
      note,
    };

    this.store.dispatch(BudgetTrackerActions.updateBalance({ newBalanceValue, activityLogRecord: balanceEditRecord }));
  }

  // SAVINGS
  async increaseSavings(value: number, note: string): Promise<void> {
    const savings = await firstValueFrom(this.getSavingsValue());
    const newSavingsValue = savings + value;

    const savingsIncreaseRecord: RootValueChangeRecord = {
      recordType: ActivityLogRecordType.RootValueChange,
      valueType: RootValueType.Savings,
      actionType: RootValueActionType.Increase,
      value,
      date: new Date().getTime(),
      icon: 'jar',
      id: uuid(),
      note,
    };

    this.store.dispatch(
      BudgetTrackerActions.updateSavings({ newSavingsValue, activityLogRecord: savingsIncreaseRecord })
    );
  }

  async decreaseSavings(value: number, note: string): Promise<void> {
    const savings = await firstValueFrom(this.getSavingsValue());
    const newSavingsValue = savings - value;

    const savingsDecreaseRecord: RootValueChangeRecord = {
      recordType: ActivityLogRecordType.RootValueChange,
      valueType: RootValueType.Savings,
      actionType: RootValueActionType.Decrease,
      value,
      date: new Date().getTime(),
      icon: 'jar',
      id: uuid(),
      note,
    };

    this.store.dispatch(
      BudgetTrackerActions.updateSavings({ newSavingsValue, activityLogRecord: savingsDecreaseRecord })
    );
  }

  async editSavings(newSavingsValue: number, note: string): Promise<void> {
    const savings = await firstValueFrom(this.getSavingsValue());

    const savingsEditRecord: RootValueChangeRecord = {
      recordType: ActivityLogRecordType.RootValueChange,
      valueType: RootValueType.Savings,
      actionType: RootValueActionType.Edit,
      oldValue: savings,
      newValue: newSavingsValue,
      date: new Date().getTime(),
      icon: 'jar',
      id: uuid(),
      note,
    };

    this.store.dispatch(BudgetTrackerActions.updateSavings({ newSavingsValue, activityLogRecord: savingsEditRecord }));
  }

  // FREE MONEY
  async increaseFreeMoney(value: number, note: string): Promise<void> {
    const freeMoney = await firstValueFrom(this.getFreeMoneyValue());
    const newFreeMoneyValue = freeMoney + value;

    const freeMoneyIncreaseRecord: RootValueChangeRecord = {
      recordType: ActivityLogRecordType.RootValueChange,
      valueType: RootValueType.FreeMoney,
      actionType: RootValueActionType.Increase,
      value,
      date: new Date().getTime(),
      icon: 'coins',
      id: uuid(),
      note,
    };

    this.store.dispatch(
      BudgetTrackerActions.updateFreeMoney({ newFreeMoneyValue, activityLogRecord: freeMoneyIncreaseRecord })
    );
  }

  async decreaseFreeMoney(value: number, note: string): Promise<void> {
    const freeMoney = await firstValueFrom(this.getFreeMoneyValue());
    const newFreeMoneyValue = freeMoney - value;

    const freeMoneyDecreaseRecord: RootValueChangeRecord = {
      recordType: ActivityLogRecordType.RootValueChange,
      valueType: RootValueType.FreeMoney,
      actionType: RootValueActionType.Decrease,
      value,
      date: new Date().getTime(),
      icon: 'coins',
      id: uuid(),
      note,
    };

    this.store.dispatch(
      BudgetTrackerActions.updateFreeMoney({ newFreeMoneyValue, activityLogRecord: freeMoneyDecreaseRecord })
    );
  }

  async editFreeMoney(newFreeMoneyValue: number, note: string): Promise<void> {
    const freeMoney = await firstValueFrom(this.getFreeMoneyValue());

    const freeMoneyEditRecord: RootValueChangeRecord = {
      recordType: ActivityLogRecordType.RootValueChange,
      valueType: RootValueType.FreeMoney,
      actionType: RootValueActionType.Edit,
      oldValue: freeMoney,
      newValue: newFreeMoneyValue,
      date: new Date().getTime(),
      icon: 'coins',
      id: uuid(),
      note,
    };

    this.store.dispatch(
      BudgetTrackerActions.updateFreeMoney({ newFreeMoneyValue, activityLogRecord: freeMoneyEditRecord })
    );
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

  // ACTIVITY LOG
  getActivityLogGroupedByDays(): Observable<ActivityLogGroupedByDays[]> {
    return this.store.select(BudgetTrackerSelectors.activityLogSelector).pipe(
      map((activityLog) => this.groupActivityLogByDaysInObject(activityLog)),
      map((activityLogInObject) => this.activityLogByDaysInObjectToArray(activityLogInObject))
    );
  }

  private groupActivityLogByDaysInObject(activityLog: ActivityLog): ActivityLogGroupedByDaysInObject {
    return activityLog
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .reduce((group, record) => {
        const date = new Date(record.date);
        const dateKey = date.toLocaleDateString('en', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        group[dateKey] = group[dateKey] ?? [];
        group[dateKey].push(record);
        return group;
      }, {} as ActivityLogGroupedByDaysInObject);
  }

  private activityLogByDaysInObjectToArray(
    activityLogInObject: ActivityLogGroupedByDaysInObject
  ): ActivityLogGroupedByDays[] {
    return Object.keys(activityLogInObject).map(
      (key) =>
        ({
          date: key,
          records: activityLogInObject[key].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        } as ActivityLogGroupedByDays)
    );
  }
}
