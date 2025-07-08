import { CurrenciesEnum } from '@budget-tracker/metadata';

export interface Account {
  id: string;
  name: string;
  value: number;
  currency: CurrenciesEnum;
  icon: string;
  bgColor: string;
  textColor: string;
  order: number;
}
