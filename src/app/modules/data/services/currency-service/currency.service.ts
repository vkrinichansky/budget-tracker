import { Injectable } from '@angular/core';
import { Account, CurrenciesEnum, predefinedCurrenciesDictionary } from '@budget-tracker/models';
import { CurrencyExchangeService } from '../currency-exchange-service/currency-exchange.service';

interface ExchangeRates {
  [currency: string]: {
    [currency: string]: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private _currency: CurrenciesEnum;

  constructor(private currencyExchangeService: CurrencyExchangeService) {}

  setCurrentCurrency(currency: CurrenciesEnum): void {
    this._currency = currency;
  }

  getCurrentCurrency(): CurrenciesEnum {
    return this._currency;
  }

  getCurrencySymbol(): string {
    return predefinedCurrenciesDictionary[this._currency].symbol;
  }

  getConvertedValueForAccount(account: Account): number {
    return Math.round(
      account.value / this.currencyExchangeService.getCurrentExchangeRate()[account.currency.id]
    );
  }

  getBasicToForeignConvertedValue(value: number, currency: CurrenciesEnum): number {
    return Math.round(value / this.currencyExchangeService.getCurrentExchangeRate()[currency]);
  }

  convertCurrency(
    amount: number,
    fromCurrency: CurrenciesEnum,
    toCurrency: CurrenciesEnum
  ): number {
    const rate = this.convertRates()[fromCurrency][toCurrency];

    return Math.round(amount * rate);
  }

  convertRates(): ExchangeRates {
    const baseCurrency = this.getCurrentCurrency();
    const rates = {
      [baseCurrency]: this.currencyExchangeService.getCurrentExchangeRate(),
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

    return { ...result, [baseCurrency]: this.currencyExchangeService.getCurrentExchangeRate() };
  }
}
