import { createAction, props } from '@ngrx/store';
import { LanguagesEnum } from '../models';

export const MetadataActions = {
  loadMetadata: createAction('[Metadata] Load metadata'),
  metadataLoaded: createAction('[Metadata] Metadata loaded'),
  cleanState: createAction('[Metadata] Clean state'),

  changeLanguage: createAction(
    '[Metadata] Change language',
    props<{ newLanguage: LanguagesEnum }>()
  ),
};
