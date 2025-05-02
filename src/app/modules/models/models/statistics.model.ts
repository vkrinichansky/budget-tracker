import { Category } from './category.model';
import { CurrenciesEnum } from './currency.model';

export interface StatisticsSnapshot {
  date: string;
  categories: Category[];
  income: number;
  expense: number;
  monthBalance: number;
  totalBalance: number;
  currency: CurrenciesEnum;
}
