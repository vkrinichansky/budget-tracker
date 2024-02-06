import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AuthFacadeService, AuthSelectors } from '@budget-tracker/auth';
import { filter, firstValueFrom, from, map, switchMap } from 'rxjs';
import { BudgetTrackerState } from '../../models';

@Injectable()
export class DataInitService {
  constructor(private firestore: Firestore, private store: Store, private authFacade: AuthFacadeService) {}

  async initData(): Promise<BudgetTrackerState> {
    return await firstValueFrom(
      this.store.select(AuthSelectors.authLoadedSelector).pipe(
        filter((isInitialized) => !!isInitialized),
        switchMap(() => this.authFacade.getUserId()),
        switchMap((userId) => from(getDoc(doc(collection(this.firestore, 'userData'), userId)))),
        map((data) => data.data() as BudgetTrackerState)
      )
    );
  }
}
