import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { RootValuesActions, RootValuesSelectors } from '../../store';
import { Store } from '@ngrx/store';
import { ActivityLogRecordType, RootValueActionType, RootValueChangeRecord, RootValueType } from '../../models';

@Injectable()
export class RootValuesFacadeService {
  constructor(private store: Store) {}

  getFullBalanceValue(): Observable<number> {
    return this.store.select(RootValuesSelectors.fullBalanceSelector);
  }

  getCurrentBalanceValue(): Observable<number> {
    return this.store.select(RootValuesSelectors.currentBalanceSelector);
  }

  getSavingsValue(): Observable<number> {
    return this.store.select(RootValuesSelectors.savingsSelector);
  }

  getFreeMoneyValue(): Observable<number> {
    return this.store.select(RootValuesSelectors.freeMoneySelector);
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

    this.store.dispatch(RootValuesActions.updateBalance({ newBalanceValue, activityLogRecord: balanceIncreaseRecord }));
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

    this.store.dispatch(RootValuesActions.updateBalance({ newBalanceValue, activityLogRecord: balanceDecreaseRecord }));
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

    this.store.dispatch(RootValuesActions.updateBalance({ newBalanceValue, activityLogRecord: balanceEditRecord }));
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

    this.store.dispatch(RootValuesActions.updateSavings({ newSavingsValue, activityLogRecord: savingsIncreaseRecord }));
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

    this.store.dispatch(RootValuesActions.updateSavings({ newSavingsValue, activityLogRecord: savingsDecreaseRecord }));
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

    this.store.dispatch(RootValuesActions.updateSavings({ newSavingsValue, activityLogRecord: savingsEditRecord }));
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
      RootValuesActions.updateFreeMoney({ newFreeMoneyValue, activityLogRecord: freeMoneyIncreaseRecord })
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
      RootValuesActions.updateFreeMoney({ newFreeMoneyValue, activityLogRecord: freeMoneyDecreaseRecord })
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
      RootValuesActions.updateFreeMoney({ newFreeMoneyValue, activityLogRecord: freeMoneyEditRecord })
    );
  }

  // VALUE UPDATING STATES
  getValueUpdatingInProgress(): Observable<boolean> {
    return this.store.select(RootValuesSelectors.valueUpdatingInProgressSelector);
  }

  getValueUpdatingSuccess(): Observable<boolean> {
    return this.store.select(RootValuesSelectors.valueUpdatingSuccessSelector);
  }

  getValueUpdatingError(): Observable<boolean> {
    return this.store.select(RootValuesSelectors.valueUpdatingErrorSelector);
  }
}
