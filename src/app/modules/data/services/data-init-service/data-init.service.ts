import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc } from '@angular/fire/firestore';
import { AuthFacadeService } from '@budget-tracker/auth';
import { firstValueFrom, from, map, switchMap } from 'rxjs';
import { BudgetTrackerState } from '../../models';

@Injectable()
export class DataInitService {
  constructor(private firestore: Firestore, private authFacade: AuthFacadeService) {}

  async initData(): Promise<BudgetTrackerState> {
    return await firstValueFrom(
      this.authFacade.getUserId().pipe(
        switchMap((userId) => from(getDoc(doc(collection(this.firestore, 'userData'), userId)))),
        map((data) => data.data() as BudgetTrackerState)
      )
    );
  }
}
