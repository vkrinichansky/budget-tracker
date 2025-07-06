import { Category } from './category.model';
import { CurrenciesEnum } from '@budget-tracker/metadata';

export interface StatisticsSnapshot {
  date: string;
  categories: Category[];
  income: number;
  expense: number;
  monthBalance: number;
  fullBalance: number;
  currency: CurrenciesEnum;
}
