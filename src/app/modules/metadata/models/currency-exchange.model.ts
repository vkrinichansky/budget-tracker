export interface CurrencyExchangeRate {
  [currencyCode: string]: number;
}

export interface ExchangeEndpointResponse {
  date: string;
  [currencyCode: string]: CurrencyExchangeRate | string;
}
