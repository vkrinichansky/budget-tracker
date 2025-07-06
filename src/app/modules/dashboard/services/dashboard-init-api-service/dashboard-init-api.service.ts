import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { AuthFacadeService } from '@budget-tracker/auth';
import { combineLatest, firstValueFrom, from, map, switchMap } from 'rxjs';
import { Account, Category, Dashboard, StatisticsSnapshot } from '@budget-tracker/models';
import { Auth } from '@angular/fire/auth';
import { getMonthAndYearString } from '@budget-tracker/utils';

const CATEGORIES_PATH = 'categories';
const RESET_DATE_PATH = 'resetDate';
const STATISTICS_SNAPSHOTS_PATH = 'snapshots';

@Injectable()
export class DashboardInitApiService {
  constructor(
    private firestore: Firestore,
    private authFacade: AuthFacadeService,
    private afAuth: Auth
  ) {}

  async initData(): Promise<Dashboard> {
    return await firstValueFrom(
      this.authFacade.getUserId().pipe(
        switchMap((userId) =>
          combineLatest([
            from(getDoc(doc(collection(this.firestore, 'categories'), userId))),
            from(getDoc(doc(collection(this.firestore, 'accounts'), userId))),
          ]).pipe(
            map(([categories, accounts]) => ({
              categories: categories.data() as Record<string, Category>,
              accounts: accounts.data() as Record<string, Account>,
              resetDate: getMonthAndYearString(),
            }))
          )
        ),
        map((data) => data as Dashboard)
      )
    );
  }

  async resetData(
    resetCategories: Record<string, Category>,
    resetDate: string,
    statisticsSnapshot: StatisticsSnapshot,
    date: string
  ): Promise<void> {
    await updateDoc(this.getSnapshotsDocRef(), {
      [`${STATISTICS_SNAPSHOTS_PATH}.${date}`]: statisticsSnapshot,
    });

    return updateDoc(this.getDashboardDocRef(), {
      [`${CATEGORIES_PATH}`]: resetCategories,
      [`${RESET_DATE_PATH}`]: resetDate,
    });
  }

  private getDashboardDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'dashboard'), this.afAuth.currentUser?.uid);
  }

  private getSnapshotsDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'snapshots'), this.afAuth.currentUser?.uid);
  }
}
