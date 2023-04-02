import { Injectable } from '@angular/core';
import {
  arrayUnion,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { BudgetTrackerState, RootValueChangeRecord } from '@budget-tracker/shared';
import { Store } from '@ngrx/store';
import { AuthFacadeService, AuthSelectors } from '@budget-tracker/auth';
import { filter, firstValueFrom, from, map, mergeMap, Observable, switchMap, tap } from 'rxjs';

@Injectable()
export class BudgetTrackerService {
  userId$: Observable<string>;

  dataCollection: CollectionReference<DocumentData>;

  docRef: DocumentReference;

  constructor(private firestore: Firestore, private store: Store, private authFacade: AuthFacadeService) {
    this.userId$ = this.authFacade.getUserId();
    this.dataCollection = collection(this.firestore, 'userData');
  }

  async initData(): Promise<BudgetTrackerState> {
    return await firstValueFrom(
      this.store.select(AuthSelectors.authLoadedSelector).pipe(
        filter((isInitialized) => !!isInitialized),
        switchMap(() => this.userId$),
        tap((userId) => (this.docRef = doc(this.dataCollection, userId))),
        mergeMap(() => from(getDoc(this.docRef))),
        map((data) => data.data() as BudgetTrackerState)
      )
    );
  }

  updateBalance(newBalanceValue: number, activityLogRecord: RootValueChangeRecord): Promise<void> {
    return updateDoc(this.docRef, { balance: newBalanceValue, activityLog: arrayUnion(activityLogRecord) });
  }

  updateSavings(newBalanceValue: number, activityLogRecord: RootValueChangeRecord): Promise<void> {
    return updateDoc(this.docRef, { savings: newBalanceValue, activityLog: arrayUnion(activityLogRecord) });
  }

  updateFreeMoney(newFreeMoneyValue: number, activityLogRecord: RootValueChangeRecord): Promise<void> {
    return updateDoc(this.docRef, { free: newFreeMoneyValue, activityLog: arrayUnion(activityLogRecord) });
  }
}
