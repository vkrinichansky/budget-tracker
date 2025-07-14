import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, firstValueFrom, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MetadataActions } from '../../store';
import { AuthFacadeService } from '@budget-tracker/auth';
import { Store } from '@ngrx/store';
import { ActionListenerService, EventBusService } from '@budget-tracker/utils';
import {
  LanguagesEnum,
  CurrencyExchangeRate,
  predefinedCurrenciesDictionary,
  CurrenciesEnum,
  MetadataEvents,
  CurrencyChangeEvent,
} from '../../models';

interface ExchangeRates {
  [currency: string]: {
    [currency: string]: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  private readonly _isMetadataLoaded$ = new BehaviorSubject<boolean>(false);

  private _currency: CurrenciesEnum;
  private _currencyExchangeRate: CurrencyExchangeRate;
  private _exchangeRates: ExchangeRates;
  private _resetDate: string;

  get currentCurrency(): CurrenciesEnum {
    return this._currency;
  }

  get currencyExchangeRate(): CurrencyExchangeRate {
    return this._currencyExchangeRate;
  }

  get currentLanguage(): LanguagesEnum {
    return this.translateService.currentLang as LanguagesEnum;
  }

  get resetDate(): string {
    return this._resetDate;
  }

  constructor(
    private readonly translateService: TranslateService,
    private readonly authFacade: AuthFacadeService,
    private readonly store: Store,
    private readonly actionListener: ActionListenerService,
    private readonly eventBus: EventBusService
  ) {}

  async initMetadataDB(): Promise<void> {
    this.store.dispatch(MetadataActions.initMetadataDB());

    return this.eventBus.waitFor(MetadataEvents.INIT_METADATA_DB);
  }

  async loadMetadata(): Promise<void> {
    await firstValueFrom(this.authFacade.isLoggedIn().pipe(filter(Boolean)));

    this.store.dispatch(MetadataActions.loadMetadata());
  }

  async changeCurrency(newCurrency: CurrenciesEnum): Promise<void> {
    this.store.dispatch(MetadataActions.changeCurrency({ newCurrency }));

    return this.eventBus.waitFor(MetadataEvents.CURRENCY_CHANGE);
  }

  async runCurrencyChangeFlow(newCurrency: CurrenciesEnum): Promise<void> {
    this.eventBus.emit<CurrencyChangeEvent>({
      type: MetadataEvents.CURRENCY_CHANGE_START,
      status: 'event',
      payload: {
        newCurrency,
      },
    });

    return this.eventBus.waitFor(MetadataEvents.CURRENCY_CHANGE_FINISH);
  }

  async changeLanguage(newLanguage: LanguagesEnum): Promise<void> {
    this.store.dispatch(MetadataActions.changeLanguage({ newLanguage }));

    return this.eventBus.waitFor(MetadataEvents.CHANGE_LANGUAGE);
  }

  setMetadata(
    currency: CurrenciesEnum,
    currencyExchangeRate: CurrencyExchangeRate,
    language: LanguagesEnum,
    resetDate: string
  ): void {
    this._currency = currency;
    this._currencyExchangeRate = currencyExchangeRate;
    this._exchangeRates = this.convertRates(currency);
    this._resetDate = resetDate;

    this.translateService.setDefaultLang(language);
    this.translateService.use(language);

    this._isMetadataLoaded$.next(true);
  }

  clearMetadata(): void {
    this._isMetadataLoaded$.next(false);
    this._currency = undefined;
    this._currencyExchangeRate = undefined;
    this._exchangeRates = undefined;
    this._resetDate = undefined;
  }

  metadataLoaded(): Observable<boolean> {
    return this._isMetadataLoaded$;
  }

  getCurrencySymbol(currency?: CurrenciesEnum): string {
    return predefinedCurrenciesDictionary[currency || this._currency].symbol;
  }

  getConvertedValueForAccount(accountCurrency: CurrenciesEnum, accountValue: number): number {
    return Math.round(accountValue / this._currencyExchangeRate[accountCurrency]);
  }

  getBasicToForeignConvertedValue(value: number, currency: CurrenciesEnum): number {
    return Math.round(value / this._currencyExchangeRate[currency]);
  }

  convertCurrency(value: number, fromCurrency: CurrenciesEnum, toCurrency: CurrenciesEnum): number {
    const rate = this._exchangeRates[fromCurrency][toCurrency];

    return Math.round(value * rate);
  }

  private convertRates(baseCurrency: CurrenciesEnum): ExchangeRates {
    const rates = {
      [baseCurrency]: this._currencyExchangeRate,
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

    return { ...result, [baseCurrency]: this._currencyExchangeRate };
  }
}
