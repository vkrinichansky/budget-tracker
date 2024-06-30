import { Injectable } from '@angular/core';
import { arrayUnion, collection, doc, DocumentReference, Firestore, getDoc, updateDoc } from '@angular/fire/firestore';
import { AuthFacadeService } from '@budget-tracker/auth';
import { firstValueFrom, from, map, switchMap } from 'rxjs';
import { BudgetTrackerState, BudgetType, CategoriesResetRecord, StatisticsSnapshot } from '../../models';
import { Auth } from '@angular/fire/auth';

const CATEGORIES_PATH = 'budget.categories';
const ACTIVITY_LOG_PATH = 'budget.activityLog';
const RESET_DATE_PATH = 'resetDate';
const STATISTICS_SNAPSHOTS_PATH = 'statistics.snapshots';

@Injectable()
export class DataInitService {
  constructor(
    private firestore: Firestore,
    private authFacade: AuthFacadeService,
    private afAuth: Auth
  ) {}

  async initData(): Promise<BudgetTrackerState> {
    return await firstValueFrom(
      this.authFacade.getUserId().pipe(
        switchMap((userId) => from(getDoc(doc(collection(this.firestore, 'userData'), userId)))),
        map((data) => data.data() as BudgetTrackerState)
      )
    );
  }

  resetData(
    data: BudgetTrackerState,
    activityLogRecords: CategoriesResetRecord[],
    statisticsSnapshot: StatisticsSnapshot,
    date: string
  ): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${CATEGORIES_PATH}.${BudgetType.Income}`]: data.budget.categories.income,
      [`${CATEGORIES_PATH}.${BudgetType.Expense}`]: data.budget.categories.expense,
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(...activityLogRecords),
      [`${RESET_DATE_PATH}`]: data.resetDate,
      [`${STATISTICS_SNAPSHOTS_PATH}.${date}`]: statisticsSnapshot,
    });
  }

  private getDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'userData'), this.afAuth.currentUser?.uid);
  }
}
