import { Injectable } from '@angular/core';
import { CurrencyExchangeRate, predefinedCurrenciesDictionary } from '@budget-tracker/models';

@Injectable({
  providedIn: 'root',
})
export class CurrencyExchangeService {
  private _currencyExchangeRate: CurrencyExchangeRate;

  setCurrentExchangeRate(exchangeRate: CurrencyExchangeRate): void {
    const result: CurrencyExchangeRate = {};

    Object.keys(predefinedCurrenciesDictionary).forEach((currency) => {
      result[currency] = exchangeRate[currency];
    });

    this._currencyExchangeRate = structuredClone(result);
  }

  getCurrentExchangeRate(): CurrencyExchangeRate {
    return this._currencyExchangeRate;
  }
}
