import { CurrenciesEnum, CurrencyExchangeRate, LanguagesEnum } from '@budget-tracker/models';
import { createAction, props } from '@ngrx/store';

export const MetadataActions = {
  loadMetadata: createAction('[Metadata] Load metadata'),
  metadataLoaded: createAction(
    '[Metadata] Metadata loaded',
    props<{
      currency: CurrenciesEnum;
      language: LanguagesEnum;
      currencyExchangeRate: CurrencyExchangeRate;
    }>()
  ),
  cleanState: createAction('[Metadata] Clean state'),
  changeCurrency: createAction(
    '[Metadata] Change currency',
    props<{ newCurrency: CurrenciesEnum }>()
  ),
  changeLanguage: createAction(
    '[Metadata] Change language',
    props<{ newLanguage: LanguagesEnum }>()
  ),
  changeCurrencyFail: createAction('[Metadata] Change currency fail'),
  changeLanguageFail: createAction('[Metadata] Change language fail'),
};
