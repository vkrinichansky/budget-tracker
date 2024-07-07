import { Injectable } from '@angular/core';
import { CurrenciesEnum, predefinedCurrenciesDictionary } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private _currency: CurrenciesEnum;

  setCurrentCurrency(currency: CurrenciesEnum): void {
    this._currency = currency;
  }

  getCurrentCurrency(): CurrenciesEnum {
    return this._currency;
  }

  getCurrencySymbol(): string {
    return predefinedCurrenciesDictionary[this._currency].symbol;
  }
}
