import { Currency } from '@budget-tracker/utils';

export interface Account {
  id: string;
  name: string;
  value: number;
  currency: Currency;
  icon: string;
  bgColor: string;
  textColor: string;
  isForeignCurrency: boolean;
}
