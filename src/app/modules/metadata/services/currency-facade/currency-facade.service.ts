import { Injectable } from '@angular/core';
import {
  Account,
  CurrenciesEnum,
  CurrencyExchangeRate,
  predefinedCurrenciesDictionary,
} from '@budget-tracker/models';
import { BehaviorSubject, Observable } from 'rxjs';

interface ExchangeRates {
  [currency: string]: {
    [currency: string]: number;
  };
}

@Injectable({ providedIn: 'root' })
export class CurrencyFacadeService {
  private readonly _currency$ = new BehaviorSubject<CurrenciesEnum>(null);
  private _currencyExchangeRate: CurrencyExchangeRate;

  setCurrentCurrency(currency: CurrenciesEnum): void {
    this._currency$.next(currency);
  }

  getCurrentCurrency(): CurrenciesEnum {
    return this._currency$.value;
  }

  getCurrentCurrencyObs(): Observable<CurrenciesEnum> {
    return this._currency$.asObservable();
  }

  getCurrencySymbol(): string {
    return predefinedCurrenciesDictionary[this._currency$.value].symbol;
  }

  getConvertedValueForAccount(account: Account): number {
    return Math.round(account.value / this.getCurrentExchangeRate()[account.currency.id]);
  }

  getBasicToForeignConvertedValue(value: number, currency: CurrenciesEnum): number {
    return Math.round(value / this.getCurrentExchangeRate()[currency]);
  }

  convertCurrency(value: number, fromCurrency: CurrenciesEnum, toCurrency: CurrenciesEnum): number {
    const rate = this.convertRates()[fromCurrency][toCurrency];

    return Math.round(value * rate);
  }

  convertRates(): ExchangeRates {
    const baseCurrency = this.getCurrentCurrency();
    const rates = {
      [baseCurrency]: this.getCurrentExchangeRate(),
    };

    const result: ExchangeRates = {};

    const baseRates = rates[baseCurrency];
    if (!baseRates) {
      throw new Error(`Base currency ${baseCurrency} not found.`);
    }

    // Calculate rates with new base currencies
    for (const [currency, rate] of Object.entries(baseRates)) {
      if (currency === baseCurrency) continue;

      // Convert the base currency to the new base currency
      result[currency] = {
        [baseCurrency]: 1 / rate, // Rate of new base to original base
      };

      // Convert the new base currency to all other currencies
      for (const [otherCurrency, otherRate] of Object.entries(baseRates)) {
        if (otherCurrency === baseCurrency) continue;
        result[currency][otherCurrency] = otherRate / rate;
      }
    }

    return { ...result, [baseCurrency]: this.getCurrentExchangeRate() };
  }

  setCurrentExchangeRate(exchangeRate: CurrencyExchangeRate): void {
    this._currencyExchangeRate = structuredClone(exchangeRate);
  }

  getCurrentExchangeRate(): CurrencyExchangeRate {
    return this._currencyExchangeRate;
  }
}
