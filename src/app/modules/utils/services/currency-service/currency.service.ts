import { Injectable } from '@angular/core';
import { CurrenciesEnum, CurrencyLSKey, predefinedCurrenciesDictionary } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private _currency: CurrenciesEnum;

  setCurrencyToLS(currency: CurrenciesEnum, shouldReload = false): void {
    localStorage.setItem(CurrencyLSKey, currency);

    if (shouldReload) {
      location.reload();
    }
  }

  initCurrency(): void {
    const language = localStorage.getItem(CurrencyLSKey);

    if (language) {
      this.setCurrentCurrency(language as CurrenciesEnum);
      return;
    }
    this.setCurrencyToLS(CurrenciesEnum.USD);
    this.setCurrentCurrency(CurrenciesEnum.USD);
  }

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
