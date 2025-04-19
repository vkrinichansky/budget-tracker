import { Category } from './category.model';

export interface StatisticsSnapshot {
  date: string;
  categories: Category[];
  income: number;
  expense: number;
  monthBalance: number;
  totalBalance: number;
}
