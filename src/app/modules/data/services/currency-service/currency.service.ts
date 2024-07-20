import { Injectable } from '@angular/core';
import { Account, CurrenciesEnum, predefinedCurrenciesDictionary } from '../../models';
import { CurrencyExchangeService } from '../currency-exchange-service/currency-exchange.service';

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
}
