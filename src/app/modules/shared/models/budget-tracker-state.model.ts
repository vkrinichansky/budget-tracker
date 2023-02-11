import { Category } from './category.model';

export interface BudgetTrackerState {
  income: Category[];
  expense: Category[];
  balance: number;
  accumulation: number;
  free: number;
}
