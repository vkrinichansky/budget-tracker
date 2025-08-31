import { CurrenciesEnum } from './currency.model';

export enum MetadataEvents {
  CHANGE_LANGUAGE = 'Change language',

  CURRENCY_CHANGE_START = 'Currency change start',
  CURRENCY_CHANGE_FINISH = 'Currency change finish',
  CURRENCY_CHANGE = 'Currency change',
}

export interface CurrencyChangeEvent {
  newCurrency: CurrenciesEnum;
}
