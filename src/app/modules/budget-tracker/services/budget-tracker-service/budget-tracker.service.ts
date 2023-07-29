import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc } from '@angular/fire/firestore';
import { BudgetTrackerState } from '@budget-tracker/shared';
import { Store } from '@ngrx/store';
import { AuthFacadeService, AuthSelectors } from '@budget-tracker/auth';
import { filter, firstValueFrom, from, map, Observable, switchMap } from 'rxjs';

@Injectable()
export class BudgetTrackerService {
  userId$: Observable<string>;

  constructor(private firestore: Firestore, private store: Store, private authFacade: AuthFacadeService) {
    this.userId$ = this.authFacade.getUserId();
  }

  async initData(): Promise<BudgetTrackerState> {
    return await firstValueFrom(
      this.store.select(AuthSelectors.authLoadedSelector).pipe(
        filter((isInitialized) => !!isInitialized),
        switchMap(() => this.userId$),
        switchMap((userId) => from(getDoc(doc(collection(this.firestore, 'userData'), userId)))),
        map((data) => data.data() as BudgetTrackerState)
      )
    );
  }
}
