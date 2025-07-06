import { Category } from './category.model';
import { CurrenciesEnum } from '../modules/metadata/models/currency.model';

export interface StatisticsSnapshot {
  date: string;
  categories: Category[];
  income: number;
  expense: number;
  monthBalance: number;
  fullBalance: number;
  currency: CurrenciesEnum;
}
