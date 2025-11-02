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
import { getMonthAndYearString } from '@budget-tracker/shared-utils';

@Injectable()
export class MetadataApiService {
  constructor(
    private readonly firestore: Firestore,
    private readonly http: HttpClient,
    private readonly afAuth: Auth
  ) {}

  async loadMetadata(): Promise<UserMetadata> {
    const doc = await getDoc(this.getDocRef());

    if (doc.exists()) {
      return doc.data() as UserMetadata;
    }

    await setDoc(this.getDocRef(), {
      currency: CurrenciesEnum.USD,
      language: LanguagesEnum.ENGLISH,
      resetDate: getMonthAndYearString(),
    });

    return {
      currency: CurrenciesEnum.USD,
      language: LanguagesEnum.ENGLISH,
      resetDate: getMonthAndYearString(),
    };
  }

  getCurrencyExchangeRate(baseCurrency: string): Observable<ExchangeEndpointResponse> {
    return this.http.get<ExchangeEndpointResponse>(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency}.json`
    );
  }

  changeLanguage(newLanguage: LanguagesEnum): Promise<void> {
    return updateDoc(this.getDocRef(), {
      language: newLanguage,
    });
  }

  getDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'metadata'), this.afAuth.currentUser.uid);
  }
}
