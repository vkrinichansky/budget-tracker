export const CurrencyLSKey = 'currency';

export enum CurrenciesEnum {
  UAH = 'uah',
  USD = 'usd',
  EUR = 'eur',
}

export interface Currency {
  id: string; // usd
  code: string; // USD
  icon: string; // flag
  symbol: string; // $
}

export const predefinedCurrenciesDictionary: Record<string, Currency> = {
  [CurrenciesEnum.UAH]: {
    id: CurrenciesEnum.UAH,
    code: 'UAH',
    icon: 'uaFlag',
    symbol: '₴',
  },
  [CurrenciesEnum.USD]: {
    id: CurrenciesEnum.USD,
    code: 'USD',
    icon: 'usFlag',
    symbol: '$',
  },
  [CurrenciesEnum.EUR]: {
    id: CurrenciesEnum.EUR,
    code: 'EUR',
    icon: 'euFlag',
    symbol: '€',
  },
};
