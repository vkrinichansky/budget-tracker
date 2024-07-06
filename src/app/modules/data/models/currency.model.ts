export interface Currency {
  id: string; // usd
  code: string; // USD
  icon: string; // flag
  symbol: string; // $
}

export const predefinedCurrencies: Currency[] = [
  {
    id: 'uah',
    code: 'UAH',
    icon: 'uaFlag',
    symbol: '₴',
  },
  {
    id: 'usd',
    code: 'USD',
    icon: 'usFlag',
    symbol: '$',
  },
  {
    id: 'eur',
    code: 'EUR',
    icon: 'euFlag',
    symbol: '€',
  },
];
