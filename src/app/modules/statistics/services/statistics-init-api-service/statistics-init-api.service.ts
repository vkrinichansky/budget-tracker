import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc } from '@angular/fire/firestore';
import { AuthFacadeService } from '@budget-tracker/auth';
import { Snapshots } from '@budget-tracker/models';
import { firstValueFrom, switchMap, from, map } from 'rxjs';

@Injectable()
export class StatisticsInitApiService {
  constructor(
    private firestore: Firestore,
    private authFacade: AuthFacadeService
  ) {}

  async initData(): Promise<Snapshots> {
    return await firstValueFrom(
      this.authFacade.getUserId().pipe(
        switchMap((userId) => from(getDoc(doc(collection(this.firestore, 'snapshots'), userId)))),
        map((data) => data.data() as Snapshots)
      )
    );
  }
}
