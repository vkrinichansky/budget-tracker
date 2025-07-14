import { Injectable } from '@angular/core';
import { MetadataService } from '../metadata-service/metadata.service';
import { Observable } from 'rxjs';
import { LanguagesEnum, CurrencyExchangeRate, CurrenciesEnum } from '../../models';

@Injectable()
export class MetadataFacadeService {
  get currentCurrency(): CurrenciesEnum {
    return this.metadataService.currentCurrency;
  }

  get currentLanguage(): LanguagesEnum {
    return this.metadataService.currentLanguage;
  }

  get currencyExchangeRate(): CurrencyExchangeRate {
    return this.metadataService.currencyExchangeRate;
  }

  get resetDate(): string {
    return this.metadataService.resetDate;
  }

  constructor(private readonly metadataService: MetadataService) {}

  async initMetadataDB(): Promise<void> {
    return this.metadataService.initMetadataDB();
  }

  async loadMetadata(): Promise<void> {
    return this.metadataService.loadMetadata();
  }

  async changeCurrency(newCurrency: CurrenciesEnum): Promise<void> {
    return this.metadataService.changeCurrency(newCurrency);
  }

  async runCurrencyChangeFlow(newCurrency: CurrenciesEnum): Promise<void> {
    return this.metadataService.runCurrencyChangeFlow(newCurrency);
  }

  async changeLanguage(newLanguage: LanguagesEnum): Promise<void> {
    return this.metadataService.changeLanguage(newLanguage);
  }

  metadataLoaded(): Observable<boolean> {
    return this.metadataService.metadataLoaded();
  }

  getCurrencySymbol(currency?: CurrenciesEnum): string {
    return this.metadataService.getCurrencySymbol(currency);
  }

  getBasicToForeignConvertedValue(value: number, currency: CurrenciesEnum): number {
    return this.metadataService.getBasicToForeignConvertedValue(value, currency);
  }

  getConvertedValueForAccount(accountCurrency: CurrenciesEnum, accountValue: number): number {
    return this.metadataService.getConvertedValueForAccount(accountCurrency, accountValue);
  }

  convertCurrency(value: number, fromCurrency: CurrenciesEnum, toCurrency: CurrenciesEnum): number {
    return this.metadataService.convertCurrency(value, fromCurrency, toCurrency);
  }
}
