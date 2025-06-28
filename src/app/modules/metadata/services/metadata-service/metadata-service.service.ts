import { Injectable } from '@angular/core';
import {
  CurrenciesEnum,
  CurrencyExchangeRate,
  LanguagesEnum,
  predefinedCurrenciesDictionary,
} from '@budget-tracker/models';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

interface ExchangeRates {
  [currency: string]: {
    [currency: string]: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  constructor(private readonly translateService: TranslateService) {}

  private readonly _isMetadataLoaded$ = new BehaviorSubject<boolean>(false);

  private _currency: CurrenciesEnum;
  private _currencyExchangeRate: CurrencyExchangeRate;

  setMetadata(
    currency: CurrenciesEnum,
    currencyExchangeRate: CurrencyExchangeRate,
    language: LanguagesEnum
  ): void {
    this._currency = currency;
    this._currencyExchangeRate = currencyExchangeRate;

    this.translateService.setDefaultLang(language);
    this.translateService.use(language);

    this._isMetadataLoaded$.next(true);
  }

  isMetadataLoadedObs(): Observable<boolean> {
    return this._isMetadataLoaded$;
  }

  getCurrentCurrency(): CurrenciesEnum {
    return this._currency;
  }

  getCurrencySymbol(currency?: CurrenciesEnum): string {
    return predefinedCurrenciesDictionary[currency || this._currency].symbol;
  }

  getConvertedValueForAccount(accountCurrency: CurrenciesEnum, accountValue: number): number {
    return Math.round(accountValue / this.getCurrentExchangeRate()[accountCurrency]);
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

  getCurrentLanguage(): LanguagesEnum {
    return this.translateService.getDefaultLang() as LanguagesEnum;
  }
}
