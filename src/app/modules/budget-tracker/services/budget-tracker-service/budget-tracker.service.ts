import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc } from '@angular/fire/firestore';
import { BudgetTrackerState } from '@budget-tracker/shared';
import { Store } from '@ngrx/store';
import { AuthSelectors } from '@budget-tracker/auth';
import { filter, firstValueFrom, from, map, mergeMap } from 'rxjs';

@Injectable()
export class BudgetTrackerService {
  constructor(private firestore: Firestore, private store: Store) {}

  async initData(userId: string): Promise<BudgetTrackerState> {
    return await firstValueFrom(
      this.store.select(AuthSelectors.authLoadedSelector).pipe(
        filter((isInitialized) => !!isInitialized),
        mergeMap(() => {
          const dataCollection = collection(this.firestore, 'userData');

          return from(getDoc(doc(dataCollection, userId)));
        }),
        map((data) => data.data() as BudgetTrackerState)
      )
    );
  }
}
