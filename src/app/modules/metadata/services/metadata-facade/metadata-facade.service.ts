import { Injectable } from '@angular/core';
import { MetadataService } from '../metadata-service/metadata-service.service';
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

  constructor(private readonly metadataService: MetadataService) {}

  async initMetadata(): Promise<void> {
    return this.metadataService.initMetadata();
  }

  async changeCurrency(newCurrency: CurrenciesEnum): Promise<void> {
    return this.metadataService.changeCurrency(newCurrency);
  }

  async changeLanguage(newLanguage: LanguagesEnum): Promise<void> {
    return this.metadataService.changeLanguage(newLanguage);
  }

  isMetadataLoadedObs(): Observable<boolean> {
    return this.metadataService.isMetadataLoadedObs();
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
