import { Injectable } from '@angular/core';
import { updateDoc, arrayUnion } from '@angular/fire/firestore';
import { BudgetTrackerService } from '@budget-tracker/budget-tracker';
import { RootValueChangeRecord } from '@budget-tracker/shared';

@Injectable()
export class RootValuesService {
  constructor(private btService: BudgetTrackerService) {}

  updateBalance(newBalanceValue: number, activityLogRecord: RootValueChangeRecord): Promise<void> {
    return updateDoc(this.btService.getDocRef(), {
      ['budget.rootValues.balance']: newBalanceValue,
      ['budget.activityLog']: arrayUnion(activityLogRecord),
    });
  }

  updateSavings(newSavingsValue: number, activityLogRecord: RootValueChangeRecord): Promise<void> {
    return updateDoc(this.btService.getDocRef(), {
      ['budget.rootValues.savings']: newSavingsValue,
      ['budget.activityLog']: arrayUnion(activityLogRecord),
    });
  }

  updateFreeMoney(newFreeMoneyValue: number, activityLogRecord: RootValueChangeRecord): Promise<void> {
    return updateDoc(this.btService.getDocRef(), {
      ['budget.rootValues.freeMoney']: newFreeMoneyValue,
      ['budget.activityLog']: arrayUnion(activityLogRecord),
    });
  }
}
