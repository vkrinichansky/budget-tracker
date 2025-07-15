import { createAction, props } from '@ngrx/store';
import { CurrenciesEnum, LanguagesEnum } from '../models';

export const MetadataActions = {
  initMetadataDB: createAction('[Metadata] Init metadata DB'),
  loadMetadata: createAction('[Metadata] Load metadata'),
  metadataLoaded: createAction('[Metadata] Metadata loaded'),
  cleanState: createAction('[Metadata] Clean state'),

  changeCurrency: createAction(
    '[Metadata] Change currency',
    props<{ newCurrency: CurrenciesEnum }>()
  ),

  changeLanguage: createAction(
    '[Metadata] Change language',
    props<{ newLanguage: LanguagesEnum }>()
  ),
};
