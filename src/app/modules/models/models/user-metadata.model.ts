import { CurrenciesEnum } from './currency.model';
import { LanguagesEnum } from './language.model';

export interface UserMetadata {
  currency: CurrenciesEnum;
  language: LanguagesEnum;
}
