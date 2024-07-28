export enum CurrenciesEnum {
  UAH = 'uah',
  USD = 'usd',
  EUR = 'eur',
}

export interface Currency {
  id: CurrenciesEnum; // usd
  code: string; // USD
  icon: string; // flag
  symbol: string; // $
}

export interface CurrencyExchangeRate {
  [currencyCode: string]: number;
}

export interface ExchangeEndpointResponse {
  date: string;
  [currencyCode: string]: CurrencyExchangeRate | string;
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
