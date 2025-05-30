import { CurrenciesEnum, LanguagesEnum } from '@budget-tracker/models';
import { createAction, props } from '@ngrx/store';

export const MetadataActions = {
  loadMetadata: createAction('[Metadata] Load metadata'),
  metadataLoaded: createAction('[Metadata] Metadata loaded'),
  cleanState: createAction('[Metadata] Clean state'),
  changeCurrency: createAction(
    '[Metadata] Change currency',
    props<{ newCurrency: CurrenciesEnum }>()
  ),
  changeCurrencySuccess: createAction('[Metadata] Change currency success'),
  changeCurrencyFail: createAction('[Metadata] Change currency fail'),
  updateCategoriesAfterCurrencyChange: createAction(
    '[Metadata] Update categories after currency change',
    props<{ newCurrency: CurrenciesEnum }>()
  ),
  updateCategoriesAfterCurrencyChangeSuccess: createAction(
    '[Metadata] Update categories after currency change success'
  ),
  updateCategoriesAfterCurrencyChangeFail: createAction(
    '[Metadata] Update categories after currency change fail'
  ),
  changeLanguage: createAction(
    '[Metadata] Change language',
    props<{ newLanguage: LanguagesEnum }>()
  ),
  changeLanguageSuccess: createAction('[Metadata] Change language success'),
  changeLanguageFail: createAction('[Metadata] Change language fail'),
};
