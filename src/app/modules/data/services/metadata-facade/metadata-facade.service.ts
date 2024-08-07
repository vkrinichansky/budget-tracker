import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MetadataActions, MetadataSelectors } from '../../store';
import { Observable } from 'rxjs';
import { CurrenciesEnum, LanguagesEnum } from '../../models';

@Injectable()
export class MetadataFacadeService {
  constructor(private store: Store) {}

  changeCurrency(newCurrency: CurrenciesEnum): void {
    this.store.dispatch(MetadataActions.changeCurrency({ newCurrency }));
  }

  changeLanguage(newLanguage: LanguagesEnum): void {
    this.store.dispatch(MetadataActions.changeLanguage({ newLanguage }));
  }

  getCurrencyChangingInProgress(): Observable<boolean> {
    return this.store.select(MetadataSelectors.currencyChangingInProgressSelector);
  }

  getLanguageChangingInProgress(): Observable<boolean> {
    return this.store.select(MetadataSelectors.languageChangingInProgressSelector);
  }
}
