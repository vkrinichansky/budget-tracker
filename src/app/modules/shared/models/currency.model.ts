export const CurrencyLSKey = 'currency';

export enum CurrenciesEnum {
  Hryvnia = 'hryvnia',
  Dollar = 'dollar',
  Euro = 'euro',
}

export interface CurrencySwitcherData {
  [key: string]: {
    translationKey: string;
    icon: string;
  };
}

export const PredefinedCurrencies: CurrencySwitcherData = {
  [CurrenciesEnum.Hryvnia]: {
    translationKey: 'hryvnia',
    icon: 'uah',
  },
  [CurrenciesEnum.Dollar]: {
    translationKey: 'dollar',
    icon: 'usd',
  },
  [CurrenciesEnum.Euro]: {
    translationKey: 'euro',
    icon: 'eur',
  },
};

export const CurrencySymbolMapping = {
  [CurrenciesEnum.Hryvnia]: '₴',
  [CurrenciesEnum.Dollar]: '$',
  [CurrenciesEnum.Euro]: '€',
};
