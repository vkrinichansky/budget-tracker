import { Injectable } from '@angular/core';
import { CurrenciesEnum, CurrencyLSKey, CurrencySymbolMapping } from '../../models';

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
    this.setCurrencyToLS(CurrenciesEnum.Dollar);
    this.setCurrentCurrency(CurrenciesEnum.Dollar);
  }

  setCurrentCurrency(currency: CurrenciesEnum): void {
    this._currency = currency;
  }

  getCurrentCurrency(): CurrenciesEnum {
    return this._currency;
  }

  getCurrencySymbol(): string {
    return CurrencySymbolMapping[this._currency];
  }
}
