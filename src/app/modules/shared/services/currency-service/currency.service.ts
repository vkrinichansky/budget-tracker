import { Injectable } from '@angular/core';
import { CurrenciesEnum, CurrencyLSKey, CurrencySymbolMapping } from '../../models';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private readonly currency = new BehaviorSubject<string>('');
  currency$ = this.currency.asObservable();

  setCurrencyToLS(currency: CurrenciesEnum): void {
    localStorage.setItem(CurrencyLSKey, currency);
  }

  getCurrencyFromLS(): CurrenciesEnum | undefined {
    const language = localStorage.getItem(CurrencyLSKey);
    if (language) {
      return language as CurrenciesEnum;
    }
    return undefined;
  }

  setCurrency(currency: CurrenciesEnum): void {
    this.currency.next(currency);
  }

  getCurrency(): CurrenciesEnum {
    return this.currency.value as CurrenciesEnum;
  }

  getCurrencyObs(): Observable<string> {
    return this.currency$;
  }

  getCurrencySymbolObs(): Observable<string> {
    return this.getCurrencyObs().pipe(map((currency) => CurrencySymbolMapping[currency as CurrenciesEnum]));
  }

  getCurrencySymbol(): string {
    return CurrencySymbolMapping[this.getCurrency()];
  }
}
