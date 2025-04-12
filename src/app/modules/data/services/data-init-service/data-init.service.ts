import { Injectable } from '@angular/core';
import {
  arrayUnion,
  collection,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { AuthFacadeService } from '@budget-tracker/auth';
import { firstValueFrom, from, map, Observable, switchMap } from 'rxjs';
import {
  CategoriesResetRecord,
  ExchangeEndpointResponse,
  StatisticsSnapshot,
  UserMetadata,
} from '@budget-tracker/models';
import { Auth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';

const CATEGORIES_PATH = 'budget.categories';
const ACTIVITY_LOG_PATH = 'budget.activityLog';
const RESET_DATE_PATH = 'resetDate';
const STATISTICS_SNAPSHOTS_PATH = 'statistics.snapshots';

@Injectable()
export class DataInitService {
  constructor(
    private firestore: Firestore,
    private authFacade: AuthFacadeService,
    private afAuth: Auth,
    private http: HttpClient
  ) {}

  async initData(): Promise<any> {
    // return await firstValueFrom(
    //   this.authFacade.getUserId().pipe(
    //     switchMap((userId) => from(getDoc(doc(collection(this.firestore, 'userData'), userId)))),
    //     map((data) => data.data() as AppDatabaseStructure)
    //   )
    // );
  }

  async initMetadata(): Promise<UserMetadata> {
    return await firstValueFrom(
      this.authFacade.getUserId().pipe(
        switchMap((userId) =>
          from(getDoc(doc(collection(this.firestore, 'userMetadata'), userId)))
        ),
        map((data) => data.data() as UserMetadata)
      )
    );
  }

  resetData(
    data: any,
    activityLogRecords: CategoriesResetRecord[],
    statisticsSnapshot: StatisticsSnapshot,
    date: string
  ): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${CATEGORIES_PATH}`]: data.budget.categories,
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(...activityLogRecords),
      [`${RESET_DATE_PATH}`]: data.resetDate,
      [`${STATISTICS_SNAPSHOTS_PATH}.${date}`]: statisticsSnapshot,
    });
  }

  getCurrencyExchangeRate(baseCurrency: string): Observable<ExchangeEndpointResponse> {
    return this.http.get<ExchangeEndpointResponse>(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency}.json`
    );
  }

  private getDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'userData'), this.afAuth.currentUser?.uid);
  }
}
