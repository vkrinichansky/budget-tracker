import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  collection,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {
  LanguagesEnum,
  UserMetadata,
  ExchangeEndpointResponse,
  CurrenciesEnum,
} from '../../models';
import { getMonthAndYearString } from '@budget-tracker/utils';

@Injectable()
export class MetadataApiService {
  constructor(
    private readonly firestore: Firestore,
    private readonly http: HttpClient,
    private readonly afAuth: Auth
  ) {}

  async initMetadataDB(): Promise<void> {
    return setDoc(this.getDocRef(), {
      currency: CurrenciesEnum.USD,
      language: LanguagesEnum.English,
      resetDate: getMonthAndYearString(),
    });
  }

  async loadMetadata(): Promise<UserMetadata> {
    return getDoc(this.getDocRef()).then((data): UserMetadata => data.data() as UserMetadata);
  }

  getCurrencyExchangeRate(baseCurrency: string): Observable<ExchangeEndpointResponse> {
    return this.http.get<ExchangeEndpointResponse>(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency}.json`
    );
  }

  async changeCurrency(newCurrency: CurrenciesEnum): Promise<void> {
    return updateDoc(this.getDocRef(), {
      currency: newCurrency,
    });
  }

  changeLanguage(newLanguage: LanguagesEnum): Promise<void> {
    return updateDoc(this.getDocRef(), {
      language: newLanguage,
    });
  }

  private getDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'metadata'), this.afAuth.currentUser.uid);
  }
}
