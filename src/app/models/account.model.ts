import { Currency } from '../modules/metadata/models/currency.model';

export interface Account {
  id: string;
  name: string;
  value: number;
  currency: Currency;
  icon: string;
  bgColor: string;
  textColor: string;
  order: number;
}
