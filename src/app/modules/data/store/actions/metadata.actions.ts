import { createAction, props } from '@ngrx/store';
import { CurrenciesEnum, LanguagesEnum } from '../../models';

export const MetadataActions = {
  changeCurrency: createAction('[Metadata] Change currency', props<{ newCurrency: CurrenciesEnum }>()),
  changeLanguage: createAction('[Metadata] Change language', props<{ newLanguage: LanguagesEnum }>()),

  changeCurrencyFail: createAction('[Metadata] Change currency fail'),
  changeLanguageFail: createAction('[Metadata] Change language fail'),
};
