import { CurrenciesEnum } from './currency.model';

export enum MetadataEvents {
  CHANGE_LANGUAGE = 'Change language',

  CURRENCY_CHANGE_START = 'Currency change start',
  CURRENCY_CHANGE_FINISH = 'Currency change finish',
}

export interface CurrencyChangeEvent {
  newCurrency: CurrenciesEnum;
}
