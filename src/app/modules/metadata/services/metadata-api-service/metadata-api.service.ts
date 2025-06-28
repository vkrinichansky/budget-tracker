import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  collection,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import {
  CurrenciesEnum,
  ExchangeEndpointResponse,
  LanguagesEnum,
  UserMetadata,
} from '@budget-tracker/models';
import { firstValueFrom, from, map, Observable } from 'rxjs';

@Injectable()
export class MetadataApiService {
  constructor(
    private readonly firestore: Firestore,
    private readonly http: HttpClient,
    private readonly afAuth: Auth
  ) {}

  async initMetadata(): Promise<UserMetadata> {
    return await firstValueFrom(
      from(getDoc(this.getDocRef())).pipe(map((data): UserMetadata => data.data() as UserMetadata))
    );
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
