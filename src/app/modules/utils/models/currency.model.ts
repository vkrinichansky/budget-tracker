export const CurrencyLSKey = 'currency';

export enum CurrenciesEnum {
  Hryvnia = 'uah',
  Dollar = 'usd',
  Euro = 'eur',
}

export const CurrencySymbolMapping = {
  [CurrenciesEnum.Hryvnia]: '₴',
  [CurrenciesEnum.Dollar]: '$',
  [CurrenciesEnum.Euro]: '€',
};

export interface CurrencySwitcherData {
  [key: string]: {
    translationKey: string;
    short: string;
    icon: string;
  };
}

export const PredefinedCurrencies: CurrencySwitcherData = {
  [CurrenciesEnum.Hryvnia]: {
    translationKey: 'hryvnia',
    short: 'UAH',
    icon: 'uaFlag',
  },
  [CurrenciesEnum.Dollar]: {
    translationKey: 'dollar',
    short: 'USD',
    icon: 'usFlag',
  },
  [CurrenciesEnum.Euro]: {
    translationKey: 'euro',
    short: 'EUR',
    icon: 'euFlag',
  },
};
